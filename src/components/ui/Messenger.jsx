import { useState, useEffect } from "react";
import { FaFacebookMessenger } from "react-icons/fa";

function Messenger() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const handleScroll = () => {
        if (window.pageYOffset > 300) {
            setIsScrolled(true);
        } else {
            setIsScrolled(false);
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsAnimating(true);
            setTimeout(() => setIsAnimating(false), 1000);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <button className={`fixed ${isScrolled ? 'bottom-20' : 'bottom-4'} right-4 p-3 rounded-full bg-blue-500 text-white shadow-lg
        hover:bg-blue-600 transition-all duration-300 z-50 ${isAnimating ? 'animate-bounce' : ''}`}>
            <a href="https://www.facebook.com/messages/t/huy4403" target="_blank" rel="noopener noreferrer"><FaFacebookMessenger size={24} /></a>
        </button>
    );
}

export default Messenger;
