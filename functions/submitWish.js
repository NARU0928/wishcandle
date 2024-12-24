exports.handler = async function(event, context) {
  // 로그 시작
  console.log('Function invoked');

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' })
    };
  }

  try {
    // 요청 바디 파싱
    const { wish } = JSON.parse(event.body);
    console.log('Received wish:', wish);

    // 환경변수 확인
    console.log('Checking environment variables');
    const spreadsheetId = process.env.SPREADSHEET_ID;
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!spreadsheetId || !apiKey) {
      throw new Error('Missing required environment variables');
    }

    // Google Sheets API 엔드포인트 직접 호출
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A:C:append?valueInputOption=USER_ENTERED&key=${apiKey}`;
    
    console.log('Sending request to Google Sheets API');
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [[new Date().toISOString(), wish, Math.random().toString(36).substr(2, 9)]]
      })
    });

    const data = await response.json();
    console.log('Google Sheets API response:', data);

    if (!response.ok) {
      throw new Error(`Google Sheets API error: ${data.error?.message || 'Unknown error'}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Wish added successfully',
        success: true
      })
    };

  } catch (error) {
    console.error('Function error:', error);
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