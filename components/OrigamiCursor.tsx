'use client';

import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function OrigamiCursor() {
    const [isMobile, setIsMobile] = useState(false);
    
    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);
    
    const springConfig = { damping: 40, stiffness: 40, mass: 2 };
    const cursorX = useSpring(mouseX, springConfig);
    const cursorY = useSpring(mouseY, springConfig);

    const targetScaleX = useMotionValue(1);
    const scaleX = useSpring(targetScaleX, { damping: 20, stiffness: 150 });
    
    const angle = useMotionValue(0);

    const { scrollYProgress, scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const mobileAngle = useMotionValue(0);
    const mobileY = useTransform(scrollYProgress, [0, 1], ['10vh', '85vh']);
    const mobileX = useTransform(scrollYProgress, (v) => Math.sin(v * Math.PI * 8) * 15 - 15);
    
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        let moveCursor: (e: MouseEvent) => void;
        if (!isMobile) {
            moveCursor = (e: MouseEvent) => {
                mouseX.set(e.clientX);
                mouseY.set(e.clientY);
            };
            window.addEventListener('mousemove', moveCursor);
        }
        
        return () => {
            if (moveCursor) window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('resize', checkMobile);
        };
    }, [isMobile, mouseX, mouseY]);

    useAnimationFrame(() => {
        if (isMobile) {
            const sv = scrollVelocity.get();
            if (Math.abs(sv) > 20) {
                const targetPitch = sv > 0 ? -114 : 66;
                mobileAngle.set(mobileAngle.get() + (targetPitch - mobileAngle.get()) * 0.1);
            } else {
                mobileAngle.set(mobileAngle.get() + (24 - mobileAngle.get()) * 0.05);
            }
            return;
        }
        
        const dx = mouseX.get() - cursorX.get();
        const dy = mouseY.get() - cursorY.get();
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 5) {
            if (dx > 2) targetScaleX.set(1);
            else if (dx < -2) targetScaleX.set(-1);

            const pitchRad = Math.atan2(dy, Math.abs(dx));
            const pitchDeg = pitchRad * (180 / Math.PI);
            
            const targetPitch = pitchDeg + 24;
            
            angle.set(angle.get() + (targetPitch - angle.get()) * 0.15);
        } else {
            angle.set(angle.get() + (0 - angle.get()) * 0.05);
        }
    });

    const CraneIcon = () => (
        <div style={{ width: 48, height: 48, filter: 'drop-shadow(0px 8px 12px rgba(0,0,0,0.15))' }}>
            <svg 
                viewBox="0 0 100 100" 
                xmlns="http://www.w3.org/2000/svg"
                style={{ overflow: 'visible', width: '100%', height: '100%' }}
            >
                <motion.g
                    animate={{ y: [0, -8, 0], rotate: [0, 3, 0] }}
                    transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity }}
                    style={{ originX: "50px", originY: "50px" }}
                >
                    <motion.g
                        animate={{ rotate: [12, -18, 12] }}
                        transition={{ duration: 1.2, ease: 'easeInOut', repeat: Infinity }}
                        style={{ originX: "50px", originY: "50px" }}
                    >
                        <polygon points="45,50 55,50 30,5" fill="#E2E2E2" stroke="#D0D0D0" strokeWidth="0.5" strokeLinejoin="round" />
                    </motion.g>
                    <polygon points="35,55 45,50 55,75" fill="#EEEEEE" stroke="#D0D0D0" strokeWidth="0.5" strokeLinejoin="round" />
                    <polygon points="35,55 45,50 10,30" fill="#FAFAFA" stroke="#D0D0D0" strokeWidth="0.5" strokeLinejoin="round" />
                    <polygon points="55,50 75,55 55,75" fill="#E8E8E8" stroke="#D0D0D0" strokeWidth="0.5" strokeLinejoin="round" />
                    <polygon points="45,50 55,50 55,75" fill="#FFFFFF" stroke="#D0D0D0" strokeWidth="0.5" strokeLinejoin="round" />
                    <polygon points="55,50 65,40 85,20" fill="#FFFFFF" stroke="#D0D0D0" strokeWidth="0.5" strokeLinejoin="round" />
                    <polygon points="65,40 75,55 85,20" fill="#E0E0E0" stroke="#D0D0D0" strokeWidth="0.5" strokeLinejoin="round" />
                    <polygon points="85,20 80,26 95,30" fill="#EAEAEA" stroke="#D0D0D0" strokeWidth="0.5" strokeLinejoin="round" />
                    <motion.g
                        animate={{ rotate: [-15, 18, -15] }}
                        transition={{ duration: 1.2, ease: 'easeInOut', repeat: Infinity }}
                        style={{ originX: "50px", originY: "50px" }}
                    >
                        <polygon points="45,50 55,50 15,80" fill="#F9F9F9" stroke="#D0D0D0" strokeWidth="0.5" strokeLinejoin="round" />
                    </motion.g>
                </motion.g>
            </svg>
        </div>
    );

    if (isMobile) {
        return (
            <motion.div
                className="fixed top-0 right-4 z-[9999] pointer-events-none origin-center"
                style={{ y: mobileY, x: mobileX }}
            >
                <motion.div
                    style={{
                        rotate: mobileAngle,
                        scaleX: -1,
                        x: -24,
                        y: -24,
                    }}
                >
                    <CraneIcon />
                </motion.div>
            </motion.div>
        );
    }

    return (
        <motion.div
            className="fixed top-0 left-0 z-[9999] pointer-events-none origin-center"
            style={{ x: cursorX, y: cursorY }}
        >
            <motion.div
                style={{
                    scaleX: scaleX,
                    rotate: angle,
                    x: -24,
                    y: -24,
                }}
            >
                <CraneIcon />
            </motion.div>
        </motion.div>
    );
}