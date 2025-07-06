import User from "../models/user.model.js";
import uploadOncloudinary from "../configs/cloudinary.js";
import geminiResponse from "../gemini.js";
import { json, response } from "express";
import moment from "moment"

export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).select("-password -__v");
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        return res.status(200).json({ user });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "get current user error" });
    }
}

export const updateAssistant = async (req, res) => {
    try {
        console.log("📦 req.file received by multer:", req.file);
        const { assistantName, imageUrl } = req.body;
        let assistantImage;

        if (req.file) {
            assistantImage = await uploadOncloudinary(req.file.path);
        } else {
            assistantImage = req.body.imageUrl; // fallback for predefined image
        }

        console.log("Cloudinary image URL:", assistantImage);

        const user = await User.findByIdAndUpdate(
            req.userId,
            { assistantName, assistantImage },
            { new: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error("updateAssistant error:", error);
        return res.status(400).json({ message: "Update assistant error" });
    }
};

export const asktoAssistant = async (req, res) => {
  try {
    const { command } = req.body;
    const user = await User.findById(req.userId);

    user.history.push(command)
    user.save()
    const userName = user.name;
    const assistantName = user.assistantName;

    const result = await geminiResponse(command, assistantName, userName);

    const jsonMatch = result.match(/{[\s\S]*}/);

    if (!jsonMatch) {
      return res.status(400).json({ message: "Invalid response format from Gemini" });
    }

    const gemResult = JSON.parse(jsonMatch[0]);
    const { type, userInput, response } = gemResult;

    switch (type) {
      case 'get-date':
        return res.json({
          type,
          userInput,
          response: `Current date is ${moment().format("YYYY-MM-DD")}`
        });
      case 'get-time':
        return res.json({
          type,
          userInput,
          response: `Current time is ${moment().format("hh:mm A")}`
        });
      case 'get-day':
        return res.json({
          type,
          userInput,
          response: `Today is ${moment().format("dddd")}`
        });
      case 'get-month':
        return res.json({
          type,
          userInput,
          response: `Current month is ${moment().format("MMMM")}`
        });
      case 'google-search':
      case 'youtube-search':
      case 'youtube-play':
      case 'general':
      case 'calculator-open':
      case 'instagram-open':
      case 'facebook-open':
      case 'weather-show':
        return res.json({ type, userInput, response });
      default:
        return res.status(500).json({ response: "I didn't understand that command." });
    }
    

  } catch (error) {
    console.error("❌ Error in asktoAssistant:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
