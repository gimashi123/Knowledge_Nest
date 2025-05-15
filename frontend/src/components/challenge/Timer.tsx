import { useEffect, useState } from 'react';

interface TimerProps {
    initialMinutes: number;
    onComplete: () => void;
}

export function Timer({ initialMinutes, onComplete }: TimerProps) {
    const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);

    useEffect(() => {
        if (timeLeft <= 0) {
            onComplete();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, onComplete]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <div className="text-xl font-bold">
            {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </div>
    );
}