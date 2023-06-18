import { readFileSync, writeFileSync } from "fs";
import { NextApiHandler, NextApiRequest } from "next";
import path from "path";

export const buildFilePath = (filename: string): string => {
  return path.join(process.cwd(), "data", filename);
};

export const readFeedbackFromFile = (filepath: string): unknown[] => {
  try {
    const fileContents = readFileSync(filepath);
    const data = JSON.parse(fileContents.toString()) as unknown[];
    return data;
  } catch (err: unknown) {
    console.log(err);
    return [];
  }
};

const handler: NextApiHandler = (req: NextApiRequest, res) => {
  if (req.method === "POST") {
    const { email, feedback } = req.body;

    const newFeedback = {
      id: new Date().toISOString(),
      email,
      feedback
    };

    try {
      const filepath = buildFilePath("feedback.json");
      const contents = readFeedbackFromFile(filepath);
      contents.push(newFeedback);
      writeFileSync(filepath, JSON.stringify(contents));
    } catch (err: unknown) {
      res.status(500).json({ message: "failed" });
      console.log(err);
      return;
    }

    res.status(201).json({ message: "feedback received", feedback: newFeedback });
  } else if (req.method === "GET") {
    const filepath = buildFilePath("feedback.json");
    const contents = readFeedbackFromFile(filepath);

    res.status(200).json({ feedback: contents });
  } else {
    res.status(200).json({ message: "Hello from the API" });
  }
};

export default handler;
