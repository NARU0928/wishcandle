// Google Sheets API 설정
const SPREADSHEET_ID = '1W5Y5DEVp-au3dpFcJ2CJwpwZce1O2-RVlYtJ40PEB_0'; // URL에서 찾을 수 있는 ID
const API_KEY = 'AIzaSyC2B0af40pu7-xflPSuJQSDmre5WgvUh-Q';

class WishManager {
    constructor() {
        console.log('WishManager initialized');
        this.wishForm = document.getElementById('wishForm');
        this.wishInput = document.getElementById('wishInput');
        
        if (!this.wishForm || !this.wishInput) {
            console.error('Form elements not found:', {
                wishForm: this.wishForm,
                wishInput: this.wishInput
            });
        }
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        console.log('Setting up event listeners');
        this.wishForm.addEventListener('submit', async (e) => {
            e.preventDefault();  // 폼 기본 동작 중지
            console.log('Form submitted');
            await this.submitWish();
        });
    }

    async submitWish() {
        console.log('Submitting wish...');
        const wish = this.wishInput.value.trim();
        if (!wish) {
            console.log('Empty wish, returning');
            return;
        }

        try {
            console.log('Attempting to submit wish:', wish);
            // Google Sheets API를 사용하여 데이터 추가
            const response = await this.appendToSheet(wish);
            if (response.ok) {
                // 촛불 생성
                createCandle(wish);
                this.wishInput.value = '';
            }
        } catch (error) {
            console.error('Error submitting wish:', error);
        }
    }

    async appendToSheet(wish) {
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
}

// 페이지 로드 시 WishManager 인스턴스 생성
window.addEventListener('DOMContentLoaded', () => {
    new WishManager();
});