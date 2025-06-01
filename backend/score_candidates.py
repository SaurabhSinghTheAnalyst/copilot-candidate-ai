from fastapi import APIRouter, Body
import openai
import os

router = APIRouter()

openai.api_key = os.getenv("OPENAI_API_KEY")

@router.post("/api/score-candidates")
async def score_candidates(
    job: dict = Body(...),
    candidates: list = Body(...)
):
    print("Received request to /api/score-candidates")
    print("Job:", job)
    print("Number of candidates:", len(candidates))
    results = []
    for idx, candidate in enumerate(candidates):
        print(f"Scoring candidate {idx+1}/{len(candidates)}: {candidate.get('first_name', '')} {candidate.get('last_name', '')} (ID: {candidate.get('id')})")
        prompt = f"""
You are an expert technical recruiter. Given the following job description and requirements:

Job Description: {job.get('description', '')}
Requirements: {job.get('requirements', '')}

And the following candidate profile:
Name: {candidate.get('first_name', '')} {candidate.get('last_name', '')}
Email: {candidate.get('email', '')}
Skills: {', '.join(candidate.get('skills', []))}
Experience: {candidate.get('job_experience', '')}
Education: {candidate.get('education_history', '')}

Score this candidate from 1-10 for fit to the job, and explain your reasoning in 2-3 sentences.
Return your answer in the format: SCORE: <number> | REASON: <reason>
"""
        print("Prompt sent to OpenAI:\n", prompt)
        response = openai.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=200
        )
        score_text = response.choices[0].message.content
        print(f"OpenAI response for candidate {candidate.get('id')}: {score_text}")
        results.append({
            "candidate_id": candidate.get('id'),
            "score": score_text
        })
    print("Scoring complete. Returning results.")
    return results 