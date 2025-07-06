import express from "express";
import { login, logout, signup } from "../controllers/auth.controllers.js";
import {asktoAssistant, getCurrentUser}from "../controllers/user.controller.js";
import  isAuth from "../middleware/isAuth.js";
import { updateAssistant } from "../controllers/user.controller.js";
import upload from "../middleware/multer.js";

const userRoutes = express.Router()

userRoutes.get("/current" , isAuth , getCurrentUser);
userRoutes.post("/update", isAuth , upload.single ("assistantImage") , updateAssistant);
userRoutes.post("/asktoassistant", isAuth, asktoAssistant)

export default userRoutes;