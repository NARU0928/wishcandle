const { google } = require('googleapis');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ message: 'Method Not Allowed' }) };
  }

  try {
    // 서비스 계정 인증 정보 파싱
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
    
    // JWT 클라이언트 생성
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    const sheets = google.sheets({ version: 'v4', auth });
    
    // 요청 데이터 파싱
    const { wish } = JSON.parse(event.body);
    
    // 스프레드시트에 데이터 추가
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: '시트1!A2:C',  // 시트 이름을 '시트1'로 변경하고, 헤더 다음 행부터 시작
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[new Date().toISOString(), wish, Math.random().toString(36).substring(7)]]
      }
    });

    console.log('Spreadsheet response:', response.data);  // 응답 로깅 추가

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
        message: error.message
      })
    };
  }
};