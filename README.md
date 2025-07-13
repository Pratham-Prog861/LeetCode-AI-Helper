# LeetCode AI Helper Chrome Extension

A powerful Chrome extension that provides AI-powered assistance for solving LeetCode problems using Google's Gemini AI. Get hints, approach explanations, and complete code solutions directly while working on LeetCode problems.

## Features

- **💡 Progressive Hints**: Get 3-5 progressive hints that guide you toward the solution without spoiling the answer
- **🧠 Detailed Approach**: Understand the algorithm, edge cases, and time/space complexity
- **💻 Complete Code**: Get working code solutions in your preferred programming language
- **🔐 Secure API Key Storage**: Your Gemini API key is stored securely in Chrome's sync storage
- **🎨 Modern UI**: Beautiful gradient design with smooth animations and responsive layout
- **🌐 Multi-language Support**: Python, C++, Java, JavaScript, and TypeScript

## Installation

### Prerequisites

1. **Google Gemini API Key**: Get your free API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Steps to Install

1. **Download the Extension**
   - Clone or download this repository to your local machine

2. **Load Extension in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" in the top right corner
   - Click "Load unpacked" and select the folder containing the extension files

3. **Set Up API Key**
   - Click on the extension icon in your Chrome toolbar
   - Paste your Gemini API key in the input field
   - Click "🔐 Save Key" to securely store it

## Usage

1. **Navigate to LeetCode**
   - Go to any LeetCode problem page (e.g., [https://leetcode.com/problems/two-sum/](https://leetcode.com/problems/two-sum/))

2. **Open the Extension**
   - Click the extension icon in your Chrome toolbar
   - The popup will appear with three options

3. **Choose Your Assistance Type**
   - **💡 Hints**: Get progressive hints to guide your thinking
   - **🧠 Approach**: Understand the algorithm and strategy
   - **💻 Code**: Get complete working code in your chosen language

4. **Select Programming Language**
   - Choose your preferred language from the dropdown menu
   - Available options: Python, C++, Java, JavaScript, TypeScript

5. **Get AI Response**
   - Click any of the three buttons
   - The AI will analyze the problem and provide the requested assistance
   - Results appear in the response area below

## File Structure

```bash
leetcode-solver/
├── popup.html          # Main popup interface
├── popup.css           # Styling and animations
├── popup.js            # Core functionality and API integration
├── manifest.json       # Chrome extension configuration
├── README.md           # This file
├── icon16.png          # Extension icon (16x16)
├── icon48.png          # Extension icon (48x48)
└── icon128.png         # Extension icon (128x128)
```

## How It Works

1. **Problem Detection**: The extension automatically detects when you're on a LeetCode problem page
2. **Data Extraction**: It extracts the problem title and description from the page
3. **AI Processing**: Sends the problem data to Gemini AI with specific instructions based on your selection
4. **Response Formatting**: The AI responds according to the format specified in `requirement.txt`
5. **Secure Storage**: Your API key is stored securely using Chrome's sync storage

## AI Response Formats

### Hints Mode

- Provides 3-5 progressive hints
- Starts with simple observations
- Gradually becomes more specific
- Never reveals the complete solution

### Approach Mode

- Explains the algorithm step-by-step
- Covers edge cases and considerations
- Includes time and space complexity analysis
- Suggests appropriate data structures

### Code Mode

- Provides complete, working code
- Includes detailed comments
- Follows best practices for the selected language
- Includes a brief explanation of the solution

## Troubleshooting

### Common Issues

1. **"Please set your Gemini API Key first"**
   - Make sure you've entered and saved your API key
   - Check that the key is valid and has proper permissions

2. **"Please navigate to a LeetCode problem page"**
   - Ensure you're on a LeetCode problem page (URL should contain leetcode.com)
   - Refresh the page and try again

3. **"Could not extract problem data"**
   - LeetCode may have updated their page structure
   - Try refreshing the page
   - Make sure you're on the problem description page

4. **API Errors**
   - Check your internet connection
   - Verify your API key is correct
   - Ensure you haven't exceeded your API quota

### Getting Help

If you encounter issues:

1. Check the browser console for error messages
2. Verify your API key is working on Google AI Studio
3. Make sure you're on a valid LeetCode problem page
4. Try refreshing the page and extension

## Privacy & Security

- Your API key is stored securely in Chrome's sync storage
- No data is sent to any servers except Google's Gemini API
- Problem data is only extracted from the current LeetCode page
- No personal information is collected or stored

## Contributing

Feel free to contribute to this project by:

- Reporting bugs
- Suggesting new features
- Improving the UI/UX
- Adding support for more programming languages

## License

This project is open source and available under the MIT License.

## Support

For support or questions, please open an issue on the GitHub repository.

## Note

This extension requires a valid Google Gemini API key to function. The API has usage limits and may incur costs depending on your usage plan.
