import { NextApiHandler } from "next";

import { insert } from "@/services/db";

const handler: NextApiHandler = (req, res) => {
  if (req.method !== "POST") return;

  const { email, password } = JSON.parse(req.body);

  // validate
  if (!email || !email.includes("@") || !password || password.trim().lenght == 0) {
    res.status(422).json({ message: "Invalid Input" });
    return;
  }

  const result = insert("users", { email, password });
  res.status(201).json({ message: "Created user", user: result });
};

export default handler;
