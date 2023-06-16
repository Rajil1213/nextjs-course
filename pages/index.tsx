import { useRef, useState } from 'react';

function HomePage() {
  const emailRef = useRef<HTMLInputElement>(null);
  const feedbackRef = useRef<HTMLTextAreaElement>(null);
  const [feedbacks, setFeedbacks] = useState<[]>([]);

  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const email = emailRef.current?.value;
    const feedback = feedbackRef.current?.value;

    const result = await fetch("/api/feedback", {
      method: "POST",
      body: JSON.stringify({ email, feedback }),
      headers: {
        "Content-Type": "application/json"
      }
    });

    console.log(await result.json());
  };

  const loadFeedbackHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const result = await fetch("/api/feedback");
    const data = await result.json();
    setFeedbacks(data.feedback);
  };

  return (
    <div>
      <h1>The Home Page</h1>
      <form onSubmit={submitHandler}>
        <div>
          <label htmlFor="email">Your Email Address</label>
          <input type="email" id="email" ref={emailRef} />
        </div>

        <div>
          <label htmlFor="feedback">Your Feedback</label>
          <textarea name="feebdack" id="feedback" cols={30} rows={5} ref={feedbackRef}></textarea>
        </div>
        <button type="submit">Send Feedback</button>
      </form>
      <hr />
      <button onClick={loadFeedbackHandler}>Load Feedback</button>
      <ul>
        {feedbacks.map((feedback: any) => (
          <li key={feedback.id}>
            <p>{feedback.feedback}</p>
            <blockquote>- {feedback.email}</blockquote>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HomePage;
