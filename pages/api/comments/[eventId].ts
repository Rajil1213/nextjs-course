import { NextApiHandler } from "next";

const handler: NextApiHandler = (req, res) => {
  if (req.method === "POST") {
    const { email, name, text } = JSON.parse(req.body);

    // validate
    if (
      !email ||
      email.trim().length === 0 ||
      !name ||
      name.trim().length === 0 ||
      !text ||
      text.trim().length === 0
    ) {
      res.status(422).json({ message: "Invalid Input" });
      return;
    }

    const newComment = { id: new Date().toISOString(), email, name, text };
    res.status(201).json({ message: "Comment added successfully", comment: newComment });
  } else if (req.method === "GET") {
    const fakeComments = [
      { id: "c1", email: "Alice", text: "First Comment!" },
      { id: "c2", email: "Bob", text: "Second Comment!" }
    ];

    res.status(200).json({ data: fakeComments });
  }
  return;
};

export default handler;
