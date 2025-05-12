import { RoadmapData, DetailContent } from "@/types";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = "https://generativelanguage.googleapis.com/v1/models"; // Using stable v1 API
const GEMINI_MODEL = "gemini-pro"; // Using gemini-pro as it's widely available

// Helper function to retry API calls with exponential backoff
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

// Function to handle API errors consistently
async function handleApiError(response: Response): Promise<never> {
  let errorMessage = "Failed to generate content from the AI service.";
  
  try {
    const errorData = await response.json();
    console.error("Gemini API error details:", errorData);
    
    // Try to extract error message from Gemini response format
    if (errorData.error && errorData.error.message) {
      errorMessage = `API error: ${errorData.error.message}`;
    }
  } catch (e) {
    console.error("Failed to parse error response:", e);
  }
  
  // Provide specific error messages based on status code
  if (response.status === 400) {
    errorMessage = "Invalid request to the AI service. Please try a different business idea.";
  } else if (response.status === 401 || response.status === 403) {
    errorMessage = "API key authentication error. Please check the Gemini API key.";
  } else if (response.status === 404) {
    errorMessage = "The specified AI model was not found. The model may no longer be available.";
  } else if (response.status === 429) {
    errorMessage = "Rate limit exceeded. Please try again in a few moments.";
  } else if (response.status >= 500) {
    errorMessage = "AI service error. Please try again later.";
  }
  
  const error = new Error(errorMessage);
  (error as any).status = response.status;
  throw error;
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
    The id for each section should follow the pattern "section-1", "section-2", etc.
    The id for each subtopic should follow the pattern "section-1-1", "section-1-2", etc.
  `;

  const fetchRoadmap = async () => {
    console.log("Generating roadmap for:", businessIdea);
    
    try {
      const response = await fetch(`${API_URL}/${GEMINI_MODEL}:generateContent?key=${API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.2,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          }
        })
      });

      if (!response.ok) {
        return handleApiError(response);
      }

      const data = await response.json();
      console.log("Received API response:", data);
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0]) {
        throw new Error("Unexpected API response format. The response doesn't contain the expected data structure.");
      }
      
      // Extract the JSON from the response
      const text = data.candidates[0].content.parts[0].text;
      
      // Parse the sections
      let sections;
      try {
        sections = JSON.parse(text);
      } catch (parseError) {
        console.error("Failed to parse JSON from API response:", parseError);
        console.log("Raw text response:", text);
        throw new Error("Failed to parse roadmap data. The API did not return valid JSON.");
      }
      
      // Validate and format the sections
      if (!Array.isArray(sections)) {
        throw new Error("Invalid roadmap data format. Expected an array of sections.");
      }
      
      // Add isExpanded property to each section
      const formattedSections = sections.map((section: any, index: number) => {
        // Ensure section has all required properties
        if (!section.id || !section.title || !section.description || !Array.isArray(section.subtopics)) {
          console.error("Invalid section format:", section);
          
          // Create a fallback section if data is missing
          section = {
            id: section.id || `section-${index + 1}`,
            title: section.title || `Section ${index + 1}`,
            description: section.description || "Description unavailable",
            subtopics: Array.isArray(section.subtopics) ? section.subtopics : []
          };
        }
        
        return {
          ...section,
          isExpanded: false
        };
      });
      
      return {
        businessIdea,
        sections: formattedSections
      };
    } catch (error) {
      console.error("Error in generateRoadmap:", error);
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown error occurred while generating the roadmap.");
      }
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
    console.log("Generating detail content for:", subtopicTitle);
    
    try {
      const response = await fetch(`${API_URL}/${GEMINI_MODEL}:generateContent?key=${API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.2,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          }
        })
      });

      if (!response.ok) {
        return handleApiError(response);
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0]) {
        throw new Error("Unexpected API response format for detail content.");
      }
      
      // Extract the content from the response
      const content = data.candidates[0].content.parts[0].text;
      
      // Extract the section name from the subtopic ID
      const sectionId = subtopicId.split('-')[0];
      const sectionNumber = parseInt(sectionId.replace('section-', ''));
      
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
      console.error("Error in generateDetailContent:", error);
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown error occurred while generating detailed content.");
      }
    }
  };

  return retryWithBackoff(fetchDetailContent);
}
