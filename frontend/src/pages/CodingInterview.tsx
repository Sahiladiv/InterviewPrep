// CodingInterview.tsx
import React, { useState, useCallback, useEffect } from "react";
import { Container, Button, Form } from "react-bootstrap";
import { QuestionPanel } from "../components/QuestionPanel";
import CodeEditorPanel from "../components/CodeEditor";
import { refreshAccessToken } from "../utils/auth";

const BASE_URL = "http://127.0.0.1:8000/api";

const CodingInterview = () => {
  const [questionLoading, setQuestionLoading] = useState(false);
  const [question, setQuestion] = useState<any>(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [output, setOutput] = useState("");

  const handleGenerateQuestion = useCallback(async () => {
    setQuestionLoading(true);
    let token = localStorage.getItem("access");

    try {
      let res = await fetch(`${BASE_URL}/generate-coding-question/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if ([401, 403].includes(res.status)) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          res = await fetch(`${BASE_URL}/generate-coding-question/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${newToken}`,
            },
          });
        }
      }

      const data = await res.json();
      setQuestion(data.question || null);
    } catch (err) {
      console.error("Network error:", err);
    } finally {
      setQuestionLoading(false);
    }
  }, []);

  useEffect(() => {
    const templates: Record<string, string> = {
      python: "# Write your solution here\ndef solve():\n    pass",
      cpp: "// Write your solution here\n#include <bits/stdc++.h>\nint main() {\n  return 0;\n}",
      java: "// Write your solution here\npublic class Solution {\n  public static void main(String[] args) {}\n}",
      javascript: "// Write your solution here\nfunction solve() {\n}",
    };
    setCode(templates[language]);
  }, [language]);

  const handleRun = () => {
    setOutput("✅ Code executed successfully.\n(Mock Output: 42)\nExecution Time: 0.03s");
  };

  return (
    <div style={{ height: "100vh", width:"100%", overflow: "hidden", background: "#f8f9fa", display: "flex", flexDirection: "column" }}>
      <div style={{ background: "black", padding: "0.8rem 1.5rem", display: "flex", justifyContent: "space-between" }}>
        <h5>Coding Interview Arena</h5>
        <Button variant="outline-primary" size="sm" onClick={handleGenerateQuestion}>
          {questionLoading ? "Loading..." : "Generate New Question"}
        </Button>
      </div>

      <Container fluid className="p-0" style={{ flex: 1, display: "flex" }}>
        <div
          style={{
            flexBasis: "45%",
            minWidth: "400px",
            maxWidth: "50%",
            borderRight: "1px solid #dee2e6",
            overflowY: "auto",
            background: "#ffffff",
            padding: "1.5rem",
          }}
        >
          <QuestionPanel question={question} loading={questionLoading} />
        </div>

        <div
          style={{
            flexGrow: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            background: "#1e1e1e",
          }}
        >
          <div
            style={{
              background: "#2d2d2d",
              padding: "0.5rem 1rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid #444",
            }}
          >
            <Form.Select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{
                width: "150px",
                background: "#2d2d2d",
                color: "#fff",
                border: "1px solid #444",
              }}
            >
              <option value="python">Python</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
              <option value="javascript">JavaScript</option>
            </Form.Select>
            <div>
              <Button variant="success" size="sm" className="me-2" onClick={handleRun}>
                Run
              </Button>
              <Button variant="primary" size="sm">Submit</Button>
            </div>
          </div>

          <CodeEditorPanel language={language} code={code} setCode={setCode} />

          <div style={{ background: "#111", color: "#0f0", fontFamily: "Consolas, monospace", fontSize: "0.9rem", padding: "0.75rem 1rem", borderTop: "1px solid #333", height: "120px", overflowY: "auto" }}>
            {output || "Console output will appear here..."}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CodingInterview;
