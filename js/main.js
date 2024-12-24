document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded');
    const submitButton = document.getElementById('submitWish');
    const wishInput = document.getElementById('wishInput');

    submitButton.addEventListener('click', async () => {
        const wish = wishInput.value.trim();
        if (!wish) return;

        try {
            console.log('Submitting wish:', wish);
            const response = await fetch('/.netlify/functions/submitWish', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
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