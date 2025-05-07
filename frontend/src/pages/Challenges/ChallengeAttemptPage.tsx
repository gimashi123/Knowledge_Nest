import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Timer } from '@/components/challenge/Timer';
import { Challenge } from '@/types/challenge';
import { api } from '@/lib/api';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function ChallengeAttemptPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [challenge, setChallenge] = useState<Challenge | null>(null);
    const [answers, setAnswers] = useState<string[]>(['', '', '', '', '']);
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [loading, setLoading] = useState(true);
    const [expandedTask, setExpandedTask] = useState<number | null>(null);

    useEffect(() => {
        const fetchChallenge = async () => {
            try {
                const response = await api.get(`/api/challenges/${id}`);
                const fetchedChallenge = response.data;

                // Ensure tasks is always an array to avoid runtime .map() error
                if (!Array.isArray(fetchedChallenge.tasks)) {
                    fetchedChallenge.tasks = [];
                }

                setChallenge(fetchedChallenge);
                setStartTime(new Date());
                setExpandedTask(0); // Auto-expand first task
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

    const toggleTask = (index: number) => {
        setExpandedTask(expandedTask === index ? null : index);
    };

    const submitAttempt = async () => {
        if (!challenge || !startTime) return;

        try {
            await api.post('/api/challenge-attempts/submit', {
                challengeId: challenge.id,
                userId: 'current-user-id',
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
        <div className="container mx-auto py-8 max-w-6xl">
            <div className="flex flex-col md:flex-row gap-6">
                {/* Main Content (Left Side) */}
                <div className="md:w-2/3">
                    {/* Challenge Header */}
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
                    </div>

                    {/* Tasks Section */}
                    <div className="space-y-4">
                        {Array.isArray(challenge.tasks) &&
                            challenge.tasks.map((task, index) => (
                                <Card key={index} className="hover:shadow-md transition-shadow overflow-hidden">
                                    <button
                                        type="button"
                                        className="w-full text-left"
                                        onClick={() => toggleTask(index)}
                                    >
                                        <CardHeader className="bg-gray-50 border-b">
                                            <CardTitle className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                                                        {index + 1}
                                                    </span>
                                                    <span className="text-lg">Task {index + 1}</span>
                                                </div>
                                                {expandedTask === index ? (
                                                    <ChevronUp className="h-5 w-5 text-gray-500" />
                                                ) : (
                                                    <ChevronDown className="h-5 w-5 text-gray-500" />
                                                )}
                                            </CardTitle>
                                        </CardHeader>
                                    </button>

                                    {expandedTask === index && (
                                        <CardContent className="p-6 animate-in fade-in">
                                            <p className="mb-4 text-gray-700">{task}</p>
                                            <textarea
                                                className="w-full min-h-[120px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                placeholder="Type your answer here..."
                                                value={answers[index]}
                                                onChange={(e) => handleAnswerChange(index, e.target.value)}
                                            />
                                            <div className="flex justify-between items-center mt-2">
                                                <div className="text-xs text-gray-500">
                                                    Character count: {answers[index].length}
                                                </div>
                                                <button
                                                    type="button"
                                                    className="text-sm text-blue-600 hover:text-blue-800"
                                                    onClick={() => toggleTask(index)}
                                                >
                                                    Collapse task
                                                </button>
                                            </div>
                                        </CardContent>
                                    )}
                                </Card>
                            ))}
                    </div>

                    {/* Submit Button */}
                    <div className="mt-8 flex justify-end">
                        <Button
                            onClick={submitAttempt}
                            className="px-8 py-4 text-lg bg-green-600 hover:bg-green-700 transition-colors shadow-md"
                        >
                            Submit Challenge
                        </Button>
                    </div>
                </div>

                {/* Instructions Sidebar */}
                <div className="md:w-1/3">
                    <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200 sticky top-6">
                        <h2 className="font-semibold text-blue-800 mb-4 text-xl">Instructions</h2>
                        <ul className="space-y-3">
                            <li className="flex items-start">
                                <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">1</span>
                                <span className="text-gray-700">Click on each task header to expand/collapse it</span>
                            </li>
                            <li className="flex items-start">
                                <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">2</span>
                                <span className="text-gray-700">You have {challenge.timeLimit} minutes to complete all tasks</span>
                            </li>
                            <li className="flex items-start">
                                <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">3</span>
                                <span className="text-gray-700">Answer all questions to the best of your ability</span>
                            </li>
                            <li className="flex items-start">
                                <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">4</span>
                                <span className="text-gray-700">Timer will auto-submit when time expires</span>
                            </li>
                            <li className="flex items-start">
                                <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">5</span>
                                <span className="text-gray-700">You can submit early using the button</span>
                            </li>
                        </ul>

                        <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h3 className="font-semibold text-gray-800 mb-2">Tips</h3>
                            <p className="text-sm text-gray-600">
                                Focus on one task at a time. Collapse completed tasks to reduce clutter and focus on remaining ones.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
