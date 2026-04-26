import { Router } from "express";

import { createOrder, getOrders } from "../Controllers/orderController.ts";

const router = Router();

router.post("/", createOrder);
router.get("/", getOrders);

export default router;
