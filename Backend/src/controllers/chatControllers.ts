import { NextFunction, Request, Response } from "express";
import User from "../models/User.js";
import { configureOpenAI } from "../config/openAI-config.js";
import type OpenAI from "openai";

export const generateChatCompletion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { message } = req.body;
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user)
      return res
        .status(401)
        .json({ message: "User not registered OR Token malfunctioned" });

    // grab chats of user
    const chats: OpenAI.Chat.ChatCompletionMessageParam[] = user.chats.map(
      ({ role, content }) => ({
        role: role as "user" | "assistant" | "system",
        content,
      })
    );
    chats.push({ content: message, role: "user" });

    // send all chats with new one to openAI API
    const openai = configureOpenAI();
    const model = process.env.OPENAI_MODEL || "openai/gpt-oss-120b";

    // get latest response
    const chatResponse = await openai.chat.completions.create({
      model,
      messages: chats,
    });

    const botMessage = chatResponse.choices[0]?.message;
    if (!botMessage || !botMessage.content) {
      return res.status(500).json({ message: "No response from OpenAI" });
    }

    user.chats.push({ content: message, role: "user" });
    user.chats.push({ content: botMessage.content, role: "assistant" });
    await user.save();

    return res.status(200).json({ chats: user.chats });
  } catch (error: any) {
    console.error("OpenAI Error:", error);
    const errorMessage =
      error?.error?.message ||
      error?.response?.data?.error?.message ||
      error?.message ||
      "Something went wrong";
    const status =
      typeof error?.status === "number" && error.status >= 400 && error.status < 600
        ? error.status
        : 500;
    return res.status(status).json({
      message: errorMessage,
      cause: errorMessage,
    });
  }
};

export const sendChatsToUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //user token check
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User not registered OR Token malfunctioned");
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permissions didn't match");
    }
    return res.status(200).json({ message: "OK", chats: user.chats });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "ERROR",
      cause: error instanceof Error ? error.message : error,
    });
  }
};

export const deleteChats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //user token check
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User not registered OR Token malfunctioned");
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permissions didn't match");
    }
    //@ts-ignore
    user.chats = [];
    await user.save();
    return res.status(200).json({ message: "OK" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "ERROR",
      cause: error instanceof Error ? error.message : error,
    });
  }
};
