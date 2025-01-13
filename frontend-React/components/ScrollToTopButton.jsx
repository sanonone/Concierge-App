import React, { useState, useEffect } from 'react';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Mostra il pulsante quando l'utente scrolla oltre un certo punto
    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <div className="fixed bottom-4 right-4">
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className="bg-[rgba(59,130,246,0.9)] text-white text-xl p-1 rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
                >
                    <ExpandLessIcon className=' text-5xl'></ExpandLessIcon>
                </button>
            )}
        </div>
    );
};

export default ScrollToTopButton;
