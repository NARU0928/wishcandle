// 상단의 상수 값 수정
const CANDLE_LIMIT = 25; // 제한 값 증가

function findSafePosition(container) {
    const isMobile = window.innerWidth <= 768;
    const padding = isMobile ? 30 : 40;  // 패딩 감소
    const candleWidth = isMobile ? 120 : 160;    // 영역 크기 감소
    const candleHeight = isMobile ? 160 : 180;   // 영역 크기 감소
    
    const safeAreaWidth = container.offsetWidth - candleWidth - padding * 2;
    const safeAreaHeight = container.offsetHeight - candleHeight - padding * 2;
    
    if (safeAreaWidth < 0 || safeAreaHeight < 0) {
        return getStackPosition(container, candleHeight, padding);
    }
    
    const maxTries = 200;
    let tries = 0;
    
    while (tries < maxTries) {
        const x = padding + Math.random() * safeAreaWidth;
        const y = padding + Math.random() * safeAreaHeight;
        
        if (isPositionSafe(x, y, candleWidth, candleHeight)) {
            return { x, y };
        }
        tries++;
    }
    
    return getStackPosition(container, candleHeight, padding);
}

function isPositionSafe(x, y, width, height) {
    return existingCandles.every(candle => {
        const horizontalDistance = Math.abs(x - candle.x);
        const verticalDistance = Math.abs(y - candle.y);
        const minHorizontalSpace = width * 1.2;    // 간격 감소
        const minVerticalSpace = height * 1.1;   // 간격 감소
        
        const diagonalDistance = Math.sqrt(
            Math.pow(horizontalDistance, 2) + 
            Math.pow(verticalDistance, 2)
        );
        
        return diagonalDistance > Math.max(minHorizontalSpace, minVerticalSpace);  // 승수 제거
    });
}
function createClearButton() {
    if (!document.getElementById('clearCandles')) {
        const button = document.createElement('button');
        button.id = 'clearCandles';
        button.className = 'clear-candles-btn';
        button.textContent = '촛불 끄기';
        button.onclick = clearCandles;
        document.querySelector('.container').appendChild(button);

        // 버튼 스타일 추가
        const style = document.createElement('style');
        style.textContent = `
            .clear-candles-btn {
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                padding: 10px 20px;
                background-color: rgba(255, 87, 87, 0.8);
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                transition: all 0.3s ease;
                z-index: 1000;
            }
            .clear-candles-btn:hover {
                background-color: rgba(255, 87, 87, 1);
            }
        `;
        document.head.appendChild(style);
    }
}

function clearCandles() {
    const container = document.getElementById('candlesContainer');
    container.innerHTML = '';
    existingCandles = [];
    document.getElementById('clearCandles')?.remove();
}

function createCandle(wish) {
    const candlesContainer = document.getElementById('candlesContainer');
    
    // 촛불 개수 제한 확인
    if (existingCandles.length >= CANDLE_LIMIT) {
        createClearButton();
    }

    const candle = document.createElement('div');
    candle.className = 'candle';
    
    // 촛불 HTML 구조 생성
    candle.innerHTML = `
        <div class="glow"></div>
        <div class="candle-body">
            <div class="flame">
                <div class="flame-inner"></div>
            </div>
            <div class="wick"></div>
            <div class="wax"></div>
        </div>
        <div class="wish-text">${wish}</div>
    `;

    // 위치 설정
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

    // 컨테이너 높이 조정 (모바일)
    if (window.innerWidth <= 768) {
        const maxY = Math.max(...existingCandles.map(c => c.y + c.height));
        candlesContainer.style.minHeight = `${maxY + 50}px`;
    }

    // CSS 애니메이션 스타일 추가
    const styles = document.createElement('style');
    styles.textContent = `
        .candle {
            position: absolute;
            width: 50px;
            text-align: center;
            animation: float 6s ease-in-out infinite;
            z-index: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
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

        .candle-body {
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;
        }

        .flame {
            width: 15px;
            height: 25px;
            background: #ff9800;
            border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
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
        }

        .wax {
            width: 20px;
            height: 40px;
            background: #fff;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
        }

        .wish-text {
            color: #fff;
            font-size: 12px;
            margin-top: 10px;
            text-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
            background-color: rgba(0, 0, 0, 0.5);
            padding: 5px 10px;
            border-radius: 5px;
            min-width: 100px;
            max-width: 150px;
            word-wrap: break-word;
            word-break: keep-all;
            text-align: center;
            z-index: 2;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        @media screen and (max-width: 768px) {
            .wish-text {
                min-width: 80px;
                max-width: 120px;
                font-size: 11px;
                white-space: normal;
                word-break: keep-all;
            }
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