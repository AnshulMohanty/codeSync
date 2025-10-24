#!/usr/bin/env node

// Test script to verify all backend routes are working
const API_BASE_URL = 'https://codesync-o61n.onrender.com';

async function testRoute(method, endpoint, data = null, description = '') {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    console.log(`\n🧪 Testing: ${method} ${endpoint}`);
    console.log(`📝 Description: ${description}`);
    
    const response = await fetch(url, options);
    const responseData = await response.json();
    
    if (response.ok) {
      console.log(`✅ SUCCESS (${response.status}):`, JSON.stringify(responseData, null, 2));
    } else {
      console.log(`❌ ERROR (${response.status}):`, JSON.stringify(responseData, null, 2));
    }
    
    return { success: response.ok, status: response.status, data: responseData };
  } catch (error) {
    console.log(`💥 EXCEPTION:`, error.message);
    return { success: false, error: error.message };
  }
}

async function runAllTests() {
  console.log('🚀 Testing CodeSync Backend Routes');
  console.log('=====================================');
  
  // Test 1: Health Check
  await testRoute('GET', '/api/health', null, 'Health check endpoint');
  
  // Test 2: Create Project
  const createResult = await testRoute('POST', '/api/projects', {
    projectName: 'Test Project',
    language: 'javascript'
  }, 'Create a new project');
  
  let projectId = null;
  if (createResult.success && createResult.data.projectId) {
    projectId = createResult.data.projectId;
    console.log(`📋 Created project ID: ${projectId}`);
  }
  
  // Test 3: Get Recent Projects
  await testRoute('GET', '/api/projects/recent', null, 'Get recent projects');
  
  // Test 4: Get Project (if we have a project ID)
  if (projectId) {
    await testRoute('GET', `/api/projects/${projectId}`, null, 'Get project by ID');
    
    // Test 5: Update Project
    await testRoute('PUT', `/api/projects/${projectId}`, {
      content: 'console.log("Hello World");',
      projectName: 'Updated Test Project'
    }, 'Update project content');
    
    // Test 6: Create File
    await testRoute('POST', `/api/projects/${projectId}/files`, {
      path: '/test.js',
      name: 'test.js',
      content: 'console.log("Hello from file");',
      language: 'javascript'
    }, 'Create a new file');
    
    // Test 7: Update File
    await testRoute('PUT', `/api/projects/${projectId}/files/test.js`, {
      content: 'console.log("Updated content");',
      language: 'javascript'
    }, 'Update file content');
    
    // Test 8: Create Folder
    await testRoute('POST', `/api/projects/${projectId}/folders`, {
      path: '/src',
      name: 'src'
    }, 'Create a new folder');
    
    // Test 9: Delete File
    await testRoute('DELETE', `/api/projects/${projectId}/files/test.js`, null, 'Delete file');
    
    // Test 10: Delete Project
    await testRoute('DELETE', `/api/projects/${projectId}`, null, 'Delete project');
  }
  
  // Test 11: AI Debug
  await testRoute('POST', '/api/ai/debug', {
    codeSnippet: 'function test() { return "hello"; }',
    language: 'javascript',
    context: 'Test debugging'
  }, 'AI debug endpoint');
  
  // Test 12: AI Explain
  await testRoute('POST', '/api/ai/explain', {
    codeSnippet: 'function add(a, b) { return a + b; }',
    language: 'javascript'
  }, 'AI explain endpoint');
  
  // Test 13: Cleanup Operations
  await testRoute('DELETE', '/api/projects/cleanup', null, 'Cleanup dummy projects');
  await testRoute('DELETE', '/api/projects/cleanup-unsaved', null, 'Cleanup unsaved projects');
  
  // Test 14: Error Handling
  await testRoute('GET', '/api/nonexistent', null, 'Test 404 error handling');
  
  console.log('\n🎉 All tests completed!');
}

// Run tests if this script is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { testRoute, runAllTests };
