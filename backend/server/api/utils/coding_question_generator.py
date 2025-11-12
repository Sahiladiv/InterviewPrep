import os
import re
import json
import random
from typing import Tuple, Dict, Any

from dotenv import load_dotenv

from langchain_groq import ChatGroq
from langchain.schema import SystemMessage, HumanMessage

load_dotenv()

PROMPT_LIST = [
    "Create an array-based coding problem involving prefix sums or sliding window. Provide clear I/O formats, constraints, and 3 test cases.",
    "Generate a string manipulation problem such as longest palindrome, pattern matching, or substring operations. Include 3 test cases and proper constraints.",
    "Create a dynamic programming problem like 0/1 knapsack, LIS, or grid traversal. Include detailed input/output format and test cases.",
    "Write a graph theory problem using BFS/DFS or Dijkstra's algorithm. Provide adjacency list input and at least 2 edge case test cases.",
    "Design a binary tree-based problem such as lowest common ancestor or max path sum. Use level-order or list representation for input.",
    "Generate a greedy algorithm problem involving interval scheduling or coin change. Include constraints and optimal test cases.",
    "Create a backtracking problem like Sudoku, N-Queens, or permutation generation. Include structured input and output formats.",
    "Write a problem involving binary search or custom comparator sorting logic. Return 3 example test cases and constraints.",
    "Design a problem using XOR, bitmasking, or power-of-two tricks. Provide constraints and 3 test cases (including edge cases).",
    "Generate a math-based coding problem involving primes, modular arithmetic, or GCD/LCM. Include proper input/output and edge cases.",
    "Create a problem involving a monotonic stack or queue, like 'Next Greater Element'. Include input format, output, and edge cases.",
    "Write a problem using the sliding window technique (e.g., max sum subarray of size k). Include 3 well-structured test cases.",
    "Design a two-pointers technique problem, such as finding pairs in a sorted array with a target sum. Provide constraints and 3 test cases.",
    "Generate a problem that uses a min-heap or max-heap, such as finding the kth largest element. Include constraints and test cases.",
    "Write a problem involving trie data structure, such as prefix search or autocomplete. Provide valid input formats and 3 test cases.",
    "Create a union-find (disjoint set) problem related to network connectivity or cycle detection. Include input as edge list and 3 test cases.",
    "Write a problem involving range queries using segment tree or BIT. Include constraints and 3 sample test cases."
]


def get_random_prompt() -> str:
    return random.choice(PROMPT_LIST)


def _ensure_groq_key() -> str:
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise ValueError("Missing GROQ_API_KEY in .env file or environment.")
    return api_key


def _coerce_to_json_block(txt: str) -> str:
    fenced = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", txt, flags=re.S)
    return fenced.group(1) if fenced else txt


def generate_question_with_groq(model: str = "mixtral-8x7b-32768") -> Tuple[str, Dict[str, Any], str]:
    _ensure_groq_key()

    llm = ChatGroq(
        temperature=0.7,
        model_name=model,
        groq_api_key=os.getenv("GROQ_API_KEY")
    )

    selected_prompt = get_random_prompt()

    system_prompt = SystemMessage(
        content=(
            f"You are a technical interviewer.\n{selected_prompt}\n"
            "Generate a medium-difficulty coding problem. Include: title, problem statement, input format, "
            "output format, constraints, 10 to 15 sample test cases, and tags. Return as JSON.\n"
            "Respond strictly in this JSON format:\n"
            "{\n"
            "  \"title\": str,\n"
            "  \"problem\": str,\n"
            "  \"input_format\": str,\n"
            "  \"output_format\": str,\n"
            "  \"constraints\": str,\n"
            "  \"test_cases\": [ {\"input\": str, \"output\": str}, ...],\n"
            "  \"tags\": [str, ...]\n"
            "}"
        )
    )

    user_prompt = HumanMessage(content="Generate the question now.")
    response = llm.invoke([system_prompt, user_prompt])
    raw_output = response.content
    # print("LLM raw output:\n", raw_output)
    # print("Prompt used:", selected_prompt)

    parsed = {}
    try:
        cleaned = _coerce_to_json_block(raw_output)
        parsed = json.loads(cleaned)
    except Exception as e:
        print("WARNING: Could not parse JSON from model output:", e)

    return raw_output, parsed, selected_prompt


def generate_question_for_db() -> Dict[str, Any]:
    model = os.getenv("GROQ_MODEL")
    _, parsed, _ = generate_question_with_groq(model=model)
    if not parsed:
        raise ValueError("Failed to parse LLM output")

    # Convert to model-compatible dict
    question_data = {
        "question_title": parsed.get("title"),
        "description": parsed.get("problem"),
        "input_format": parsed.get("input_format"),
        "output_format": parsed.get("output_format"),
        "constraints": parsed.get("constraints"),
        "tags": parsed.get("tags", []),
        "test_cases": parsed.get("test_cases", []),
        "type": "technical",
        "difficulty": "Medium",
    }
    return question_data

