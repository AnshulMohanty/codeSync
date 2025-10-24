const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// AI Debug endpoint
const debugCode = async (req, res) => {
  try {
    const { codeSnippet, language, context } = req.body;

    if (!codeSnippet || !language) {
      return res.status(400).json({
        success: false,
        error: 'Code snippet and language are required'
      });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const prompt = `
Analyze this ${language} code for bugs and issues:

\`\`\`${language}
${codeSnippet}
\`\`\`

Context: ${context || 'General code analysis'}

Please provide:
1. Any syntax errors or runtime errors
2. Logic issues or potential bugs
3. A suggested fix if there are issues
4. Severity level (error, warning, info)

Format your response as JSON:
{
  "issue": "Brief description of the issue",
  "explanation": "Detailed explanation of what's wrong",
  "suggestedFix": "Corrected code",
  "severity": "error|warning|info"
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Try to parse JSON response
    let feedback;
    try {
      feedback = JSON.parse(text);
    } catch (parseError) {
      // If not JSON, create a structured response
      feedback = {
        issue: "Code analysis completed",
        explanation: text,
        suggestedFix: codeSnippet,
        severity: "info"
      };
    }

    res.json({
      success: true,
      feedback
    });

  } catch (error) {
    console.error('AI Debug error:', error);
    
    if (error.message.includes('timeout')) {
      return res.status(408).json({
        success: false,
        error: 'AI request timed out. Please try again.'
      });
    }

    res.status(503).json({
      success: false,
      error: 'AI service temporarily unavailable. Please try again.'
    });
  }
};

// AI Explain endpoint
const explainCode = async (req, res) => {
  try {
    const { codeSnippet, language } = req.body;

    if (!codeSnippet || !language) {
      return res.status(400).json({
        success: false,
        error: 'Code snippet and language are required'
      });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const prompt = `
Explain this ${language} code in plain English:

\`\`\`${language}
${codeSnippet}
\`\`\`

Please provide a clear, step-by-step explanation that breaks down:
1. What the code does overall
2. How each part works
3. Key concepts or patterns used
4. Any important details about the implementation

Format your response as a clear, structured explanation with bullet points where appropriate.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const explanation = response.text();

    res.json({
      success: true,
      explanation
    });

  } catch (error) {
    console.error('AI Explain error:', error);
    
    if (error.message.includes('timeout')) {
      return res.status(408).json({
        success: false,
        error: 'AI request timed out. Please try again.'
      });
    }

    res.status(503).json({
      success: false,
      error: 'AI service temporarily unavailable. Please try again.'
    });
  }
};

module.exports = {
  debugCode,
  explainCode
};
