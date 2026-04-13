import { Router, type IRouter } from "express";
import { eq, and, sql } from "drizzle-orm";
import { db, appointmentsTable, servicesTable } from "@workspace/db";
import {
  CreateAppointmentBody,
  UpdateAppointmentBody,
  UpdateAppointmentParams,
  DeleteAppointmentParams,
  GetAppointmentParams,
  GetAvailableSlotsQueryParams,
  ListAppointmentsResponse,
  GetAppointmentResponse,
  UpdateAppointmentResponse,
  GetAvailableSlotsResponse,
  GetAppointmentStatsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

const ALL_TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30",
];

function mapAppointment(a: typeof appointmentsTable.$inferSelect) {
  return {
    ...a,
    createdAt: a.createdAt instanceof Date ? a.createdAt.toISOString() : String(a.createdAt),
  };
}

router.get("/appointments/available-slots", async (req, res): Promise<void> => {
  const params = GetAvailableSlotsQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const { date, serviceId } = params.data;

  const bookedSlots = await db
    .select({ timeSlot: appointmentsTable.timeSlot })
    .from(appointmentsTable)
    .where(
      and(
        eq(appointmentsTable.appointmentDate, date),
        eq(appointmentsTable.serviceId, serviceId),
        sql`${appointmentsTable.status} != 'cancelled'`
      )
    );

  const bookedSet = new Set(bookedSlots.map((b) => b.timeSlot));
  const slots = ALL_TIME_SLOTS.map((time) => ({
    time,
    available: !bookedSet.has(time),
  }));

  res.json(GetAvailableSlotsResponse.parse({ date, slots }));
});

router.get("/appointments/stats", async (_req, res): Promise<void> => {
  const all = await db.select().from(appointmentsTable);
  const today = new Date().toISOString().split("T")[0];
  const stats = {
    total: all.length,
    pending: all.filter((a) => a.status === "pending").length,
    confirmed: all.filter((a) => a.status === "confirmed").length,
    completed: all.filter((a) => a.status === "completed").length,
    cancelled: all.filter((a) => a.status === "cancelled").length,
    todayCount: all.filter((a) => a.appointmentDate === today).length,
  };
  res.json(GetAppointmentStatsResponse.parse(stats));
});

router.get("/appointments", async (_req, res): Promise<void> => {
  const appointments = await db
    .select()
    .from(appointmentsTable)
    .orderBy(appointmentsTable.createdAt);
  res.json(ListAppointmentsResponse.parse(appointments.map(mapAppointment)));
});

router.post("/appointments", async (req, res): Promise<void> => {
  const parsed = CreateAppointmentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const existing = await db
    .select()
    .from(appointmentsTable)
    .where(
      and(
        eq(appointmentsTable.appointmentDate, parsed.data.appointmentDate),
        eq(appointmentsTable.timeSlot, parsed.data.timeSlot),
        eq(appointmentsTable.serviceId, parsed.data.serviceId),
        sql`${appointmentsTable.status} != 'cancelled'`
      )
    );

  if (existing.length > 0) {
    res.status(409).json({ error: "This time slot is already booked" });
    return;
  }

  const [service] = await db
    .select()
    .from(servicesTable)
    .where(eq(servicesTable.id, parsed.data.serviceId));

  const serviceName = service?.name ?? "Unknown Service";

  const [appointment] = await db
    .insert(appointmentsTable)
    .values({ ...parsed.data, serviceName })
    .returning();

  res.status(201).json(GetAppointmentResponse.parse(mapAppointment(appointment)));
});

router.get("/appointments/:id", async (req, res): Promise<void> => {
  const params = GetAppointmentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [appointment] = await db
    .select()
    .from(appointmentsTable)
    .where(eq(appointmentsTable.id, params.data.id));
  if (!appointment) {
    res.status(404).json({ error: "Appointment not found" });
    return;
  }
  res.json(GetAppointmentResponse.parse(mapAppointment(appointment)));
});

router.patch("/appointments/:id", async (req, res): Promise<void> => {
  const params = UpdateAppointmentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateAppointmentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [appointment] = await db
    .update(appointmentsTable)
    .set(parsed.data)
    .where(eq(appointmentsTable.id, params.data.id))
    .returning();
  if (!appointment) {
    res.status(404).json({ error: "Appointment not found" });
    return;
  }
  res.json(UpdateAppointmentResponse.parse(mapAppointment(appointment)));
});

router.delete("/appointments/:id", async (req, res): Promise<void> => {
  const params = DeleteAppointmentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [appointment] = await db
    .delete(appointmentsTable)
    .where(eq(appointmentsTable.id, params.data.id))
    .returning();
  if (!appointment) {
    res.status(404).json({ error: "Appointment not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
