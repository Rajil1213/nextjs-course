import React, { SyntheticEvent, useState } from "react";

import { GetStaticProps } from "next";

import { buildFilePath, readFeedbackFromFile } from "../api/feedback";

interface FeedbackProps {
  feedbacks: Array<any>;
}

const Feedback: React.FC<FeedbackProps> = (props) => {
  const [feedbackMetadata, setFeedbackMetadata] = useState<string>("");

  const fetchMetadata = (id: string) => {
    fetch(`/api/feedback/${id}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setFeedbackMetadata(data.feedback.email);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <ul>
        {props.feedbacks.map((feedback: any) => (
          <li key={feedback.id}>
            <p>{feedback.feedback}</p>
            <button
              onClick={(e: SyntheticEvent) => {
                e.preventDefault();
                fetchMetadata(feedback.id);
              }}
            >
              Show Details
            </button>
          </li>
        ))}
      </ul>
      {feedbackMetadata && <p>Details: {feedbackMetadata}</p>}
    </>
  );
};

export const getStaticProps: GetStaticProps<FeedbackProps> = () => {
  const filePath = buildFilePath("feedback.json");
  const data = readFeedbackFromFile(filePath);

  return {
    props: {
      feedbacks: data
    },
    revalidate: 10
  };
};

export default Feedback;
