import { Router, type IRouter } from "express";
import healthRouter from "./health";
import servicesRouter from "./services";
import appointmentsRouter from "./appointments";
import galleryRouter from "./gallery";
import reviewsRouter from "./reviews";
import contactRouter from "./contact";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(servicesRouter);
router.use(appointmentsRouter);
router.use(galleryRouter);
router.use(reviewsRouter);
router.use(contactRouter);
router.use(adminRouter);

export default router;
