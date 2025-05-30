import React, { useState, useEffect } from 'react';
import MobileHomePage from './Homepage/MobileHomePage.jsx';
import DesktopHomePage from './Homepage/DesktopHomePage';

export default function HomePage() {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return isMobile ? <MobileHomePage /> : <DesktopHomePage />;
}
