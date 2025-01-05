const { google } = require('googleapis');

exports.handler = async function(event, context) {
  try {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
    
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    const sheets = google.sheets({ version: 'v4', auth });
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: '시트1!A2:C'
    });

    const rows = response.data.values || [];
    const wishes = rows.map(row => ({
      timestamp: row[0],
      wish: row[1],
      id: row[2]
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        wishes: wishes
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