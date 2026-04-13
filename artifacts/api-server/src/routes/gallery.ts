import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, galleryTable } from "@workspace/db";
import {
  CreateGalleryImageBody,
  DeleteGalleryImageParams,
  ListGalleryResponse,
  ListGalleryResponseItem,
} from "@workspace/api-zod";

const router: IRouter = Router();

function mapGallery(g: typeof galleryTable.$inferSelect) {
  return {
    ...g,
    createdAt: g.createdAt instanceof Date ? g.createdAt.toISOString() : String(g.createdAt),
  };
}

router.get("/gallery", async (_req, res): Promise<void> => {
  const images = await db
    .select()
    .from(galleryTable)
    .orderBy(galleryTable.sortOrder, galleryTable.createdAt);
  res.json(ListGalleryResponse.parse(images.map(mapGallery)));
});

router.post("/gallery", async (req, res): Promise<void> => {
  const parsed = CreateGalleryImageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [image] = await db.insert(galleryTable).values(parsed.data).returning();
  res.status(201).json(ListGalleryResponseItem.parse(mapGallery(image)));
});

router.delete("/gallery/:id", async (req, res): Promise<void> => {
  const params = DeleteGalleryImageParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [image] = await db
    .delete(galleryTable)
    .where(eq(galleryTable.id, params.data.id))
    .returning();
  if (!image) {
    res.status(404).json({ error: "Image not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
