let existingCandles = [];

function findSafePosition(container) {
    const isMobile = window.innerWidth <= 768;
    const padding = isMobile ? 10 : 20;
    const candleWidth = isMobile ? 100 : 150;    // 모바일에서는 더 작게
    const candleHeight = isMobile ? 90 : 120;    // 모바일에서는 더 작게
    
    const maxTries = 100;
    let tries = 0;
    
    while (tries < maxTries) {
        const x = padding + Math.random() * (container.offsetWidth - candleWidth - padding * 2);
        const y = padding + Math.random() * (container.offsetHeight - candleHeight - padding * 2);
        
        if (isPositionSafe(x, y, candleWidth, candleHeight)) {
            return { x, y };
        }
        tries++;
    }
    
    // 격자 방식으로 배치할 때 모바일 환경 고려
    const columns = isMobile ? 3 : 5;  // 모바일에서는 열 수를 줄임
    const gridX = (existingCandles.length % columns) * (candleWidth + padding);
    const gridY = Math.floor(existingCandles.length / columns) * (candleHeight + padding);
    
    return { x: gridX + padding, y: gridY + padding };
}

function isPositionSafe(x, y, width, height) {
    return existingCandles.every(candle => {
        const horizontalDistance = Math.abs(x - candle.x);
        const verticalDistance = Math.abs(y - candle.y);
        return horizontalDistance > width || verticalDistance > height;
    });
}

function createCandle(wish) {
    const candlesContainer = document.getElementById('candlesContainer');
    const candle = document.createElement('div');
    candle.className = 'candle';
    
    // 촛불 HTML 구조 생성
    candle.innerHTML = `
        <div class="glow"></div>
        <div class="flame">
            <div class="flame-inner"></div>
        </div>
        <div class="wick"></div>
        <div class="wax"></div>
        <div class="wish-text">${wish}</div>
    `;

    // 랜덤 위치 설정
    const position = findSafePosition(candlesContainer);
    candle.style.left = `${position.x}px`;
    candle.style.top = `${position.y}px`;
    
    candlesContainer.appendChild(candle);
    existingCandles.push({
        element: candle,
        x: position.x,
        y: position.y,
        width: candle.offsetWidth,
        height: candle.offsetHeight
    });

    // CSS 애니메이션 스타일 추가
    const styles = document.createElement('style');
    styles.textContent = `
        .candle {
            position: absolute;
            width: 50px;
            text-align: center;
            animation: float 6s ease-in-out infinite;
            z-index: 1;
        }

        .glow {
            position: absolute;
            top: -20px;
            left: 50%;
            transform: translateX(-50%);
            width: 80px;
            height: 80px;
            background: radial-gradient(circle at center,
                rgba(255, 200, 0, 0.4) 0%,
                rgba(255, 160, 0, 0.2) 45%,
                rgba(255, 120, 0, 0) 100%);
            border-radius: 50%;
            animation: glowing 2s ease-in-out infinite;
            filter: blur(5px);
            z-index: 0;
        }

        .flame {
            width: 15px;
            height: 25px;
            background: #ff9800;
            border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
            margin: 0 auto;
            position: relative;
            animation: flicker 1s ease-in-out infinite;
            z-index: 2;
            box-shadow: 0 0 20px #ff9800,
                       0 0 40px #ff9800,
                       0 0 60px rgba(255, 152, 0, 0.3);
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
            z-index: 3;
            box-shadow: 0 0 10px #ffeb3b,
                       0 0 20px rgba(255, 235, 59, 0.3);
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
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
        }

        .wish-text {
            color: #fff;
            font-size: 12px;
            margin-top: 10px;
            text-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
            background-color: rgba(0, 0, 0, 0.5);
            padding: 5px;
            border-radius: 5px;
            max-width: 150px;
            word-wrap: break-word;
            z-index: 2;
        }

        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
        }

        @keyframes flicker {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(0.95); opacity: 0.9; }
        }

        @keyframes glowing {
            0%, 100% { transform: translateX(-50%) scale(1); opacity: 0.5; }
            50% { transform: translateX(-50%) scale(1.1); opacity: 0.3; }
        }
    `;

    document.head.appendChild(styles);
}