import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const MainPage = () => {
  const navigate = useNavigate();

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobTitle, setJobTitle] = useState("");
  const [jdFile, setJdFile] = useState<File | null>(null);
  const [jdPreview, setJdPreview] = useState<string>("");
  const [interviewType, setInterviewType] = useState<
    "behavioral" | "technical" | "coding" | ""
  >("");

  const handleJDChange = (file: File) => {
    setJdFile(file);
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result as string;
      setJdPreview(text);
    };

    if (file.type === "text/plain" || file.name.endsWith(".txt")) {
      reader.readAsText(file);
    } else {
      setJdPreview("Preview not supported for this file type.");
    }
  };

  const handleContinue = () => {
    if (!interviewType) {
      alert("Please select the type of interview.");
      return;
    }
    if (jobTitle) localStorage.setItem("job_title", jobTitle);
    localStorage.setItem("interview_type", interviewType);

    if (interviewType === "coding") navigate("/interview/coding");
    else navigate("/interview/video");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-2xl bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8"
      >
        <h1 className="text-4xl font-bold text-center text-white mb-6">
          Mock Interview 
        </h1>
        <p className="text-center text-gray-300 mb-10 text-sm">
          Upload your resume, job description, and choose the type of interview.
        </p>

        {/* Resume Upload */}
        <div className="mb-6">
          <label className="text-white font-semibold block mb-2">
            Upload Resume:
          </label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
            className="w-full p-3 bg-white/5 border border-gray-600 text-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
          />
          {resumeFile && (
            <p className="mt-2 text-sm text-indigo-300">
              Selected: {resumeFile.name}
            </p>
          )}
        </div>

        {/* Job Role */}
        <div className="mb-6">
          <label className="text-white font-semibold block mb-2">
            What job are you applying for?
          </label>
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g., Data Scientist at Google"
            className="w-full p-3 bg-white/5 border border-gray-600 text-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 placeholder-gray-500"
          />
        </div>

        {/* JD Upload */}
        <div className="mb-6">
          <label className="text-white font-semibold block mb-2">
            Upload Job Description (TXT preferred):
          </label>
          <input
            type="file"
            accept=".txt,.pdf"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleJDChange(file);
            }}
            className="w-full p-3 bg-white/5 border border-gray-600 text-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
          />
          {jdFile && (
            <p className="mt-2 text-sm text-indigo-300">
              Selected: {jdFile.name}
            </p>
          )}
          {jdPreview && (
            <div className="mt-3 p-4 bg-white/10 rounded-lg text-gray-200 max-h-60 overflow-y-auto border border-gray-700">
              <h4 className="font-semibold text-indigo-300 mb-2">
                JD Preview:
              </h4>
              <pre className="whitespace-pre-wrap text-sm">{jdPreview}</pre>
            </div>
          )}
        </div>

        {/* Interview Type */}
        <div className="mb-6">
          <label className="text-white font-semibold block mb-3">
            Select Type of Mock Interview:
          </label>
          <div className="flex gap-6">
            {["behavioral", "technical", "coding"].map((type) => (
              <label
                key={type}
                className={`cursor-pointer px-4 py-2 rounded-full text-sm border transition-all duration-200 ${
                  interviewType === type
                    ? "bg-indigo-600 text-white border-indigo-400"
                    : "bg-white/5 text-gray-300 border-gray-600 hover:bg-indigo-600/40 hover:text-white"
                }`}
              >
                <input
                  type="radio"
                  name="interviewType"
                  value={type}
                  checked={interviewType === type}
                  onChange={() => setInterviewType(type as any)}
                  className="hidden"
                />
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </label>
            ))}
          </div>
        </div>

        {/* Continue Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleContinue}
          className="w-full py-3 mt-6 text-lg font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-500 transition-all duration-200 shadow-lg shadow-indigo-500/30"
        >
          Continue →
        </motion.button>
      </motion.div>
    </div>
  );
};

export default MainPage;
