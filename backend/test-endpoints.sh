#!/bin/bash

# Replace with your actual Render URL
BACKEND_URL="https://your-app-name.onrender.com"

echo "🧪 Testing CodeSync Backend Endpoints"
echo "======================================"

echo ""
echo "1. Health Check:"
curl -s "$BACKEND_URL/api/health" | python -m json.tool

echo ""
echo "2. Recent Projects:"
curl -s "$BACKEND_URL/api/projects/recent" | python -m json.tool

echo ""
echo "3. Create Test Project:"
curl -s -X POST "$BACKEND_URL/api/projects" \
  -H "Content-Type: application/json" \
  -d '{"projectName": "Test Project", "language": "javascript"}' | python -m json.tool

echo ""
echo "4. AI Debug Test:"
curl -s -X POST "$BACKEND_URL/api/ai/debug" \
  -H "Content-Type: application/json" \
  -d '{"codeSnippet": "console.log(\"Hello\");", "language": "javascript"}' | python -m json.tool

echo ""
echo "5. AI Explain Test:"
curl -s -X POST "$BACKEND_URL/api/ai/explain" \
  -H "Content-Type: application/json" \
  -d '{"codeSnippet": "function test() { return true; }", "language": "javascript"}' | python -m json.tool

echo ""
echo "✅ All tests completed!"
