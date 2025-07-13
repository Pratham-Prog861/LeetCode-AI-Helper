# LeetCode AI Helper Chrome Extension

A powerful Chrome extension that provides AI-powered assistance for solving LeetCode problems using Google's Gemini AI. Get hints, approach explanations, and complete code solutions directly while working on LeetCode problems.

## Features

- **💡 Progressive Hints**: Get 3-5 progressive hints that guide you toward the solution without spoiling the answer.

- **🧠 Detailed Approach**: Understand the algorithm, edge cases, and time/space complexity.

- **💻 Complete Code**: Get working code solutions in your preferred programming language.

- **🔐 Secure API Key Storage**: Your Gemini API key is stored securely in Chrome's sync storage.

- **🎨 Modern UI**: Beautiful gradient design with smooth animations and responsive layout.

- **🌐 Multi-language Support**: Python, C++, Java, JavaScript, and TypeScript.

## Installation

### Prerequisites

- **Google Gemini API Key**: Get your free API key from [Google AI Studio](https://aistudio.google.com/apikey)

### Steps to Install

1. **Download the Extension**
   - Clone or download this repository to your local machine.

2. **Load Extension in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" in the top right corner.
   - Click "Load unpacked" and select the folder containing the extension files.

3. **Set Up API Key**
   - Click on the extension icon in your Chrome toolbar.
   - Paste your Gemini API key in the input field.
   - Click "Save Key" to securely store it.

## Usage

1. **Navigate to LeetCode**
   - Go to any LeetCode problem page (e.g., [https://leetcode.com/problems/two-sum/](https://leetcode.com/problems/two-sum/))

2. **Open the Extension**
   - Click the extension icon in your Chrome toolbar.
   - The popup will appear with three options.

3. **Choose Your Assistance Type**
   - **Hints**: Get progressive hints to guide your thinking.
   - **Approach**: Understand the algorithm and strategy.
   - **Code**: Get complete working code in your chosen language.

4. **Select Programming Language**
   - Choose your preferred language from the dropdown menu.

5. **Get AI Response**
   - Click any of the three buttons.
   - The AI will analyze the problem and provide the requested assistance.
   - Results appear in the response area below.

## File Structure

```bash
leetcode-solver/
├── popup.html          # Main popup interface
├── popup.css           # Styling and animations
├── popup.js            # Core functionality and API integration
├── manifest.json       # Chrome extension configuration
├── icon16.png          # Extension icon (16x16)
├── icon48.png          # Extension icon (48x48)
├── icon128.png         # Extension icon (128x128)
└── README.md           # This file
```

## How It Works

1. **Problem Detection**: The extension detects when you're on a LeetCode problem page.
2. **Data Extraction**: It extracts the problem title and description from the page.
3. **AI Processing**: Sends the problem data to Gemini AI with specific instructions based on your selection.
4. **Response Formatting**: The AI responds with hints, approach, or code, which is displayed in the popup.
5. **Secure Storage**: Your API key is stored securely using Chrome's sync storage.

## Troubleshooting

- **"Please set your Gemini API Key first"**: Make sure you've entered and saved your API key.
- **"Please navigate to a LeetCode problem page"**: Ensure you're on a LeetCode problem page (URL should contain leetcode.com).
- **"Could not extract problem data"**: LeetCode may have updated their page structure. Try refreshing the page.
- **API Errors**: Check your internet connection and verify your API key is correct.

## Privacy & Security

- Your API key is stored securely in Chrome's sync storage.
- No data is sent to any servers except Google's Gemini API.
- Problem data is only extracted from the current LeetCode page.
- No personal information is collected or stored.

## License

This project is open source and available under the MIT License.

## Note

This extension requires a valid Google Gemini API key to function. The API has usage limits and may incur costs depending on your usage plan.
