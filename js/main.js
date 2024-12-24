document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded');
    const submitButton = document.getElementById('submitWish');
    const wishInput = document.getElementById('wishInput');

    submitButton.addEventListener('click', async () => {
        const wish = wishInput.value.trim();
        if (!wish) return;

        try {
            console.log('Submitting wish:', wish);
            const response = await fetch('https://script.google.com/macros/s/AKfycbzI6KrjaWG69BlPYvbNv6p9e2J5A4cVMezxuF2OELM6b0FBt2kpnNdkdhGleX-es8uy/exec', {
                method: 'POST',
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