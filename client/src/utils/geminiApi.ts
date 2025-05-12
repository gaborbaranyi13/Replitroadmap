import { RoadmapData, DetailContent, ApproachSuggestion } from "@/types";
import { GoogleGenerativeAI, GenerationConfig, Content } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
if (!API_KEY) {
  throw new Error("VITE_GEMINI_API_KEY is not set in environment variables.");
}

const GEMINI_MODEL_NAME = "gemini-2.5-flash-preview-04-17";

// Updated configuration for the preview model
const baseGenerationConfig: GenerationConfig = {
  temperature: 0.2,
  topK: 40,
  topP: 0.95,
  maxOutputTokens: 8192,
  candidateCount: 1,
  stopSequences: []
};

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
      // Check for rate limiting and overload errors
      const shouldRetry = error.status === 429 || 
                         error.status === 503 ||
                         (error.message && (
                           error.message.includes("429") || 
                           error.message.includes("503") ||
                           error.message.toLowerCase().includes("rate limit") ||
                           error.message.toLowerCase().includes("quota exceeded") ||
                           error.message.toLowerCase().includes("overloaded")
                         ));
                              
      if (!shouldRetry) {
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

  // Get the model with the preview configuration
  const model = genAI.getGenerativeModel({
    model: GEMINI_MODEL_NAME,
    generationConfig: baseGenerationConfig
  });

  // Create content parts for the request
  const contents: Content[] = [{
    role: "user",
    parts: [{ text: prompt }]
  }];

  const fetchRoadmap = async () => {
    console.log("Generating roadmap for:", businessIdea);
    
    try {
      // Add a small delay to avoid rapid successive API calls
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Make the API call using the SDK
      const result = await model.generateContent({ contents });
      const response = result.response;
      
      // Get the text from the response
      const text = response.text();
      console.log("Received API response text sample:", text.substring(0, 200) + "...");
      
      if (!text) {
        throw new Error("Unexpected API response format. The response doesn't contain text.");
      }
      
      // Remove markdown code fence if present
      const cleanText = text.replace(/^```json\n|\n```$/g, '').trim();
      
      // Parse the sections
      let sections;
      try {
        sections = JSON.parse(cleanText);
      } catch (parseError) {
        console.error("Failed to parse JSON from API response:", parseError);
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

async function generateApproachSuggestions(
  subtopicTitle: string,
  businessIdea: string
): Promise<ApproachSuggestion[]> {
  // Define a prompt that asks for alternative approach suggestions
  const prompt = `
    Generate 4 alternative approach suggestions for implementing the subtopic "${subtopicTitle}" 
    in a "${businessIdea}" business context.
    
    Each suggestion should represent a different approach type:
    1. An innovative, cutting-edge approach
    2. A traditional, proven approach
    3. A cost-effective, budget-friendly approach
    4. A technical, efficiency-focused approach
    
    Format your response as a JSON array with this structure:
    [
      {
        "id": "1",
        "title": "Brief, catchy title for the approach (max 5 words)",
        "description": "One-sentence description of the approach (max 15 words)",
        "approachType": "innovative" | "traditional" | "cost-effective" | "technical"
      },
      ...
    ]
    
    Return ONLY the JSON array with no additional text, explanations, or formatting.
  `;

  // Define generation config with higher temperature for diverse suggestions
  const generationConfig: GenerationConfig = {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 1024,
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

  try {
    // Make the API call
    const result = await model.generateContent({ contents });
    const response = result.response;
    const text = response.text();
    
    if (!text) {
      throw new Error("Empty response from suggestions API");
    }
    
    // Try to extract JSON from the response
    try {
      const suggestions = JSON.parse(text);
      
      // Validate structure and return
      if (Array.isArray(suggestions) && suggestions.length > 0) {
        return suggestions.slice(0, 4); // Ensure we don't return too many
      } else {
        throw new Error("Invalid suggestions format");
      }
    } catch (parseError) {
      console.error("Failed to parse suggestions JSON:", parseError);
      
      // Try to extract JSON if there's text before or after it
      const jsonMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if (jsonMatch) {
        try {
          const extractedJson = JSON.parse(jsonMatch[0]);
          if (Array.isArray(extractedJson) && extractedJson.length > 0) {
            return extractedJson.slice(0, 4);
          }
        } catch (e) {
          // If extraction fails, return fallback suggestions
        }
      }
      
      // If all parsing attempts fail, return fallback suggestions
      return [
        {
          id: "1",
          title: "Innovative Approach",
          description: "Cutting-edge technology solution for this challenge",
          approachType: "innovative"
        },
        {
          id: "2",
          title: "Proven Method",
          description: "Traditional approach with consistent results",
          approachType: "traditional"
        },
        {
          id: "3",
          title: "Budget-Friendly Option",
          description: "Cost-effective implementation strategy",
          approachType: "cost-effective"
        },
        {
          id: "4",
          title: "Technical Solution",
          description: "Efficiency-focused approach using modern tools",
          approachType: "technical"
        }
      ];
    }
  } catch (error) {
    console.error("Error generating suggestions:", error);
    // Return fallback suggestions in case of API error
    return [
      {
        id: "1",
        title: "Innovative Approach",
        description: "Cutting-edge technology solution for this challenge",
        approachType: "innovative"
      },
      {
        id: "2",
        title: "Proven Method",
        description: "Traditional approach with consistent results",
        approachType: "traditional"
      },
      {
        id: "3",
        title: "Budget-Friendly Option",
        description: "Cost-effective implementation strategy",
        approachType: "cost-effective"
      },
      {
        id: "4",
        title: "Technical Solution",
        description: "Efficiency-focused approach using modern tools",
        approachType: "technical"
      }
    ];
  }
}

export async function generateDetailContent(
  subtopicId: string,
  businessIdea: string,
  subtopicTitle: string,
  creativeApproach = false,
  approachType?: string
): Promise<DetailContent> {
  let prompt;
  
  if (creativeApproach && approachType) {
    // Handle specific approach types
    switch(approachType) {
      case 'innovative':
        prompt = `
          Generate detailed content for the business roadmap subtopic: "${subtopicTitle}" for a business idea: "${businessIdea}".
          
          Take an INNOVATIVE approach focusing on cutting-edge technologies, forward-thinking strategies, and breakthrough solutions.
          Consider emerging technologies, disruptive business models, and state-of-the-art methodologies.
          
          Format your response in Markdown with the following sections:
          
          ## Innovative Approach
          [Introduce a cutting-edge, forward-thinking approach utilizing the latest technologies and methodologies]
          
          ## Technological Advantage
          [Describe the technological advantages this approach offers over traditional methods]
          
          ## Implementation Roadmap
          [Detailed steps to implement this innovative solution]
          
          ## Technology Stack & Tools
          [Specific cutting-edge technologies, platforms, or tools to utilize]
          
          ## Market Differentiation
          [How this approach positions the business as an industry innovator]
          
          ## Future-Proofing
          [How this approach anticipates future market trends and technological developments]
          
          ## Measuring Innovation Success
          [Key metrics and indicators to evaluate the effectiveness of this innovative approach]
          
          Make the content focused on innovation and emerging technologies while remaining practical and actionable.
        `;
        break;
        
      case 'traditional':
        prompt = `
          Generate detailed content for the business roadmap subtopic: "${subtopicTitle}" for a business idea: "${businessIdea}".
          
          Take a TRADITIONAL approach focusing on proven methods, established practices, and reliable strategies.
          Emphasize stability, predictability, and well-documented methodologies with track records of success.
          
          Format your response in Markdown with the following sections:
          
          ## Proven Approach
          [Introduce a well-established, time-tested methodology for this aspect of business]
          
          ## Historical Success Patterns
          [Examples of how this traditional approach has succeeded in similar contexts]
          
          ## Implementation Framework
          [Detailed steps following established best practices]
          
          ## Industry Standards
          [Relevant standards, certifications, or benchmarks to adhere to]
          
          ## Risk Mitigation
          [How this tried-and-true approach minimizes common business risks]
          
          ## Building on Tradition
          [Ways to enhance traditional methods with minor modern improvements]
          
          ## Long-Term Stability
          [How this approach ensures consistent, reliable business operations]
          
          Make the content focused on proven reliability and established practices while being thorough and systematic.
        `;
        break;
        
      case 'cost-effective':
        prompt = `
          Generate detailed content for the business roadmap subtopic: "${subtopicTitle}" for a business idea: "${businessIdea}".
          
          Take a COST-EFFECTIVE approach focusing on budget-friendly solutions, resource optimization, and maximum ROI.
          Emphasize bootstrapping strategies, lean methodologies, and smart resource allocation.
          
          Format your response in Markdown with the following sections:
          
          ## Budget-Conscious Strategy
          [Introduce an approach that minimizes costs while maximizing impact]
          
          ## ROI Analysis
          [Framework for evaluating cost-benefit ratios for this business aspect]
          
          ## Resource Optimization
          [Specific ways to achieve more with fewer resources]
          
          ## Low-Cost Alternatives
          [Budget-friendly tools, services, and methodologies]
          
          ## Gradual Scaling Model
          [How to start small and scale efficiently as the business grows]
          
          ## Cost Pitfalls to Avoid
          [Common ways businesses overspend in this area]
          
          ## Measuring Economic Efficiency
          [Key metrics for tracking cost-effectiveness of this approach]
          
          Make the content practical with a strong focus on smart budgeting and resource allocation while still achieving business goals.
        `;
        break;
        
      case 'technical':
        prompt = `
          Generate detailed content for the business roadmap subtopic: "${subtopicTitle}" for a business idea: "${businessIdea}".
          
          Take a TECHNICAL approach focusing on systems optimization, process efficiency, and technical excellence.
          Emphasize detailed technical implementation, architecture considerations, and engineering best practices.
          
          Format your response in Markdown with the following sections:
          
          ## Technical Foundation
          [Introduce a technically-optimized approach with focus on systems and processes]
          
          ## System Architecture
          [Technical framework and components needed for implementation]
          
          ## Integration Points
          [How this system connects with other business systems and processes]
          
          ## Technical Requirements
          [Specific infrastructure, software, or technical capabilities needed]
          
          ## Optimization Strategies
          [Methods for maximizing performance, reliability, and scalability]
          
          ## Technical Debt Considerations
          [How to build robust systems while avoiding future technical debt]
          
          ## Performance Metrics
          [Technical KPIs and benchmarks to monitor system health and efficiency]
          
          Make the content technically rigorous yet accessible, with an emphasis on building robust, efficient systems.
        `;
        break;
        
      default:
        // Default to creative approach if approachType is not recognized
        prompt = `
          Generate detailed content for the business roadmap subtopic: "${subtopicTitle}" for a business idea: "${businessIdea}".
          
          Try a radically different approach in your response. Be innovative, think outside the box, and challenge conventional wisdom.
          Consider unconventional strategies, cutting-edge technologies, or unique business models that might not be standard in the industry.
          
          Format your response in Markdown with the following sections:
          
          ## Unconventional Approach
          [Introduce a bold, innovative approach to this subtopic that challenges business-as-usual thinking]
          
          ## Why Traditional Methods Fall Short
          [Explain limitations of conventional approaches and why innovation is needed]
          
          ## Innovative Implementation Strategy
          [Detailed, actionable steps to implement this creative approach]
          
          ## Embracing Disruption
          [How to leverage emerging trends, technologies, or methodologies in groundbreaking ways]
          
          ## Managing Risks of Innovation
          [How to mitigate potential downsides of taking an unconventional path]
          
          ## Competitive Advantage
          [How this approach creates unique value and sets "${businessIdea}" apart from competitors]
          
          ## Measuring Success Differently
          [New metrics or frameworks to evaluate the success of this approach]
          
          Make the content bold, provocative yet practical, and immediately useful to someone implementing this business idea. Focus on actionable insights that truly challenge the status quo.
        `;
    }
  } else if (creativeApproach) {
    // Original creative approach without specific type
    prompt = `
      Generate detailed content for the business roadmap subtopic: "${subtopicTitle}" for a business idea: "${businessIdea}".
      
      Try a radically different approach in your response. Be innovative, think outside the box, and challenge conventional wisdom.
      Consider unconventional strategies, cutting-edge technologies, or unique business models that might not be standard in the industry.
      
      Format your response in Markdown with the following sections:
      
      ## Unconventional Approach
      [Introduce a bold, innovative approach to this subtopic that challenges business-as-usual thinking]
      
      ## Why Traditional Methods Fall Short
      [Explain limitations of conventional approaches and why innovation is needed]
      
      ## Innovative Implementation Strategy
      [Detailed, actionable steps to implement this creative approach]
      
      ## Embracing Disruption
      [How to leverage emerging trends, technologies, or methodologies in groundbreaking ways]
      
      ## Managing Risks of Innovation
      [How to mitigate potential downsides of taking an unconventional path]
      
      ## Competitive Advantage
      [How this approach creates unique value and sets "${businessIdea}" apart from competitors]
      
      ## Measuring Success Differently
      [New metrics or frameworks to evaluate the success of this approach]
      
      Make the content bold, provocative yet practical, and immediately useful to someone implementing this business idea. Focus on actionable insights that truly challenge the status quo.
    `;
  } else {
    // Standard approach
    prompt = `
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
  }

  // Define the generation configuration
  const generationConfig: GenerationConfig = {
    // Use higher temperature for creative mode to get more varied responses
    temperature: creativeApproach ? 0.8 : 0.2,
    topK: 40,
    topP: creativeApproach ? 0.98 : 0.95,
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
      // Add a small delay to avoid rapid successive API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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
      
      // Generate suggestion chips if not in creative mode
      let suggestions;
      if (!creativeApproach) {
        try {
          suggestions = await generateApproachSuggestions(subtopicTitle, businessIdea);
        } catch (suggestionError) {
          console.error("Failed to generate approach suggestions:", suggestionError);
          // Continue without suggestions if they fail
        }
      }
      
      return {
        title: subtopicTitle,
        section,
        content,
        suggestions
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
