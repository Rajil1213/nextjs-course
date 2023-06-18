import { NextApiHandler } from "next";

const handler: NextApiHandler = (req, res) => {
  if (req.method !== "POST") return;

  console.log(req.body.email);
  res.status(201).json({ message: "signed up successfully" });
};

export default handler;
