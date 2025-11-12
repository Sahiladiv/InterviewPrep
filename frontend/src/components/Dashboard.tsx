import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState({
    codingSolved: 0,
    interviewsGiven: 0,
  });
  const [feedbacks, setFeedbacks] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await api.get("/auth/me/");
        setUser(userRes.data);

        const subRes = await api.get("/submissions/");
        setSubmissions(subRes.data);

        // Example analytics logic (customize based on your API schema)
        const codingCount = subRes.data.filter((s: any) => s.type === "coding").length;
        const interviewCount = subRes.data.filter((s: any) => s.type === "interview").length;
        setAnalytics({ codingSolved: codingCount, interviewsGiven: interviewCount });

        // Example AI feedbacks (replace with API call if available)
        const feedbackRes = await api.get("/feedbacks/");
        setFeedbacks(feedbackRes.data.map((f: any) => f.text));
      } catch (err) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
      }
    };
    fetchData();
  }, [navigate]);

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col items-center px-8 py-12">
      {/* Header */}
      <div className="w-full flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          Welcome, {user?.username || "User"} 👋
        </h1>
        <button
          onClick={() => navigate("/interview")}
          className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-cyan-400 hover:to-blue-500 rounded-xl text-lg font-semibold shadow-md hover:shadow-cyan-500/30 transition-all duration-300"
        >
          Mock Interview
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mb-12">
        <div className="bg-gray-900 bg-opacity-70 p-6 rounded-2xl border border-gray-700 shadow-xl hover:shadow-blue-500/30 transition">
          <h3 className="text-xl font-semibold text-blue-400">Coding Questions Solved</h3>
          <p className="text-4xl font-bold mt-3">{analytics.codingSolved}</p>
        </div>
        <div className="bg-gray-900 bg-opacity-70 p-6 rounded-2xl border border-gray-700 shadow-xl hover:shadow-cyan-500/30 transition">
          <h3 className="text-xl font-semibold text-cyan-400">Video Interviews Given</h3>
          <p className="text-4xl font-bold mt-3">{analytics.interviewsGiven}</p>
        </div>
        <div className="bg-gray-900 bg-opacity-70 p-6 rounded-2xl border border-gray-700 shadow-xl hover:shadow-pink-500/30 transition">
          <h3 className="text-xl font-semibold text-pink-400">Total Submissions</h3>
          <p className="text-4xl font-bold mt-3">{submissions.length}</p>
        </div>
      </div>

      {/* Feedback Section */}
      <div className="w-full max-w-6xl bg-gray-900 bg-opacity-60 rounded-2xl border border-gray-700 p-8 shadow-lg backdrop-blur-md">
        <h2 className="text-2xl font-semibold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
          AI Feedback & Reviews
        </h2>

        {feedbacks.length > 0 ? (
          <ul className="space-y-4">
            {feedbacks.map((text, i) => (
              <li
                key={i}
                className="p-4 bg-gray-800 rounded-xl border border-gray-700 hover:border-pink-400/40 transition"
              >
                <p className="text-gray-300">{text}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic">No feedback yet. Complete an interview to receive AI feedback!</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
