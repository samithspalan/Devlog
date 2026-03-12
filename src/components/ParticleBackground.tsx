"use client";

import React, { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

class Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
    canvas: HTMLCanvasElement;
    isDarkMode: boolean;

    constructor(canvas: HTMLCanvasElement, isDarkMode: boolean) {
        this.canvas = canvas;
        this.isDarkMode = isDarkMode;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 1;
        this.vy = (Math.random() - 0.5) * 1;
        this.size = Math.random() * 3 + 1;
        this.opacity = Math.random() * 0.6 + 0.4;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = this.canvas.width;
        if (this.x > this.canvas.width) this.x = 0;
        if (this.y < 0) this.y = this.canvas.height;
        if (this.y > this.canvas.height) this.y = 0;
    }

    draw(ctx: CanvasRenderingContext2D, isDarkMode: boolean) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        // Glow effect
        ctx.fillStyle = isDarkMode ? '#FFFFFF' : '#000000'; // White particles
        ctx.shadowColor = isDarkMode ? '#FFFFFF' : '#000000';
        ctx.shadowBlur = 15;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

const ParticleBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { resolvedTheme } = useTheme();
    // Provide a safe fallback for SSR
    const isDarkMode = resolvedTheme === 'dark' || (typeof window !== 'undefined' && document.documentElement.classList.contains('dark'));
    const animationRef = useRef<number | null>(null);
    const particlesRef = useRef<Particle[]>([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const createParticles = () => {
            particlesRef.current = [];
            const particleCount = Math.min(100, Math.floor((canvas.width * canvas.height) / 15000));

            for (let i = 0; i < particleCount; i++) {
                particlesRef.current.push(new Particle(canvas, isDarkMode));
            }
        };

        const animate = () => {
            // Create a slight trailing effect instead of full clear
            ctx.fillStyle = isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            particlesRef.current.forEach(particle => {
                particle.update();
                particle.draw(ctx, isDarkMode);
            });

            // Draw lines between close particles
            ctx.strokeStyle = isDarkMode ? 'rgba(99, 102, 241, 0.15)' : 'rgba(79, 70, 229, 0.15)';
            ctx.lineWidth = 1;

            for (let i = 0; i < particlesRef.current.length; i++) {
                for (let j = i + 1; j < particlesRef.current.length; j++) {
                    const dx = particlesRef.current[i].x - particlesRef.current[j].x;
                    const dy = particlesRef.current[i].y - particlesRef.current[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    // If particles are close enough, connect them
                    if (distance < 140) {
                        ctx.globalAlpha = (140 - distance) / 140 * 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particlesRef.current[i].x, particlesRef.current[i].y);
                        ctx.lineTo(particlesRef.current[j].x, particlesRef.current[j].y);
                        ctx.stroke();
                    }
                }
            }

            ctx.globalAlpha = 1;
            animationRef.current = requestAnimationFrame(animate);
        };

        createParticles();
        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isDarkMode]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-full pointer-events-none opacity-40"
            style={{ zIndex: 0 }}
        />
    );
};

export default ParticleBackground;
