document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM fully loaded');
    const submitButton = document.getElementById('submitWish');
    const wishInput = document.getElementById('wishInput');
    
    // 기존 소원들 불러오기
    await loadExistingWishes();

    submitButton.addEventListener('click', async () => {
        const wish = wishInput.value.trim();
        if (!wish) return;

        try {
            console.log('Submitting wish:', wish);
            const response = await fetch('/.netlify/functions/submitWish', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ wish })
            });

            const result = await response.json();
            if (result.success) {
                console.log('Wish submitted successfully');
                createCandle(wish);
                wishInput.value = '';
            } else {
                console.error('Failed to submit wish:', result.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
});

// 기존 소원들을 불러오는 함수
async function loadExistingWishes() {
    try {
        const response = await fetch('/.netlify/functions/getWishes');
        const result = await response.json();
        
        if (result.success && result.wishes) {
            result.wishes.forEach(wishData => {
                if (wishData.wish) {
                    createCandle(wishData.wish);
                }
            });
        }
    } catch (error) {
        console.error('Error loading existing wishes:', error);
    }
}