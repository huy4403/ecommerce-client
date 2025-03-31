import { useEffect } from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
    useEffect(() => {
        const createParticle = () => {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            particle.style.left = Math.random() * 100 + 'vw';
            particle.style.animationDuration = Math.random() * 3 + 2 + 's';
            document.body.appendChild(particle);
            setTimeout(() => particle.remove(), 5000);
        };

        const intervalId = setInterval(createParticle, 200);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div style={{
            margin: 0,
            padding: 0,
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #1e3c72, #2a5298)',
            fontFamily: 'Arial, sans-serif',
            overflow: 'hidden'
        }}>
            <div style={{
                textAlign: 'center',
                color: 'white'
            }}>
                <div style={{
                    fontSize: '120px',
                    fontWeight: 'bold',
                    animation: 'blink 1.5s infinite',
                    textShadow: '0 0 10px rgba(255, 255, 255, 0.8)'
                }}>404</div>
                <div style={{
                    fontSize: '24px',
                    margin: '20px 0'
                }}>Oops! Trang bạn tìm không tồn tại.</div>
                <Link to="/" style={{
                    display: 'inline-block',
                    padding: '12px 25px',
                    backgroundColor: '#ff4444',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '25px',
                    fontSize: '18px',
                    transition: 'transform 0.3s, background-color 0.3s',
                    ':hover': {
                        transform: 'scale(1.1)',
                        backgroundColor: '#ff6666'
                    }
                }}>Quay lại trang chủ</Link>
            </div>

            <style>
                {`
                    @keyframes blink {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.5; }
                    }
                    .particle {
                        position: absolute;
                        width: 5px;
                        height: 5px;
                        background: rgba(255, 255, 255, 0.7);
                        border-radius: 50%;
                        animation: float 5s infinite ease-in-out;
                    }
                    @keyframes float {
                        0% { transform: translateY(0); opacity: 0.8; }
                        50% { opacity: 0.4; }
                        100% { transform: translateY(-100vh); opacity: 0; }
                    }
                `}
            </style>
        </div>
    );
}

export default NotFound;