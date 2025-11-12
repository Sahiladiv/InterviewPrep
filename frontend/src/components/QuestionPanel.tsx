import React from "react";
import { Spinner, Badge } from "react-bootstrap";
import { formatQuestionText } from "./utils/format";

interface Question {
  question_title: string;
  description: string;
  input_format: string;
  output_format: string;
  constraints: string;
  example_input?: string;
  example_output?: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tags?: string[];
}

export const QuestionPanel: React.FC<{ question: Question | null; loading: boolean }> = ({
  question,
  loading,
}) => {
  if (loading)
    return (
      <div className="d-flex align-items-center gap-2 text-black">
        <Spinner animation="border" size="sm" />
        <span>Generating question...</span>
      </div>
    );

  if (!question?.question_title)
    return <p className="text-gray-600">Click "Generate New Question" to begin.</p>;

  return (
    <div className="text-black bg-white p-4 rounded-xl shadow-md">
      {/* Title and Difficulty */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold">{question.question_title}</h5>
        <Badge
          bg={
            question.difficulty === "Easy"
              ? "success"
              : question.difficulty === "Medium"
              ? "warning"
              : "danger"
          }
          text={question.difficulty === "Medium" ? "dark" : "light"}
        >
          {question.difficulty}
        </Badge>
      </div>

      {/* Tags */}
      {question.tags?.length > 0 && (
        <div className="mb-3">
          {question.tags.map((tag, i) => (
            <Badge
              key={i}
              bg="secondary"
              className="me-2 mb-1"
              style={{ fontSize: "0.8rem" }}
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Text Sections */}
      {["description", "input_format", "output_format", "constraints"].map((field) => (
        <p
          key={field}
          className="text-black leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: `<strong>${field.replace("_", " ")}:</strong> ${formatQuestionText(
              question[field as keyof Question] as string
            )}`,
          }}
        />
      ))}

      {/* Examples */}
      {question.example_input && (
        <>
          <p className="text-black fw-semibold mt-3">Example Input:</p>
          <pre className="bg-gray-100 text-black p-3 rounded-md">
            {question.example_input}
          </pre>
        </>
      )}
      {question.example_output && (
        <>
          <p className="text-black fw-semibold mt-3">Example Output:</p>
          <pre className="bg-gray-100 text-black p-3 rounded-md">
            {question.example_output}
          </pre>
        </>
      )}
    </div>
  );
};
