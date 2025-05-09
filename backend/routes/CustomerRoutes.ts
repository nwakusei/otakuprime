import { Router } from "express";
import CustomerController from "../controllers/CustomerController.js";

const router = Router();

// Middlewares
import verifyToken from "../helpers/verify-token.js";
import { imageUpload } from "../helpers/image-upload.js";
import { validateRegisterInput } from "../helpers/validate-register-input.js";

router.post(
	"/register",
	validateRegisterInput,
	imageUpload.single("image"),
	CustomerController.register
);
router.get("/:id", CustomerController.getCustomerById);

router.post("/follow-store/:id", verifyToken, CustomerController.followStore);

router.post(
	"/unfollow-store/:id",
	verifyToken,
	CustomerController.unfollowStore
);

router.patch(
	"/edit",
	verifyToken,
	// imageUpload.single("profileImage"),
	imageUpload.fields([
		{ name: "profileImage", maxCount: 1 },
		{ name: "logoImage", maxCount: 1 },
	]),
	CustomerController.editCustomer
);

export default router;
