import { useEffect, useState } from "react";

import { useRouter } from "next/router";

import classes from "./commentList.module.css";
import { CommentData } from "./comments";

const CommentList: React.FC = () => {
  const router = useRouter();
  const { eventId } = router.query;

  const [comments, setComments] = useState<Array<{ id: string } & CommentData>>([]);

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/comments/${eventId}`);
      const { data } = await res.json();
      setComments(data);
    })();
  }, [setComments, eventId]);

  return (
    <ul className={classes.comments}>
      {/* Render list of comments - fetched from API */}
      {comments.map((comment) => {
        return (
          <li key={comment.id}>
            <p>{comment.text}</p>
            <div>
              By <address>{comment.email}</address>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default CommentList;
