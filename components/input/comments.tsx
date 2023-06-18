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

  const addCommentHandler = (commentData: CommentData) => {
    // send data to API
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
