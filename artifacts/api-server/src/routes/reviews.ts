import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, reviewsTable } from "@workspace/db";
import {
  CreateReviewBody,
  ApproveReviewParams,
  DeleteReviewParams,
  ListReviewsQueryParams,
  ListReviewsResponse,
  ListReviewsResponseItem,
  ApproveReviewResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

function mapReview(r: typeof reviewsTable.$inferSelect) {
  return {
    ...r,
    createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : String(r.createdAt),
  };
}

router.get("/reviews", async (req, res): Promise<void> => {
  const params = ListReviewsQueryParams.safeParse(req.query);

  let reviews;
  if (params.success && params.data.approved === "false") {
    reviews = await db
      .select()
      .from(reviewsTable)
      .orderBy(reviewsTable.createdAt);
  } else {
    reviews = await db
      .select()
      .from(reviewsTable)
      .where(eq(reviewsTable.isApproved, true))
      .orderBy(reviewsTable.createdAt);
  }

  res.json(ListReviewsResponse.parse(reviews.map(mapReview)));
});

router.post("/reviews", async (req, res): Promise<void> => {
  const parsed = CreateReviewBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [review] = await db
    .insert(reviewsTable)
    .values({ ...parsed.data, isApproved: false })
    .returning();
  res.status(201).json(ListReviewsResponseItem.parse(mapReview(review)));
});

router.patch("/reviews/:id/approve", async (req, res): Promise<void> => {
  const params = ApproveReviewParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [review] = await db
    .update(reviewsTable)
    .set({ isApproved: true })
    .where(eq(reviewsTable.id, params.data.id))
    .returning();
  if (!review) {
    res.status(404).json({ error: "Review not found" });
    return;
  }
  res.json(ApproveReviewResponse.parse(mapReview(review)));
});

router.delete("/reviews/:id", async (req, res): Promise<void> => {
  const params = DeleteReviewParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [review] = await db
    .delete(reviewsTable)
    .where(eq(reviewsTable.id, params.data.id))
    .returning();
  if (!review) {
    res.status(404).json({ error: "Review not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
