"use client"

// Pure CSS snowfall animation component
// Inspired by https://codepen.io/NickyCDK/pen/bGRoXN
const Snowfall = () => {
    return (
        <>
            <style jsx>{`
                @keyframes snowflakes-fall {
                    0% {
                        top: -10%;
                    }
                    100% {
                        top: 100%;
                    }
                }
                @keyframes snowflakes-shake {
                    0% {
                        transform: translateX(0px);
                    }
                    50% {
                        transform: translateX(80px);
                    }
                    100% {
                        transform: translateX(0px);
                    }
                }
                .snowflake {
                    position: fixed;
                    top: -10%;
                    z-index: 9999;
                    color: #fff;
                    font-size: 1.5rem;
                    text-shadow: 0 0 5px rgba(0, 0, 0, 0.3), 0 0 10px rgba(0, 0, 0, 0.2);
                    animation-name: snowflakes-fall, snowflakes-shake;
                    animation-timing-function: linear, ease-in-out;
                    animation-iteration-count: infinite, infinite;
                    animation-play-state: running, running;
                    pointer-events: none;
                }
                .snowflake:nth-of-type(1) {
                    left: 1%;
                    animation-delay: 0s, 0s;
                    animation-duration: 10s, 3s;
                }
                .snowflake:nth-of-type(2) {
                    left: 10%;
                    animation-delay: 1s, 1s;
                    animation-duration: 12s, 4s;
                }
                .snowflake:nth-of-type(3) {
                    left: 20%;
                    animation-delay: 6s, 0.5s;
                    animation-duration: 9s, 3.5s;
                }
                .snowflake:nth-of-type(4) {
                    left: 30%;
                    animation-delay: 4s, 2s;
                    animation-duration: 11s, 4.5s;
                }
                .snowflake:nth-of-type(5) {
                    left: 40%;
                    animation-delay: 2s, 2s;
                    animation-duration: 8s, 3s;
                }
                .snowflake:nth-of-type(6) {
                    left: 50%;
                    animation-delay: 8s, 3s;
                    animation-duration: 13s, 5s;
                }
                .snowflake:nth-of-type(7) {
                    left: 60%;
                    animation-delay: 6s, 2s;
                    animation-duration: 9s, 3s;
                }
                .snowflake:nth-of-type(8) {
                    left: 70%;
                    animation-delay: 2.5s, 1s;
                    animation-duration: 10s, 4s;
                }
                .snowflake:nth-of-type(9) {
                    left: 80%;
                    animation-delay: 1s, 0s;
                    animation-duration: 14s, 5s;
                }
                .snowflake:nth-of-type(10) {
                    left: 90%;
                    animation-delay: 3s, 1.5s;
                    animation-duration: 8s, 2.5s;
                }
            `}</style>
            <div className="snowflakes" aria-hidden="true">
                {[...Array(10)].map((_, i) => (
                    <div key={i} className="snowflake">❄</div>
                ))}
            </div>
        </>
    );
};

export default Snowfall;
