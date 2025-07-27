import { useEffect, useRef, useState } from "react";
import config from "../config";

const ParticlesBackground = () => {
    const canvasRef = useRef(null);
    const animationFrameId = useRef(null);
    const particles = useRef([]);
    const mouse = useRef({ x: null, y: null, radius: 150 });

    const [themeMode, setThemeMode] = useState(() =>
        document.documentElement.classList.contains("dark") ? "dark" : "light"
    );

    const getParticleConfig = (mode) => ({
        particleCount: 60,
        maxVelocity: 0.5,
        connectionDistance: 120,
        particleRadius: 3,
        lineColor:
            mode === "dark"
                ? config.theme.lineColorDark
                : config.theme.lineColor,
        particleColor:
            mode === "dark"
                ? config.theme.particleColorDark
                : config.theme.particleColor,
        strokeStyle:
            mode === "dark"
                ? config.theme.strokeStyleDark
                : config.theme.strokeStyle,
        shadowColor:
            mode === "dark"
                ? config.theme.shadowColorDark
                : config.theme.shadowColor,
        backgroundColor:
            mode === "dark"
                ? config.theme.sectionDark
                : config.theme.sectionLight,
    });

    const [particleConfig, setParticleConfig] = useState(
        getParticleConfig(themeMode)
    );

    const particleConfigRef = useRef(particleConfig);

    useEffect(() => {
        const observer = new MutationObserver(() => {
            const isDark = document.documentElement.classList.contains("dark");
            const mode = isDark ? "dark" : "light";
            if (mode !== themeMode) {
                setThemeMode(mode);
                const newConfig = getParticleConfig(mode);
                setParticleConfig(newConfig);
                particleConfigRef.current = newConfig;
            }
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => observer.disconnect();
    }, [themeMode]);

    // Initialize particles
    const initParticles = (width, height) => {
        particles.current = [];
        for (let i = 0; i < particleConfigRef.current.particleCount; i++) {
            particles.current.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * particleConfigRef.current.maxVelocity,
                vy: (Math.random() - 0.5) * particleConfigRef.current.maxVelocity,
                radius: particleConfig.particleRadius,
            });
        }
    };

    const draw = (ctx, width, height) => {
        ctx.clearRect(0, 0, width, height);

        // Draw lines between close particles
        for (let i = 0; i < particles.current.length; i++) {
            for (let j = i + 1; j < particles.current.length; j++) {
                const dx = particles.current[i].x - particles.current[j].x;
                const dy = particles.current[i].y - particles.current[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < particleConfigRef.current.connectionDistance) {
                    // Line opacity based on distance
                    const alpha = 1 - dist / particleConfigRef.current.connectionDistance;
                    ctx.strokeStyle =
                        particleConfigRef.current.strokeStyle +
                        (alpha * 0.5).toString() +
                        ")";
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles.current[i].x, particles.current[i].y);
                    ctx.lineTo(particles.current[j].x, particles.current[j].y);
                    ctx.stroke();
                }
            }
        }

        // Draw particles and update positions
        particles.current.forEach((p) => {
            // Draw circle
            ctx.beginPath();
            ctx.fillStyle = particleConfigRef.current.particleColor;
            ctx.shadowColor = particleConfigRef.current.shadowColor;
            ctx.shadowBlur = 5;
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();

            // Move particle
            p.x += p.vx;
            p.y += p.vy;

            // Bounce off edges
            if (p.x <= p.radius || p.x >= width - p.radius) p.vx = -p.vx;
            if (p.y <= p.radius || p.y >= height - p.radius) p.vy = -p.vy;

            // Interaction with mouse
            if (mouse.current.x && mouse.current.y) {
                const dx = p.x - mouse.current.x;
                const dy = p.y - mouse.current.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < mouse.current.radius) {
                    // Repel particle away from mouse
                    const angle = Math.atan2(dy, dx);
                    const force =
                        (mouse.current.radius - dist) / mouse.current.radius;
                    p.vx += Math.cos(angle) * force * 0.3;
                    p.vy += Math.sin(angle) * force * 0.3;

                    // Limit max velocity
                    p.vx = Math.min(
                        Math.max(p.vx, -particleConfigRef.current.maxVelocity * 2),
                        particleConfigRef.current.maxVelocity * 2
                    );
                    p.vy = Math.min(
                        Math.max(p.vy, -particleConfigRef.current.maxVelocity * 2),
                        particleConfigRef.current.maxVelocity * 2
                    );
                }
            }
        });
    };

    const animate = (ctx, width, height) => {
        draw(ctx, width, height);
        animationFrameId.current = requestAnimationFrame(() =>
            animate(ctx, width, height)
        );
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles(canvas.width, canvas.height);
        };

        resizeCanvas();

        window.addEventListener("resize", resizeCanvas);

        const mouseMoveHandler = (e) => {
            mouse.current.x = e.clientX;
            mouse.current.y = e.clientY;
        };

        const mouseLeaveHandler = () => {
            mouse.current.x = null;
            mouse.current.y = null;
        };

        window.addEventListener("mousemove", mouseMoveHandler);
        window.addEventListener("mouseleave", mouseLeaveHandler);

        animate(ctx, canvas.width, canvas.height);

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            window.removeEventListener("mousemove", mouseMoveHandler);
            window.removeEventListener("mouseleave", mouseLeaveHandler);
            cancelAnimationFrame(animationFrameId.current);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                zIndex: -1,
                backgroundColor: particleConfig.backgroundColor,
            }}
        />
    );
};

export default ParticlesBackground;
