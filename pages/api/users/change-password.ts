import { NextApiHandler } from "next";
import { getServerSession } from "next-auth";

import { find, update } from "@/services/db";

import { authOptions } from "../auth/[...nextauth]";

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "PATCH") return;

  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    console.log(session);
    res.status(401).json({ message: "Not Authenticated" });
    return;
  }

  const user = session.user;
  if (!user) {
    res.status(401).json({ message: "Not Authenticated" });
    return;
  }

  const email = user.email;
  const userInDB = find("users").find((user: { email: string }) => user.email === email);

  if (!userInDB) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  const oldPassword = JSON.parse(req.body).oldPassword;
  const newPassword = JSON.parse(req.body).newPassword;

  if (userInDB.password !== oldPassword) {
    res.status(422).json({ message: "wrong password" });
    return;
  }

  update("users", { email: userInDB.email, password: newPassword });
  res.status(201).json({ message: "password updated successfully" });
};

export default handler;
