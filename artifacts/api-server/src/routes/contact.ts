import { Router, type IRouter } from "express";
import { db, contactMessagesTable } from "@workspace/db";
import {
  CreateContactMessageBody,
  ListContactMessagesResponse,
  ListContactMessagesResponseItem,
} from "@workspace/api-zod";

const router: IRouter = Router();

function mapMessage(m: typeof contactMessagesTable.$inferSelect) {
  return {
    ...m,
    createdAt: m.createdAt instanceof Date ? m.createdAt.toISOString() : String(m.createdAt),
  };
}

router.get("/contact", async (_req, res): Promise<void> => {
  const messages = await db
    .select()
    .from(contactMessagesTable)
    .orderBy(contactMessagesTable.createdAt);
  res.json(ListContactMessagesResponse.parse(messages.map(mapMessage)));
});

router.post("/contact", async (req, res): Promise<void> => {
  const parsed = CreateContactMessageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [message] = await db
    .insert(contactMessagesTable)
    .values({ ...parsed.data, isRead: false })
    .returning();
  res.status(201).json(ListContactMessagesResponseItem.parse(mapMessage(message)));
});

export default router;
