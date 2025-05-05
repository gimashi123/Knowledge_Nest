import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Timer } from '@/components/challenge/Timer';
import { Challenge } from '@/types/challenge';
import { api } from '@/lib/api';

export default function ChallengeAttemptPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [challenge, setChallenge] = useState<Challenge | null>(null);
    const [answers, setAnswers] = useState<string[]>(['', '', '', '', '']);
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChallenge = async () => {
            try {
                const response = await api.get(`/api/challenges/${id}`);
                setChallenge(response.data);
                setStartTime(new Date());
            } catch (error) {
                console.error('Error fetching challenge:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchChallenge();
    }, [id]);

    const handleAnswerChange = (index: number, value: string) => {
        const newAnswers = [...answers];
        newAnswers[index] = value;
        setAnswers(newAnswers);
    };

    const submitAttempt = async () => {
        if (!challenge || !startTime) return;

        try {
            await api.post('/api/challenge-attempts/submit', {
                challengeId: challenge.id,
                userId: 'current-user-id', // Replace with actual user ID from auth context
                answers,
                startedAt: startTime.toISOString(),
            });
            navigate(`/challenges/${challenge.id}/results`);
        } catch (error) {
            console.error('Error submitting attempt:', error);
        }
    };

    if (loading) {
        return <div>Loading challenge...</div>;
    }

    if (!challenge) {
        return <div>Challenge not found</div>;
    }

    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">{challenge.title}</h1>
                {startTime && (
                    <Timer
                        initialMinutes={challenge.timeLimit}
                        onComplete={submitAttempt}
                    />
                )}
            </div>

            <div className="grid grid-cols-1 gap-6">
                {challenge.tasks.map((task, index) => (
                    <Card key={index}>
                        <CardHeader>
                            <CardTitle>Task {index + 1}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-4">{task}</p>
                            <textarea
                                className="w-full min-h-[100px] p-2 border rounded"
                                placeholder="Enter your answer..."
                                value={answers[index]}
                                onChange={(e) => handleAnswerChange(index, e.target.value)}
                            />
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="mt-6 flex justify-end">
                <Button onClick={submitAttempt} className="px-8 py-4">
                    Submit Challenge
                </Button>
            </div>
        </div>
    );
}