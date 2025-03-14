import React, { useRef, useEffect } from'react';

const CanvasDots = () => {
    const canvasRef = useRef<HTMLCanvasElement|null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio;

        // 根据设备像素比设置canvas的物理尺寸
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        ctx.scale(dpr, dpr);

        // 波点的半径
        const dotRadius = 1;
        // 水平和垂直方向上波点的间距
        const dotSpacingX = 15;
        const dotSpacingY = 15;

        // 绘制波点的函数
        const drawDots = () => {
            for (let x = 0; x < canvas.width; x += dotSpacingX) {
                for (let y = 0; y < canvas.height; y += dotSpacingY) {
                    ctx.beginPath();
                    ctx.arc(x, y, dotRadius, 0, 2 * Math.PI);
                    ctx.fillStyle = '#999';
                    ctx.fill();
                }
            }
        };

        drawDots();

        // 窗口大小改变时重新绘制波点
        const handleResize = () => {
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.scale(dpr, dpr);
            drawDots();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    return (
        <canvas ref={canvasRef} className='h-screen w-screen fixed top-0 left-0 -z-10 bg-black' />
    );
};

export default CanvasDots;