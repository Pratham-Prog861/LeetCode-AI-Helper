document.addEventListener("DOMContentLoaded", () => {
  const spinner = document.getElementById("spinner");
  const output = document.getElementById("response");

  // Load saved API key
  chrome.storage.sync.get("geminiKey", ({ geminiKey }) => {
    if (geminiKey) {
      document.getElementById("apikey").value = geminiKey;
    }
  });

  // Save API key functionality
  document.getElementById("saveKey").onclick = () => {
    const key = document.getElementById("apikey").value.trim();
    if (!key) {
      showMessage("Please enter a valid API key.", "error");
      return;
    }
    
    chrome.storage.sync.set({ geminiKey: key }, () => {
      showMessage("✅ API Key saved securely!", "success");
    });
  };

  // Add event listeners for all three buttons
  ["hints", "approach", "code"].forEach(type => {
    document.getElementById(type).addEventListener("click", async () => {
      try {
        const geminiKey = document.getElementById("apikey").value.trim();
        if (!geminiKey) {
          showMessage("Please set your Gemini API Key first.", "error");
          return;
        }

        // Show loading state
        spinner.style.display = "block";
        output.innerHTML = '<span class="placeholder">Analyzing problem...</span>';

        // Get active tab and extract problem data
        const tab = await getActiveTab();
        if (!tab.url.includes("leetcode.com")) {
          showMessage("Please navigate to a LeetCode problem page.", "error");
          spinner.style.display = "none";
          return;
        }

        const results = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: getProblemDataFromPage,
        });

        const { title, description } = results[0].result;
        
        console.log("Extracted problem data:", { 
          title: title ? title.substring(0, 50) + "..." : null, 
          description: description ? description.substring(0, 100) + "..." : null,
          titleLength: title ? title.length : 0,
          descriptionLength: description ? description.length : 0
        });
        
        if (!title || !description) {
          let errorMsg = "Could not extract problem data. ";
          if (!title && !description) {
            errorMsg += "Title and description not found. ";
          } else if (!title) {
            errorMsg += "Title not found. ";
          } else if (!description) {
            errorMsg += "Description not found. ";
          }
          errorMsg += "Please make sure you're on a LeetCode problem page and try refreshing the page.";
          showMessage(errorMsg, "error");
          spinner.style.display = "none";
          return;
        }

        const language = document.getElementById("language").value;
        const prompt = buildPrompt(title, description, type.toUpperCase(), language);

        console.log("Sending prompt to Gemini:", {
          type: type.toUpperCase(),
          language: language,
          promptLength: prompt.length,
          promptPreview: prompt.substring(0, 200) + "..."
        });

        // Make API call to Gemini
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ 
              parts: [{ 
                text: prompt 
              }] 
            }],
            generationConfig: {
              temperature: 0.1,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 4096,
            }
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("API Error Response:", errorText);
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Gemini API Response:", data);
        
        let text = "No response received from AI.";
        
        if (data?.candidates && data.candidates.length > 0) {
          const candidate = data.candidates[0];
          if (candidate?.content?.parts && candidate.content.parts.length > 0) {
            text = candidate.content.parts[0].text || "No text in response.";
          }
        }
        
        // Additional fallback for different response formats
        if (text === "No response received from AI." && data?.promptFeedback) {
          text = "API returned feedback instead of content. Please try again.";
        }
        
        console.log("Final response text:", text.substring(0, 200) + "...");
        
        // Format the response for better display
        const formattedText = formatResponse(text, type, language);
        
        // Display the response
        spinner.style.display = "none";
        output.innerHTML = formattedText;
        
        // Add copy functionality after content is rendered
        setTimeout(() => {
          addCopyFunctionality();
        }, 100);

      } catch (error) {
        console.error("Error:", error);
        spinner.style.display = "none";
        showMessage(`Error: ${error.message}`, "error");
      }
    });
  });
});

// Helper function to get active tab
function getActiveTab() {
  return new Promise(resolve =>
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => resolve(tabs[0]))
  );
}

