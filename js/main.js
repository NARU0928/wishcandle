// Google Sheets API 설정
const SPREADSHEET_ID = '1W5Y5DEVp-au3dpFcJ2CJwpwZce1O2-RVlYtJ40PEB_0'; // URL에서 찾을 수 있는 ID
const API_KEY = 'AIzaSyC2B0af40pu7-xflPSuJQSDmre5WgvUh-Q';


class WishManager {
    constructor() {
        this.wishForm = document.getElementById('wishForm');
        this.wishInput = document.getElementById('wishInput');
        this.setupEventListeners();
    }

    async appendToSheet(wish) {
        const now = new Date().toISOString();
        const id = Math.random().toString(36).substr(2, 9);
        
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Sheet1!A:C:append?valueInputOption=USER_ENTERED&key=${API_KEY}`;
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    values: [[now, wish, id]]
                })
            });

            if (!response.ok) {
                console.error('Error response:', await response.text());
                throw new Error('Network response was not ok');
            }

            return response;
        } catch (error) {
            console.error('Error in appendToSheet:', error);
            throw error;
        }
    }
    // ... 나머지 코드는 동일하게 유지
}