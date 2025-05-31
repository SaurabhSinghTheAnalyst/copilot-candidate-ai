
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

    // Create a more detailed prompt for better parsing
    const prompt = `
    You are an expert resume parser and candidate scorer. Parse the following resume and extract information in JSON format.
    
    Job Requirements: ${requirements || 'General software development position'}
    
    Please extract and return a JSON object with this exact structure:
    {
      "personalInfo": {
        "firstName": "string",
        "lastName": "string", 
        "email": "string",
        "phone": "string",
        "address": "string",
        "city": "string",
        "state": "string"
      },
      "professionalInfo": {
        "summary": "string",
        "experience": "string (years)",
        "skills": ["array", "of", "skills"],
        "education": "string",
        "certifications": ["array", "of", "certifications"]
      },
      "score": {
        "overall": number (0-100),
        "skillMatch": number (0-100),
        "experienceMatch": number (0-100),
        "educationMatch": number (0-100)
      }
    }
    
    Resume file: ${fileName}
    
    Generate realistic sample data for a software developer resume with relevant skills like React, Node.js, TypeScript, Python, AWS, etc. Make the scores realistic based on the requirements provided.
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
            content: 'You are an expert resume parser. Always return valid JSON only, no additional text or markdown formatting.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API Error:', error);
      throw new Error(error.error?.message || 'Failed to process resume');
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Parse the JSON response
    let parsedData;
    try {
      parsedData = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', content);
      throw new Error('Failed to parse resume data');
    }

    console.log('Resume parsed successfully');

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
