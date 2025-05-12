import { RoadmapData, DetailContent } from "@/types";
import { GoogleGenerativeAI, GenerationConfig, Content } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
if (!API_KEY) {
  throw new Error("VITE_GEMINI_API_KEY is not set in environment variables.");
}

const GEMINI_MODEL_NAME = "gemini-1.5-flash"; // Using widely available model

// Initialize the Google Generative AI SDK
const genAI = new GoogleGenerativeAI(API_KEY);

// Helper function to retry API calls with exponential backoff
async function retryWithBackoff<T>(fetchFn: () => Promise<T>, maxRetries = 3): Promise<T> {
  let retryCount = 0;
  let delay = 1000; // Initial delay of 1 second

  while (retryCount < maxRetries) {
    try {
      return await fetchFn();
    } catch (error: any) {
      // Check for rate limiting errors
      const isRateLimitError = error.status === 429 || 
                              (error.message && (
                                error.message.includes("429") || 
                                error.message.toLowerCase().includes("rate limit") ||
                                error.message.toLowerCase().includes("quota exceeded")
                              ));
                              
      if (!isRateLimitError) {
        throw error;
      }

      retryCount++;
      
      if (retryCount >= maxRetries) {
        throw error;
      }

      console.log(`Rate limit hit. Retrying in ${delay/1000} seconds. Attempt ${retryCount} of ${maxRetries}`);
      
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
    The id for each section should follow the pattern "section-1", "section-2", etc.
    The id for each subtopic should follow the pattern "section-1-1", "section-1-2", etc.
  `;

  // Define the generation configuration
  const generationConfig: GenerationConfig = {
    temperature: 0.2,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 8192,
    // responseMimeType: "application/json", // Uncomment if supported in your version
  };

  // Get the model
  const model = genAI.getGenerativeModel({
    model: GEMINI_MODEL_NAME,
    generationConfig,
  });

  // Create content parts for the request
  const contents: Content[] = [{
    role: "user",
    parts: [{ text: prompt }]
  }];

  const fetchRoadmap = async () => {
    console.log("Generating roadmap for:", businessIdea);
    
    try {
      // Make the API call using the SDK
      const result = await model.generateContent({ contents });
      const response = result.response;
      
      // Get the text from the response
      const text = response.text();
      console.log("Received API response text sample:", text.substring(0, 200) + "...");
      
      if (!text) {
        throw new Error("Unexpected API response format. The response doesn't contain text.");
      }
      
      // Parse the sections
      let sections;
      try {
        sections = JSON.parse(text);
      } catch (parseError) {
        console.error("Failed to parse JSON from API response:", parseError);
        console.log("Raw text response (first 500 chars):", text.substring(0, 500));
        
        // Try to extract JSON if there's text before or after the JSON
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          try {
            sections = JSON.parse(jsonMatch[0]);
            console.log("Successfully extracted JSON using regex");
          } catch (e) {
            throw new Error("Failed to parse roadmap data. The API did not return valid JSON.");
          }
        } else {
          throw new Error("Failed to parse roadmap data. The API did not return valid JSON.");
        }
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
      // Check for rate limiting or other specific errors
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      
      // Check for rate limiting messages
      const isRateLimitError = errorMessage.includes("429") || 
                              errorMessage.toLowerCase().includes("rate limit") ||
                              errorMessage.toLowerCase().includes("quota exceeded");
      
      if (isRateLimitError) {
        const rateLimitError = new Error("Rate limit exceeded. Please try again later.");
        (rateLimitError as any).status = 429;
        throw rateLimitError;
      }
      
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

  // Define the generation configuration
  const generationConfig: GenerationConfig = {
    temperature: 0.2,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 8192,
    // responseMimeType: "text/plain", // Uncomment if supported in your version
  };

  // Get the model
  const model = genAI.getGenerativeModel({
    model: GEMINI_MODEL_NAME,
    generationConfig,
  });

  // Create content parts for the request
  const contents: Content[] = [{
    role: "user",
    parts: [{ text: prompt }]
  }];

  const fetchDetailContent = async () => {
    console.log("Generating detail content for:", subtopicTitle);
    
    try {
      // Make the API call using the SDK
      const result = await model.generateContent({ contents });
      const response = result.response;
      
      // Get the text from the response
      const content = response.text();
      
      if (!content) {
        throw new Error("Unexpected API response format. The response doesn't contain markdown content.");
      }
      
      // Extract the section name from the subtopic ID
      const sectionId = subtopicId.split('-')[0];
      const sectionNumber = parseInt(sectionId.replace('section-', ''));
      
      // Map section numbers to section names
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
      
      // Check for rate limiting or other specific errors
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      
      // Check for rate limiting messages
      const isRateLimitError = errorMessage.includes("429") || 
                              errorMessage.toLowerCase().includes("rate limit") ||
                              errorMessage.toLowerCase().includes("quota exceeded");
      
      if (isRateLimitError) {
        const rateLimitError = new Error("Rate limit exceeded. Please try again later.");
        (rateLimitError as any).status = 429;
        throw rateLimitError;
      }
      
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown error occurred while generating detailed content.");
      }
    }
  };

  return retryWithBackoff(fetchDetailContent);
}