// Function to extract problem data from LeetCode page
function getProblemDataFromPage() {
  // Try multiple selectors to find the problem title
  const titleSelectors = [
    // New LeetCode selectors
    "[data-cy='question-title']",
    ".mr-2.text-label-1",
    ".text-title-large",
    "h1",
    ".question-title",
    "[data-track-load='problem_content'] h4",
    "[data-track-load='problem_content'] h1",
    ".title__3f2k",
    ".css-v3d350",
    // Fallback selectors
    "h1[class*='title']",
    ".title",
    "h1"
  ];
  
  let title = null;
  for (const selector of titleSelectors) {
    const element = document.querySelector(selector);
    if (element) {
      title = element.innerText.trim();
      if (title && title.length > 0) {
        console.log("Found title with selector:", selector, title);
        break;
      }
    }
  }

  // Try multiple selectors to find the problem description
  const descriptionSelectors = [
    // New LeetCode selectors
    "[data-cy='question-content']",
    ".question-content__JfgR",
    ".content__u3I1",
    ".description__24sA",
    "[data-track-load='problem_content']",
    ".problem-description",
    ".description",
    // More specific selectors
    "div[class*='content']",
    "div[class*='description']",
    // Fallback - get all text content from main content area
    "main",
    ".main__2_tD",
    "#app"
  ];
  
  let description = null;
  for (const selector of descriptionSelectors) {
    const element = document.querySelector(selector);
    if (element) {
      // Get text content and clean it up
      let text = element.innerText || element.textContent || "";
      text = text.trim();
      
      // Filter out navigation and UI elements
      if (text.length > 100 && !text.includes("Sign In") && !text.includes("Register")) {
        description = text;
        console.log("Found description with selector:", selector, description.substring(0, 100) + "...");
        break;
      }
    }
  }

  // If still no description, try to get it from the entire page content
  if (!description) {
    const body = document.body;
    if (body) {
      let text = body.innerText || body.textContent || "";
      text = text.trim();
      
      // Remove common UI elements
      const lines = text.split('\n').filter(line => 
        line.trim().length > 0 && 
        !line.includes("Sign In") && 
        !line.includes("Register") &&
        !line.includes("Premium") &&
        !line.includes("Explore") &&
        !line.includes("Problems") &&
        !line.includes("Discuss") &&
        !line.includes("Store")
      );
      
      if (lines.length > 0) {
        description = lines.join('\n');
        console.log("Found description from body content:", description.substring(0, 100) + "...");
      }
    }
  }

  console.log("Extracted data:", { title, description: description ? description.substring(0, 100) + "..." : null });
  return { title, description };
}

// Function to build the prompt based on requirements.txt format
function buildPrompt(title, description, type, language) {
  let instruction = "";
  
  if (type === "CODE") {
    instruction = `You are an expert coding assistant. Generate ONLY the ${language} code solution for this LeetCode problem.

IMPORTANT: 
- Provide ONLY the working ${language} code with comments
- Include a brief explanation (2-3 sentences) above the code
- Do NOT include the problem description or analysis
- Focus on the actual implementation
- Use proper ${language} syntax and best practices

Problem: ${title}

Requirements: ${description}

Generate the ${language} solution:`;
  } else if (type === "HINTS") {
    instruction = `You are an expert coding assistant helping users solve LeetCode problems.

Problem Title: ${title}
Problem Description: ${description}
Selected Option: HINTS

Instructions:
- Give 3-5 progressive hints, starting simple and becoming more detailed
- Do NOT reveal the final answer or code
- Help guide the user's thinking process

Provide progressive hints:`;
  } else if (type === "APPROACH") {
    instruction = `You are an expert coding assistant helping users solve LeetCode problems.

Problem Title: ${title}
Problem Description: ${description}
Selected Option: APPROACH

Instructions:
- Clearly explain how to solve the problem step-by-step
- Include information about edge cases, time/space complexity
- Mention the appropriate data structures/algorithms to use
- Do NOT give the full code, only the strategy

Explain the approach:`;
  }

  return instruction;
}

// Function to show messages to the user
function showMessage(message, type = "info") {
  const output = document.getElementById("response");
  const colors = {
    success: "#4CAF50",
    error: "#f44336",
    info: "#2196F3"
  };
  
  // Clear any existing content and show message
  output.innerHTML = `<span style="color: ${colors[type]}; font-weight: bold;">${message}</span>`;
  
  // Auto-clear success messages after 3 seconds
  if (type === "success") {
    setTimeout(() => {
      output.innerHTML = '<span class="placeholder">Your AI response will appear here...</span>';
    }, 3000);
  }
}

// Function to format the response for better display
function formatResponse(text, type, language) {
  if (!text || text.trim() === "") {
    return '<span class="placeholder">No response received.</span>';
  }

  // For CODE type, format with syntax highlighting
  if (type === "code") {
    return formatCodeResponse(text, language);
  }
  
  // For HINTS and APPROACH, format with better structure
  if (type === "hints" || type === "approach") {
    return formatTextResponse(text);
  }
  
  // Default formatting
  return `<div class="response-content">${escapeHtml(text)}</div>`;
}

// SVGs for copy and checkmark
const COPY_SVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" style="vertical-align:middle;"><path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z" fill="currentColor"/></svg>`;
const CHECK_SVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" style="vertical-align:middle;"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" fill="currentColor"/></svg>`;

