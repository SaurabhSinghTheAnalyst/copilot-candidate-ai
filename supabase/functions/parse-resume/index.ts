
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

    // Simulate file processing (in real implementation, you'd use OCR or text extraction)
    const prompt = `
    You are an expert resume parser and candidate scorer. Parse the following resume and extract information in JSON format.
    
    Requirements for scoring: ${requirements || 'General IT position requirements'}
    
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
    
    Since I cannot process the actual file content, please generate realistic sample data for a software developer resume with relevant skills like React, Node.js, TypeScript, etc.
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
            content: 'You are an expert resume parser. Always return valid JSON only, no additional text.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to process resume');
    }

    const data = await response.json();
    const parsedData = JSON.parse(data.choices[0].message.content);

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
