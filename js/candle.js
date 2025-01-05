let existingCandles = [];

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

    // 새로운 위치 찾기
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

    // CSS 애니메이션을 위한 스타일 추가
    const styles = document.createElement('style');
    styles.textContent = `
        .candle {
            position: absolute;
            width: 50px;
            text-align: center;
            animation: float 6s ease-in-out infinite;
            z-index: 1;
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
            text-shadow: 0 0 5px rgba(0, 0, 0, 0.8);
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
            50% { transform: scale(0.9); }
        }
    `;

    document.head.appendChild(styles);
}

function findSafePosition(container) {
    const padding = 20;
    const candleWidth = 150;  // 촛불과 텍스트의 최대 너비
    const candleHeight = 120; // 촛불과 텍스트의 최대 높이
    
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
    
    // 안전한 위치를 찾지 못한 경우 격자 방식으로 배치
    const gridX = (existingCandles.length % 5) * (candleWidth + padding);
    const gridY = Math.floor(existingCandles.length / 5) * (candleHeight + padding);
    
    return { x: gridX + padding, y: gridY + padding };
}

function isPositionSafe(x, y, width, height) {
    return existingCandles.every(candle => {
        const horizontalDistance = Math.abs(x - candle.x);
        const verticalDistance = Math.abs(y - candle.y);
        return horizontalDistance > width || verticalDistance > height;
    });
}