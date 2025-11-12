// src/components/Feedback.tsx
import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Feedback = ({ submissionId }: { submissionId: number }) => {
  const [feedback, setFeedback] = useState<any>(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      const res = await api.get('/feedbacks/');
      const fb = res.data.find((f: any) => f.submission.id === submissionId);
      setFeedback(fb);
    };
    fetchFeedback();
  }, [submissionId]);

  if (!feedback) return <p>Waiting for feedback...</p>;

  return (
    <div>
      <h3>Feedback:</h3>
      <p>{feedback.comments}</p>
      <p><strong>Rating:</strong> {feedback.rating}/5</p>
    </div>
  );
};

export default Feedback;