// Function to format code responses
function formatCodeResponse(text, language) {
  // Split text into explanation and code parts
  const parts = text.split('```');
  
  let formatted = '<div class="response-content">';
  
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i].trim();
    
    if (i % 2 === 0) {
      // This is explanation text (outside code blocks)
      if (part) {
        formatted += `<div class="explanation">${escapeHtml(part)}</div>`;
      }
    } else {
      // This is code (inside code blocks)
      if (part) {
        // Remove language identifier if present
        const codeContent = part.replace(/^(java|python|c\+\+|javascript|typescript)\n?/i, '');
        const highlightedCode = highlightSyntax(codeContent, language);
        const codeId = 'code-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        formatted += `
          <div class="code-block">
            <div class="language-tag">${language.toUpperCase()}</div>
            <button class="copy-button" data-code="${escapeHtml(codeContent)}">
              <span class="icon" aria-label="Copy">${COPY_SVG}</span>
              <span class="text">Copy</span>
            </button>
            <pre id="${codeId}">${highlightedCode}</pre>
          </div>
        `;
      }
    }
  }
  
  formatted += '</div>';
  return formatted;
}

// Function to format text responses (hints, approach)
function formatTextResponse(text) {
  // Convert markdown-style formatting to HTML
  let formatted = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')  // Bold
    .replace(/\*(.*?)\*/g, '<em>$1</em>')              // Italic
    .replace(/^### (.*$)/gm, '<h4>$1</h4>')            // Headers
    .replace(/^## (.*$)/gm, '<h3>$1</h3>')             // Headers
    .replace(/^# (.*$)/gm, '<h3>$1</h3>')              // Headers
    .replace(/^- (.*$)/gm, '<li>$1</li>')              // List items
    .replace(/\n\n/g, '</p><p>')                       // Paragraphs
    .replace(/^(.+)$/gm, '<p>$1</p>');                 // Wrap lines in paragraphs
  
  // Clean up empty paragraphs
  formatted = formatted.replace(/<p><\/p>/g, '');
  
  // Wrap lists properly
  formatted = formatted.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
  
  return `<div class="response-content">${formatted}</div>`;
}

// Function to highlight syntax (basic implementation)
function highlightSyntax(code, language) {
  // Return clean code without any HTML tags for syntax highlighting
  return escapeHtml(code);
}

// Function to escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Function to add copy functionality
function addCopyFunctionality() {
  const codeBlocks = document.querySelectorAll('.code-block');
  codeBlocks.forEach(block => {
    const button = block.querySelector('.copy-button');
    const preElement = block.querySelector('pre');
    
    // Get the original clean code from the data attribute
    const originalCode = button.getAttribute('data-code');
    
    // Use the original code for copying (preserves formatting)
    button.addEventListener('click', () => {
      copyToClipboard(originalCode);
    });
  });
}

// Function to copy text to clipboard
function copyToClipboard(text) {
  // Use modern Clipboard API if available
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      // Find the clicked button and animate it
      const buttons = document.querySelectorAll('.copy-button');
      buttons.forEach(button => {
        const buttonCode = button.getAttribute('data-code');
        if (buttonCode === text) {
          animateCopyButton(button);
        }
      });
      showMessage("Code copied to clipboard!", "success");
    }).catch(err => {
      console.error('Failed to copy: ', err);
      fallbackCopyToClipboard(text);
    });
  } else {
    // Fallback for older browsers
    fallbackCopyToClipboard(text);
  }
}

// Fallback copy function
function fallbackCopyToClipboard(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  try {
    document.execCommand('copy');
    // Find the clicked button and animate it
    const buttons = document.querySelectorAll('.copy-button');
    buttons.forEach(button => {
      const buttonCode = button.getAttribute('data-code');
      if (buttonCode === text) {
        animateCopyButton(button);
      }
    });
    showMessage("Code copied to clipboard!", "success");
  } catch (err) {
    console.error('Fallback copy failed: ', err);
    showMessage("Failed to copy code", "error");
  }
  
  document.body.removeChild(textArea);
}

// Function to animate copy button
function animateCopyButton(button) {
  const icon = button.querySelector('.icon');
  const text = button.querySelector('.text');
  
  // Change to checkmark SVG
  icon.innerHTML = CHECK_SVG;
  text.textContent = 'Copied!';
  button.classList.add('copied');
  
  // Revert back after 3 seconds
  setTimeout(() => {
    icon.innerHTML = COPY_SVG;
    text.textContent = 'Copy';
    button.classList.remove('copied');
  }, 3000);
} 