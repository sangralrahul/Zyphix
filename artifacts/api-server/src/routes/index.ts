import { Router, type IRouter } from "express";
import healthRouter from "./health";
import notifyRouter from "./notify";
import partnerRegisterRouter from "./partner-register";
import emailOtpRouter from "./email-otp";

const router: IRouter = Router();

router.use(healthRouter);
router.use(notifyRouter);
router.use(partnerRegisterRouter);
router.use(emailOtpRouter);

export default router;
