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
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ wish })
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Server response:', result);
                if (result.success) {
                    console.log('Wish submitted successfully');
                    createCandle(wish);
                    wishInput.value = '';
                }
            } else {
                console.error('Server returned error:', response.status);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
});