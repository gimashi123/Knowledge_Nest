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
        return <div className="flex justify-center items-center h-screen">Loading challenge...</div>;
    }

    if (!challenge) {
        return <div className="flex justify-center items-center h-screen">Challenge not found</div>;
    }

    return (
        <div className="container mx-auto py-8 max-w-4xl">
            {/* Challenge Header Section */}
            <div className="bg-white shadow-sm rounded-lg p-6 mb-6 border border-gray-200">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">{challenge.title}</h1>
                        <p className="text-gray-600 mb-4">Test your skills with this timed challenge</p>
                    </div>
                    {startTime && (
                        <div className="bg-red-50 px-4 py-2 rounded-lg border border-red-200">
                            <Timer
                                initialMinutes={challenge.timeLimit}
                                onComplete={submitAttempt}
                            />
                        </div>
                    )}
                </div>

                {/* Instructions Section */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-4">
                    <h2 className="font-semibold text-blue-800 mb-2">Instructions:</h2>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                        <li>You have {challenge.timeLimit} minutes to complete all tasks.</li>
                        <li>Answer all questions to the best of your ability.</li>
                        <li>Write clear and concise responses for each task.</li>
                        <li>The timer will automatically submit your answers when time expires.</li>
                        <li>You can submit early using the button at the bottom.</li>
                    </ul>
                </div>
            </div>

            {/* Tasks Section */}
            <div className="space-y-6">
                {challenge.tasks.map((task, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                        <CardHeader className="bg-gray-50 border-b">
                            <CardTitle className="flex items-center">
                                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                                    {index + 1}
                                </span>
                                <span className="text-lg">Task {index + 1}</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <p className="mb-4 text-gray-700">{task}</p>
                            <textarea
                                className="w-full min-h-[120px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                placeholder="Type your answer here..."
                                value={answers[index]}
                                onChange={(e) => handleAnswerChange(index, e.target.value)}
                            />
                            <div className="text-xs text-gray-500 mt-1">
                                Character count: {answers[index].length}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Submit Button Section */}
            <div className="mt-8 flex justify-end">
                <Button
                    onClick={submitAttempt}
                    className="px-8 py-4 text-lg bg-green-600 hover:bg-green-700 transition-colors shadow-md"
                >
                    Submit Challenge
                </Button>
            </div>
        </div>
    );
}