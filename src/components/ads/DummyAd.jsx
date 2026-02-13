import React, { useState, useEffect } from 'react';
import ads from '@/ads.json';

export const DummyAd = ({
    className = '',
    label = 'Sponsored Content',
    sublabel = 'Premium Advertisement Space',
    variant = 'leaderboard'
}) => {
    const [currentAdIndex, setCurrentAdIndex] = useState(0);

    useEffect(() => {
        // Random start index to avoid all ads syncing
        setCurrentAdIndex(Math.floor(Math.random() * ads.length));

        const adInterval = setInterval(() => {
            setCurrentAdIndex((prev) => (prev + 1) % ads.length);
        }, 5000);
        return () => clearInterval(adInterval);
    }, []);

    const dimensions = {
        leaderboard: 'min-h-[90px] w-full max-w-[728px]',
        rectangle: 'min-h-[250px] w-full max-w-[300px]',
        sidebar: 'min-h-[600px] w-full max-w-[300px]'
    };

    return (
        <div className={`group/ad relative bg-zinc-50 border border-zinc-100 flex flex-col items-center justify-center overflow-hidden shadow-inner transition-colors hover:border-red-600/20 ${dimensions[variant]} ${className}`}>
            <div className="absolute top-0 right-0 px-2 py-0.5 bg-zinc-200 text-[8px] font-black uppercase tracking-widest text-zinc-400 z-20">
                ADVERTISEMENT
            </div>

            <img
                src={ads[currentAdIndex].image}
                alt={ads[currentAdIndex].alt || label}
                className="w-full h-full object-cover absolute inset-0 z-10"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover/ad:animate-[shimmer_2s_infinite] z-30" />
        </div>
    );
};
