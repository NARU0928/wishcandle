const { google } = require('googleapis');

exports.handler = async function(event, context) {
  console.log('Function started');  // 디버깅 로그 추가

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' })
    };
  }

  try {
    console.log('Request body:', event.body);  // 요청 데이터 로깅
    const { wish } = JSON.parse(event.body);
    
    // 환경 변수 확인
    console.log('Checking environment variables');
    if (!process.env.SPREADSHEET_ID || !process.env.GOOGLE_API_KEY) {
      throw new Error('Required environment variables are missing');
    }

    // Google Sheets API 초기화
    console.log('Initializing Google Sheets API');
    const sheets = google.sheets({ 
      version: 'v4',
      auth: process.env.GOOGLE_API_KEY
    });
    
    console.log('Preparing to append data');
    // 스프레드시트에 데이터 추가
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: 'Sheet1!A:C',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[new Date().toISOString(), wish, Math.random().toString(36).substring(7)]]
      }
    });

    console.log('Data appended successfully');
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Wish added successfully',
        success: true
      })
    };

  } catch (error) {
    console.error('Function error:', error);  // 에러 상세 로깅
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Failed to add wish',
        error: error.message,
        success: false
      })
    };
  }
};