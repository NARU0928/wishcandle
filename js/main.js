document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded');
    const submitButton = document.getElementById('submitWish');
    const wishInput = document.getElementById('wishInput');

    submitButton.addEventListener('click', async () => {
        const wish = wishInput.value.trim();
        if (!wish) return;

        try {
            console.log('Submitting wish:', wish);
            const response = await fetch('https://script.google.com/macros/s/AKfycbzb8vAIj_H_azlf1CVFMrPS58t-0ZYAeUP71gV2O_3u6G3kU4z3jtZXvOCow07hprz5/exec', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'text/plain',
                },
                body: JSON.stringify({
                    wish: wish
                })
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    console.log('Wish submitted successfully');
                    createCandle(wish);
                    wishInput.value = '';
                }
            } else {
                console.error('Failed to submit wish');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
});