from ast import Dict, List
import subprocess
import tempfile
from typing import Any

def evaluate_solution(code: str, test_cases: list[dict[str, str]]) -> list[dict[str, str | bool | None]]:
    results = []
    with tempfile.NamedTemporaryFile(mode='w+', suffix='.py', delete=False) as tmp_file:
        tmp_file.write(code)
        tmp_file.flush()
        
        for i, case in enumerate(test_cases):
            input_data = case["input"]
            expected_output = case["output"].strip()

            try:
                result = subprocess.run(
                    ['python', tmp_file.name],
                    input=input_data.encode(),
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    timeout=2
                )
                actual_output = result.stdout.decode().strip()
                passed = actual_output == expected_output
                results.append({
                    "test_case": i + 1,
                    "input": input_data,
                    "expected_output": expected_output,
                    "actual_output": actual_output,
                    "passed": passed,
                    "error": result.stderr.decode().strip() or None
                })
            except subprocess.TimeoutExpired:
                results.append({
                    "test_case": i + 1,
                    "input": input_data,
                    "expected_output": expected_output,
                    "actual_output": None,
                    "passed": False,
                    "error": "TimeoutExpired"
                })

    return results


test_cases = [
    {"input": "3\n", "output": "6"},
    {"input": "5\n", "output": "15"}
]

code = '''
def solution():
    n = int(input())
    print(n * (n + 1) // 2)
solution()
'''

result = evaluate_solution(code, test_cases)
for r in result:
    print(r)
