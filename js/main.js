document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM fully loaded');
    const submitButton = document.getElementById('submitWish');
    const wishInput = document.getElementById('wishInput');
    
    // 기존 소원들 불러오기
    await loadExistingWishes();

    // 비속어 필터링을 위한 정규식 패턴
    const badWordsPattern = [
        // 일반적인 비속어
        '시발', '씨발', 'ㅅㅂ', '좆', 'ㅈ같', '지랄', 'ㅈㄹ', '병신', 'ㅂㅅ', '미친',
        // 신체 비하
        '죽어', '뒤져', '뒈져', '새끼', 'ㅅㄲ',
        // 차별적 표현
        '장애새끼', '장애인', '병신',
        // 성적 비하
        '보지', '자지', '불알', '똥', '씹',
        // 변형된 표현
        '시1발', '씨1발', 'tl발', 'tlqkf', '느금', '늑그', '느그', '보징', '시bal', '시팔',
        // 비하성 은어
        '한남', '한녀', '崔x', '문x', '급식충', '틀딱', '냄저', '벌레',
        // 특수문자 변형
        '시*', 'ㅆ*', '*발', 'ㅁㅊ'
    ].map(word => 
        new RegExp(word.split('').join('[\\s\\*\\.]*'), 'i')
    );

    // 비속어 감지 함수
    function containsBadWords(text) {
        return badWordsPattern.some(pattern => pattern.test(text));
    }

    // 알림 메시지 표시 함수
    function showAlert(message) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert-message';
        alertDiv.textContent = message;
        document.body.appendChild(alertDiv);

        // 애니메이션을 위한 지연
        setTimeout(() => alertDiv.classList.add('show'), 100);

        // 3초 후 제거
        setTimeout(() => {
            alertDiv.classList.remove('show');
            setTimeout(() => alertDiv.remove(), 500);
        }, 3000);
    }

    submitButton.addEventListener('click', async () => {
        const wish = wishInput.value.trim();
        if (!wish) return;

        // 비속어 확인
        if (containsBadWords(wish)) {
            showAlert('따뜻한 말로 소원을 비세요 💭');
            return;
        }

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