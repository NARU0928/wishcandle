// Google Sheets API 설정
const SPREADSHEET_ID = '1W5Y5DEVp-au3dpFcJ2CJwpwZce1O2-RVlYtJ40PEB_0'; // URL에서 찾을 수 있는 ID
const API_KEY = 'AIzaSyDQmZgyYEe6LLIddmJZMOKjwmmkF5nuzac';

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded');
    const submitButton = document.getElementById('submitWish');
    const wishInput = document.getElementById('wishInput');

    if (!submitButton || !wishInput) {
        console.error('Required elements not found:', {
            submitButton: !!submitButton,
            wishInput: !!wishInput
        });
        return;
    }

    submitButton.addEventListener('click', async () => {
        console.log('Submit button clicked');
        const wish = wishInput.value.trim();
        
        if (!wish) {
            console.log('Empty wish, returning');
            return;
        }

        try {
            console.log('Attempting to submit wish:', wish);
            const response = await appendToSheet(wish);
            
            if (response.ok) {
                console.log('Wish submitted successfully');
                createCandle(wish);
                wishInput.value = '';
            } else {
                console.error('Failed to submit wish:', response);
            }
        } catch (error) {
            console.error('Error submitting wish:', error);
        }
    });
});

async function appendToSheet(wish) {
    console.log('Appending to sheet:', wish);
    const now = new Date().toISOString();
    const id = Math.random().toString(36).substr(2, 9);
    
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Sheet1!A:C:append?valueInputOption=USER_ENTERED&key=${API_KEY}`;
    
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            values: [[now, wish, id]]
        })
    });
}