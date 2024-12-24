const { google } = require('googleapis');

exports.handler = async function(event, context) {
  // POST 메소드가 아닐 경우 오류 반환
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed'
    };
  }

  try {
    // 요청 본문에서 wish 데이터 추출
    const { wish } = JSON.parse(event.body);
    const spreadsheetId = process.env.SPREADSHEET_ID;
    const apiKey = process.env.GOOGLE_API_KEY;

    // Google Sheets API 초기화
    const sheets = google.sheets({ version: 'v4', auth: apiKey });
    
    // 스프레드시트에 데이터 추가
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A:C',
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [[new Date().toISOString(), wish, Math.random().toString(36).substring(7)]]
      }
    });

    // 성공 응답 반환
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Wish added successfully',
        success: true
      })
    };

  } catch (error) {
    console.error('Function error:', error);
    // 오류 응답 반환
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Failed to add wish',
        error: error.message,
        success: false
      })
    };
  }
};