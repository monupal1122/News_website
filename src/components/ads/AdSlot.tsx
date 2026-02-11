import React, { useEffect } from 'react';

interface AdSlotProps {
    slot: string;
    format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical';
    style?: React.CSSProperties;
}

export const AdSlot: React.FC<AdSlotProps> = ({ slot, format = 'auto', style }) => {
    useEffect(() => {
        try {
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            console.error('AdSense error:', e);
        }
    }, []);

    return (
        <div className="ad-container my-8 flex justify-center overflow-hidden">
            <ins
                className="adsbygoogle"
                style={style || { display: 'block' }}
                data-ad-client={import.meta.env.VITE_ADSENSE_CLIENT_ID || "ca-pub-YOUR_CLIENT_ID"}
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive="true"
            />
        </div>
    );
};
