
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fileContent, fileName, requirements } = await req.json();

    console.log('Processing resume:', fileName);
    console.log('Requirements:', requirements);

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Create a more detailed prompt for actual resume parsing
    const prompt = `
    You are an expert resume parser. Parse the following resume content and extract information in JSON format.
    
    Job Requirements: ${requirements || 'General software development position'}
    
    IMPORTANT: Parse the ACTUAL resume content provided. Do NOT generate sample data.
    
    Resume file name: ${fileName}
    Resume content (base64 encoded): ${fileContent}
    
    Please carefully read and analyze the resume content above and extract the following information in this exact JSON structure:
    {
      "personalInfo": {
        "firstName": "extracted first name from resume",
        "lastName": "extracted last name from resume", 
        "email": "extracted email address from resume",
        "phone": "extracted phone number from resume",
        "address": "extracted full address from resume",
        "city": "extracted city from resume",
        "state": "extracted state/province from resume"
      },
      "professionalInfo": {
        "summary": "write a professional summary based on the actual experience and skills found in the resume",
        "experience": "calculate actual years of experience based on work history in resume",
        "skills": ["extract actual skills mentioned in the resume"],
        "education": "extract actual education information from resume",
        "certifications": ["extract actual certifications mentioned in resume"]
      },
      "score": {
        "overall": "score 0-100 based on how well this actual resume matches the requirements",
        "skillMatch": "score 0-100 based on actual skills vs requirements",
        "experienceMatch": "score 0-100 based on actual experience vs requirements",
        "educationMatch": "score 0-100 based on actual education vs requirements"
      }
    }
    
    Instructions:
    1. Extract ONLY the information that is actually present in the resume
    2. If information is not found, use empty string "" or empty array []
    3. Calculate experience years by analyzing job dates and employment history
    4. Base the professional summary on actual achievements and experience from the resume
    5. Score the candidate based on their actual qualifications vs the job requirements
    6. Be accurate and do not make up information that isn't in the resume
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert resume parser. You must analyze the actual resume content provided and extract only the real information present in the document. Always return valid JSON only, no additional text or markdown formatting.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API Error:', error);
      throw new Error(error.error?.message || 'Failed to process resume');
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    console.log('OpenAI Response:', content);
    
    // Parse the JSON response
    let parsedData;
    try {
      parsedData = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', content);
      throw new Error('Failed to parse resume data');
    }

    console.log('Resume parsed successfully:', parsedData);

    return new Response(JSON.stringify(parsedData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in parse-resume function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
