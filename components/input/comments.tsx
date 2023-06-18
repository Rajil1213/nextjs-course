import { useState } from "react";

import CommentList from "./commentList";
import classes from "./comments.module.css";
import NewComment from "./newComment";

interface CommentsProps {
  eventId: string;
}

export interface CommentData {
  email: string;
  name: string;
  text: string;
}

const Comments: React.FC<CommentsProps> = (props) => {
  const { eventId } = props;

  const [showComments, setShowComments] = useState(false);

  const toggleCommentsHandler = () => {
    setShowComments((prevStatus) => !prevStatus);
  };

  const addCommentHandler = async (commentData: CommentData) => {
    // send data to API
    const result = await fetch(`/api/comments/${eventId}`, {
      method: "POST",
      body: JSON.stringify({ ...commentData })
    });
    const data = await result.json();
    console.log(data);
  };

  return (
    <section className={classes.comments}>
      <button onClick={toggleCommentsHandler}>{showComments ? "Hide" : "Show"} Comments</button>
      {showComments && <NewComment onAddComment={addCommentHandler} />}
      {showComments && <CommentList />}
    </section>
  );
};

export default Comments;
