import { NextApiHandler } from "next";

import { buildFilePath, readFeedbackFromFile } from "./";

const handler: NextApiHandler = (req, res) => {
  const feedbackId = req.query.feedbackId;
  const filePath = buildFilePath("feedback.json");
  const feedbackData = readFeedbackFromFile(filePath);

  const selectedFeedback = feedbackData.find((feedback) => (feedback as any).id === feedbackId);

  if (selectedFeedback) {
    res.status(200).json({ feedback: selectedFeedback });
  } else {
    res.status(404).json({ message: `Feedback with id ${feedbackId} not found` });
  }
};

export default handler;
