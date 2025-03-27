import React, { useState, useEffect } from 'react';
import { FiArrowUp } from 'react-icons/fi';

function ScrollTop() {
    const [isVisible, setIsVisible] = useState(false);

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
            behavior: "smooth"
        });
    };

    useEffect(() => {
        window.addEventListener("scroll", toggleVisibility);
        return () => {
            window.removeEventListener("scroll", toggleVisibility);
        };
    }, []);

    return (
        <>
            {isVisible &&
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-4 right-4 p-3 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 transition-all duration-300 z-50"
                    aria-label="Scroll to top"
                >
                    <FiArrowUp className="w-6 h-6" />
                </button>
            }
        </>
    );
};

export default ScrollTop;
