import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, servicesTable } from "@workspace/db";
import {
  CreateServiceBody,
  UpdateServiceBody,
  UpdateServiceParams,
  DeleteServiceParams,
  GetServiceParams,
  ListServicesResponse,
  GetServiceResponse,
  UpdateServiceResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

function mapService(s: typeof servicesTable.$inferSelect) {
  return {
    ...s,
    price: Number(s.price),
    createdAt: s.createdAt instanceof Date ? s.createdAt.toISOString() : String(s.createdAt),
  };
}

router.get("/services", async (_req, res): Promise<void> => {
  const services = await db
    .select()
    .from(servicesTable)
    .orderBy(servicesTable.createdAt);
  res.json(ListServicesResponse.parse(services.map(mapService)));
});

router.post("/services", async (req, res): Promise<void> => {
  const parsed = CreateServiceBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [service] = await db
    .insert(servicesTable)
    .values({
      ...parsed.data,
      price: String(parsed.data.price),
    })
    .returning();
  res.status(201).json(GetServiceResponse.parse(mapService(service)));
});

router.get("/services/:id", async (req, res): Promise<void> => {
  const params = GetServiceParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [service] = await db
    .select()
    .from(servicesTable)
    .where(eq(servicesTable.id, params.data.id));
  if (!service) {
    res.status(404).json({ error: "Service not found" });
    return;
  }
  res.json(GetServiceResponse.parse(mapService(service)));
});

router.patch("/services/:id", async (req, res): Promise<void> => {
  const params = UpdateServiceParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateServiceBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const updateData: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.price !== undefined) {
    updateData.price = String(parsed.data.price);
  }
  const [service] = await db
    .update(servicesTable)
    .set(updateData)
    .where(eq(servicesTable.id, params.data.id))
    .returning();
  if (!service) {
    res.status(404).json({ error: "Service not found" });
    return;
  }
  res.json(UpdateServiceResponse.parse(mapService(service)));
});

router.delete("/services/:id", async (req, res): Promise<void> => {
  const params = DeleteServiceParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [service] = await db
    .delete(servicesTable)
    .where(eq(servicesTable.id, params.data.id))
    .returning();
  if (!service) {
    res.status(404).json({ error: "Service not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
