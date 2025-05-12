import { RoadmapData, DetailContent } from "@/types";

const GEMINI_MODEL = "gemini-pro";
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = "https://generativelanguage.googleapis.com/v1/models";

async function retryWithBackoff<T>(fetchFn: () => Promise<T>, maxRetries = 3): Promise<T> {
  let retryCount = 0;
  let delay = 1000; // Initial delay of 1 second

  while (retryCount < maxRetries) {
    try {
      return await fetchFn();
    } catch (error: any) {
      // Only retry on rate limiting errors (HTTP 429)
      if (error.status !== 429) {
        throw error;
      }

      retryCount++;
      
      if (retryCount >= maxRetries) {
        throw error;
      }

      // Exponential backoff with a maximum of 32 seconds
      await new Promise(resolve => setTimeout(resolve, Math.min(delay, 32000)));
      delay *= 2; // Double the delay for the next retry
    }
  }

  throw new Error("Maximum retries reached");
}

export async function generateRoadmap(businessIdea: string): Promise<RoadmapData> {
  const prompt = `
    Generate a comprehensive business roadmap for: "${businessIdea}".
    
    Return a JSON array of exactly 10 roadmap sections, each with the following structure:
    {
      "id": "section-ID", 
      "title": "Section Title",
      "description": "Brief description of this section",
      "subtopics": [
        {
          "id": "subtopic-ID",
          "title": "Subtopic Title",
          "description": "Brief description of this subtopic"
        }
        // Exactly 5 subtopics per section
      ]
    }
    
    Focus on practical, actionable steps specific to "${businessIdea}". Each section should represent a major phase or area of business development, and each subtopic should be a specific activity or milestone within that phase.
    
    The sections should cover the entire journey from idea to scaling, including market research, planning, funding, operations, marketing, and growth.
    
    Format the output as valid JSON only, with no additional text, explanations, or markdown formatting.
  `;

  const fetchRoadmap = async () => {
    console.log("Generating roadmap with model:", GEMINI_MODEL, "and API key:", API_KEY ? "API key is set" : "API key is not set");
    const response = await fetch(`${API_URL}/${GEMINI_MODEL}:generateContent?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        }
      })
    });

    if (!response.ok) {
      const error = new Error(`Gemini API error: ${response.statusText}`);
      (error as any).status = response.status;
      throw error;
    }

    const data = await response.json();
    
    try {
      // Extract the JSON from the response
      const text = data.candidates[0].content.parts[0].text;
      // Parse the sections
      const sections = JSON.parse(text);
      
      // Add isExpanded property to each section
      const formattedSections = sections.map((section: any) => ({
        ...section,
        isExpanded: false
      }));
      
      return {
        businessIdea,
        sections: formattedSections
      };
    } catch (error) {
      console.error("Failed to parse Gemini API response:", error);
      throw new Error("Failed to generate roadmap. The API returned an invalid response.");
    }
  };

  return retryWithBackoff(fetchRoadmap);
}

export async function generateDetailContent(
  subtopicId: string,
  businessIdea: string,
  subtopicTitle: string
): Promise<DetailContent> {
  const prompt = `
    Generate detailed content for the business roadmap subtopic: "${subtopicTitle}" for a business idea: "${businessIdea}".
    
    Format your response in Markdown with the following sections:
    
    ## Overview
    [A concise introduction to this subtopic and why it's important for this specific business idea]
    
    ## Why This Matters
    [Explanation of the importance and impact of this subtopic on business success]
    
    ## Step-by-Step Guide
    [Detailed, actionable steps to implement or address this subtopic]
    
    ## Best Practices
    [Industry best practices and tips for excellence in this area]
    
    ## Common Pitfalls
    [Mistakes to avoid and challenges to anticipate]
    
    ## Industry-Specific Considerations
    [Factors specifically relevant to "${businessIdea}" in this area]
    
    ## Next Steps
    [What to do after addressing this subtopic and how it connects to other aspects of the business]
    
    Make the content practical, specific to "${businessIdea}", and immediately useful to someone implementing this business idea. Include examples and actionable advice throughout.
  `;

  const fetchDetailContent = async () => {
    const response = await fetch(`${API_URL}/${GEMINI_MODEL}:generateContent?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        }
      })
    });

    if (!response.ok) {
      const error = new Error(`Gemini API error: ${response.statusText}`);
      (error as any).status = response.status;
      throw error;
    }

    const data = await response.json();
    
    try {
      // Extract the content from the response
      const content = data.candidates[0].content.parts[0].text;
      
      // Extract the section name from the subtopic ID
      const sectionId = subtopicId.split('-')[0];
      const sectionNumber = parseInt(sectionId);
      
      // Map section numbers to section names (this would be better if we had access to the actual section titles)
      const sectionMapping: Record<number, string> = {
        1: "Market Research & Validation",
        2: "Business Planning & Strategy",
        3: "Financial Planning",
        4: "Legal & Compliance",
        5: "Product & Service Development",
        6: "Operations & Infrastructure",
        7: "Marketing & Branding",
        8: "Sales & Customer Acquisition",
        9: "Growth & Scaling",
        10: "Monitoring & Optimization"
      };
      
      const section = sectionMapping[sectionNumber] || `Section ${sectionNumber}`;
      
      return {
        title: subtopicTitle,
        section,
        content
      };
    } catch (error) {
      console.error("Failed to parse Gemini API response for detail content:", error);
      throw new Error("Failed to generate detail content. The API returned an invalid response.");
    }
  };

  return retryWithBackoff(fetchDetailContent);
}
