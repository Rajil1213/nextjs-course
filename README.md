# Project: API Routes

## Introduction

- Adding a newsletter registration flow and comments feature

## Adding a `newsletter` route

- Create `/api/newsletter/register.ts`
  ```tsx
  import { NextApiHandler } from "next";

  const handler: NextApiHandler = (req, res) => {
    if (req.method !== "POST") return;

    console.log(req.body.email);
  };

  export default handler;
  ```
- Create the logic to invoke this api:
  ```tsx
  // components/newsletterRegistration.tsx
  ...

  	const registrationHandler = async (event: React.SyntheticEvent) => {
      event.preventDefault();

      // fetch user input (state or refs)
      const email = emailRef.current?.value;

      ///// optional: validate input

      // send valid data to API
      const result = await fetch("/api/newsletter/register", {
        method: "POST",
        body: JSON.stringify({ email })
      });

      console.log(result);
  	};
  ```

## Adding a Comments Route

- This api must be linked to a specific event so, we will create the path `/api/comments/[eventId]`.
  ```tsx
  import { NextApiHandler } from "next";

  import { CommentData } from "../../../components/input/comments";

  const handler: NextApiHandler = (req, res) => {
    const { eventId } = req.query;

    if (req.method === "POST") {
      // validate
      const { email, name, text } = JSON.parse(req.body) as CommentData;

      if (
        !email ||
        email.trim().length === 0 ||
        !name ||
        name.trim().length === 0 ||
        !text ||
        text.trim().length == 0
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
  ```
- Then, we invoke this API in the `newComment`, `comments` and `commentsList` components:

#### Connecting to DB

- This is beyond the scope of this course (see other backend courses for MongoDB connection, perhaps the [vidly](https://github.com/Rajil1213/vidly) repo)
