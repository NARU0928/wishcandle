// Google Sheets API 설정
const SPREADSHEET_ID = '1W5Y5DEVp-au3dpFcJ2CJwpwZce1O2-RVlYtJ40PEB_0'; // URL에서 찾을 수 있는 ID
const API_KEY = 'AIzaSyDQmZgyYEe6LLIddmJZMOKjwmmkF5nuzac';

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded');
    const submitButton = document.getElementById('submitWish');
    const wishInput = document.getElementById('wishInput');

    submitButton.addEventListener('click', async () => {
        const wish = wishInput.value.trim();
        if (!wish) return;

        try {
            const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Sheet1!A:C:append?valueInputOption=USER_ENTERED&key=${API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    values: [[new Date().toISOString(), wish, Math.random().toString(36).substring(7)]]
                })
            });

            if (response.ok) {
                console.log('Wish submitted successfully');
                createCandle(wish);
                wishInput.value = '';
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
});