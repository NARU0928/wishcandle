const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' })
    };
  }

  try {
    console.log('Function invoked');
    const { wish } = JSON.parse(event.body);
    
    // Google Apps Script 웹앱 URL을 환경변수로 설정
    const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL;
    
    // Google Apps Script로 요청 전달
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify({ wish })
    });

    const data = await response.text();
    console.log('Response from Apps Script:', data);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Wish added successfully'
      })
    };

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: 'Failed to add wish',
        error: error.message
      })
    };
  }
};