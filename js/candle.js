function createCandle(wish) {
    const candlesContainer = document.getElementById('candlesContainer');
    const candle = document.createElement('div');
    candle.className = 'candle';
    
    // 촛불 HTML 구조 생성
    candle.innerHTML = `
        <div class="flame">
            <div class="flame-inner"></div>
        </div>
        <div class="wick"></div>
        <div class="wax"></div>
        <div class="wish-text">${wish}</div>
    `;

    // 랜덤 위치 설정
    const x = Math.random() * (candlesContainer.offsetWidth - 100);
    const y = Math.random() * (candlesContainer.offsetHeight - 150);
    
    candle.style.left = `${x}px`;
    candle.style.top = `${y}px`;
    
    candlesContainer.appendChild(candle);

    // CSS 애니메이션을 위한 스타일 추가
    const styles = document.createElement('style');
    styles.textContent = `
        .candle {
            position: absolute;
            width: 50px;
            text-align: center;
            animation: float 6s ease-in-out infinite;
        }

        .flame {
            width: 15px;
            height: 25px;
            background: #ff9800;
            border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
            margin: 0 auto;
            position: relative;
            animation: flicker 1s ease-in-out infinite;
        }

        .flame-inner {
            width: 8px;
            height: 16px;
            background: #ffeb3b;
            border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
            margin: 0 auto;
            position: absolute;
            top: 4px;
            left: 4px;
        }

        .wick {
            width: 2px;
            height: 10px;
            background: #424242;
            margin: 0 auto;
        }

        .wax {
            width: 20px;
            height: 40px;
            background: #fff;
            border-radius: 5px;
            margin: 0 auto;
        }

        .wish-text {
            color: #fff;
            font-size: 12px;
            margin-top: 10px;
            text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
            max-width: 150px;
            word-wrap: break-word;
        }

        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
        }

        @keyframes flicker {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(0.9); }
        }
    `;

    document.head.appendChild(styles);
}