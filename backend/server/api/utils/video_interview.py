from langgraph.graph import StateGraph, END
from langchain_groq import ChatGroq
from langchain.schema import SystemMessage, HumanMessage
from typing import TypedDict, Optional, List
from dotenv import load_dotenv
import os

load_dotenv()

# Load credentials
api_key = os.getenv("GROQ_API_KEY")
model = os.getenv("GROQ_MODEL", "mixtral-8x7b-32768")

# Initialize Groq LLM
llm = ChatGroq(
    temperature=0.3,
    model_name=model,
    groq_api_key=api_key
)

# Define the interview state
class InterviewState(TypedDict):
    current_question: Optional[str]
    user_answer: Optional[str]
    evaluation_feedback: Optional[str]
    followup_questions: Optional[List[str]]
    followup_answer: Optional[str]
    question_index: int
    done: bool
    role: Optional[str]
    history: List[dict]

# ------------------------- NODES -------------------------

def ask_question_node(state: InterviewState) -> InterviewState:
    """Dynamically generate the next interview question."""
    idx = state.get("question_index", 0)
    if idx >= 5:  # limit to 5 questions
        return {**state, "done": True}

    previous_qas = state.get("history", [])
    context = "\n".join(
        [f"Q: {qa['question']}\nA: {qa['answer']}" for qa in previous_qas]
    )

    prompt = [
        SystemMessage(
            content="You are a technical interviewer conducting a structured mock interview."
        ),
        HumanMessage(
            content=f"""
You are interviewing a candidate for the role of {state.get('role', 'Software Engineer')}.
Here is the conversation so far:
{context if context else 'No questions asked yet.'}

Ask the next relevant technical question based on their previous responses.
Ask only one question. Avoid greetings or explanations.
"""
        ),
    ]

    question = llm(prompt).content.strip()
    print(f"\n🧠 Q{idx + 1}: {question}")
    return {**state, "current_question": question}


def receive_answer_node(state: InterviewState) -> InterviewState:
    """Collect candidate’s answer from console input."""
    answer = input("Your answer:\n> ")
    if answer.strip().lower() == "exit":
        return {**state, "done": True}
    return {**state, "user_answer": answer}


def evaluate_answer_node(state: InterviewState) -> InterviewState:
    """Evaluate the answer and decide if follow-up is needed."""
    prompt = [
        SystemMessage(
            content="You are an expert interviewer. Evaluate candidate answers clearly and concisely."
        ),
        HumanMessage(
            content=f"""
Question: {state['current_question']}
Answer: {state['user_answer']}

Provide:
1. Score (1–10)
2. Feedback (2–3 sentences)
3. Whether a follow-up is needed (yes/no)
"""
        ),
    ]
    result = llm(prompt).content.strip()
    print("\n🔍 Evaluation:\n", result)
    followup_needed = "yes" in result.lower()
    return {
        **state,
        "evaluation_feedback": result,
        "followup_questions": ["Can you elaborate on that point?"] if followup_needed else [],
    }


def ask_followup_node(state: InterviewState) -> InterviewState:
    """Ask a follow-up question if needed."""
    if not state["followup_questions"]:
        return state
    print("\n🔁 Follow-up Question:", state["followup_questions"][0])
    return state


def receive_followup_node(state: InterviewState) -> InterviewState:
    """Receive follow-up answer."""
    if not state["followup_questions"]:
        return state
    followup_ans = input("Your follow-up answer:\n> ")
    return {**state, "followup_answer": followup_ans}


def next_question_node(state: InterviewState) -> InterviewState:
    """Move to the next question and update history."""
    updated_history = state.get("history", []) + [
        {
            "question": state["current_question"],
            "answer": state["user_answer"],
            "feedback": state["evaluation_feedback"],
            "followup_answer": state.get("followup_answer"),
        }
    ]

    return {
        **state,
        "question_index": state["question_index"] + 1,
        "current_question": None,
        "user_answer": None,
        "evaluation_feedback": None,
        "followup_questions": [],
        "followup_answer": None,
        "history": updated_history,
    }

# ------------------------- GRAPH SETUP -------------------------

graph = StateGraph(InterviewState)

graph.add_node("ask_question", ask_question_node)
graph.add_node("get_answer", receive_answer_node)
graph.add_node("evaluate_answer", evaluate_answer_node)
graph.add_node("ask_followup", ask_followup_node)
graph.add_node("get_followup", receive_followup_node)
graph.add_node("next_question", next_question_node)

graph.set_entry_point("ask_question")
graph.add_edge("ask_question", "get_answer")
graph.add_edge("get_answer", "evaluate_answer")
graph.add_conditional_edges(
    "evaluate_answer",
    lambda state: "ask_followup" if state["followup_questions"] else "next_question",
)
graph.add_edge("ask_followup", "get_followup")
graph.add_edge("get_followup", "next_question")
graph.add_conditional_edges(
    "next_question",
    lambda state: END if state["done"] else "ask_question",
)

interview_chain = graph.compile()

# ------------------------- EXECUTION -------------------------

if __name__ == "__main__":
    print("🤖 Welcome to the Dynamic AI Mock Interview!\n(Type 'exit' anytime to quit.)\n")

    role = input("Enter the target role (e.g., frontend engineer, data scientist): ").strip() or "Software Engineer"

    initial_state = InterviewState(
        current_question=None,
        user_answer=None,
        evaluation_feedback=None,
        followup_questions=[],
        followup_answer=None,
        question_index=0,
        done=False,
        role=role,
        history=[],
    )

    for s in interview_chain.stream(initial_state):
        if s.get("done", False):
            break

    print("\n✅ Interview complete. Thank you!\n")

    print("🧾 Summary:")
    for i, qa in enumerate(s.get("history", []), start=1):
        print(f"\nQ{i}: {qa['question']}")
        print(f"A{i}: {qa['answer']}")
        if qa.get("feedback"):
            print(f"Feedback: {qa['feedback']}")
