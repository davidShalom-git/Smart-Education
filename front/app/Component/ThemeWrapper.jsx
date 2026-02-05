'use client';

import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Leaf, Sprout, Flower } from 'lucide-react';

export default function ThemeWrapper({ children }) {
    const pathname = usePathname();

    // Define routes that should NOT have the global leafy background
    const excludedRoutes = ['/', '/login', '/signup', '/login/teacher', '/signup/student', '/signup/teacher'];
    const isExcluded = excludedRoutes.includes(pathname) || pathname.startsWith('/login') || pathname.startsWith('/signup');

    if (isExcluded) {
        return <>{children}</>;
    }

    // 🌿 The "Leafy" Design for Internal Pages
    return (
        <div className="min-h-screen relative bg-[#1a1a1a] text-white overflow-x-hidden">
            {/* Content */}
            <div className="relative z-10 pb-32">
                {children}
            </div>

            {/* Background Decor - Leafy Footer */}
            <div className="fixed bottom-0 left-0 right-0 h-24 md:h-32 pointer-events-none z-0 overflow-hidden flex items-end justify-between px-2 opacity-80">
                {/* We programmatically generate a 'forest' line using icons to mimic the user's design */}
                {Array.from({ length: 20 }).map((_, i) => {
                    // Randomize Icon
                    const Icon = i % 3 === 0 ? Leaf : (i % 3 === 1 ? Sprout : Flower);
                    // Randomize Color (Orange, White, Red/Pink as per image)
                    const colors = ['text-orange-400', 'text-slate-200', 'text-rose-500', 'text-amber-500'];
                    const color = colors[i % colors.length];
                    // Randomize Size and Rotation
                    const size = 40 + (i % 5) * 10; // 40px to 90px
                    const rotation = -20 + (i % 5) * 10;

                    return (
                        <motion.div
                            key={i}
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: i * 0.05, duration: 0.8 }}
                            className={`${color} transform translate-y-4`}
                            style={{
                                marginLeft: i === 0 ? 0 : '-20px',
                                zIndex: i
                            }}
                        >
                            <Icon
                                size={size}
                                strokeWidth={1.5}
                                style={{ transform: `rotate(${rotation}deg)` }}
                            />
                        </motion.div>
                    );
                })}
            </div>

            {/* Subtle Texture Overlay */}
            <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
        </div>
    );
}
