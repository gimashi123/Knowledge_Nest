import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Code2, ChefHat, Hammer, PlusCircle } from 'lucide-react';
import { Challenge } from '@/types/challenge';
import { api } from '@/lib/api';

export default function ChallengeListPage() {
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'coding' | 'cooking' | 'diy'>('all');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchChallenges = async () => {
            try {
                let response;
                if (filter === 'all') {
                    response = await api.get('/api/challenges');
                } else {
                    response = await api.get(`/api/challenges/category/${filter}`);
                }
                setChallenges(response.data);
            } catch (error) {
                console.error('Error fetching challenges:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchChallenges();
    }, [filter]);

    const getCategoryIcon = (category: string) => {
        switch (category.toLowerCase()) {
            case 'coding':
                return <Code2 className="w-5 h-5" />;
            case 'cooking':
                return <ChefHat className="w-5 h-5" />;
            case 'diy':
                return <Hammer className="w-5 h-5" />;
            default:
                return null;
        }
    };

    if (loading) {
        return <div>Loading challenges...</div>;
    }

    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Challenges</h1>
                <Button onClick={() => navigate('/user-dashboard/add-challenges')}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Challenge
                </Button>
            </div>

            <div className="flex gap-4 mb-6">
                <Button
                    variant={filter === 'all' ? 'default' : 'outline'}
                    onClick={() => setFilter('all')}
                >
                    All Challenges
                </Button>
                <Button
                    variant={filter === 'coding' ? 'default' : 'outline'}
                    onClick={() => setFilter('coding')}
                >
                    <Code2 className="mr-2 h-4 w-4" />
                    Coding
                </Button>
                <Button
                    variant={filter === 'cooking' ? 'default' : 'outline'}
                    onClick={() => setFilter('cooking')}
                >
                    <ChefHat className="mr-2 h-4 w-4" />
                    Cooking
                </Button>
                <Button
                    variant={filter === 'diy' ? 'default' : 'outline'}
                    onClick={() => setFilter('diy')}
                >
                    <Hammer className="mr-2 h-4 w-4" />
                    DIY
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {challenges.map((challenge) => (
                    <Card key={challenge.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle>{challenge.title}</CardTitle>
                                <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                  {getCategoryIcon(challenge.skillCategory)}
                                    {challenge.skillCategory}
                </span>
                            </div>
                            <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Difficulty: {challenge.difficultyLevel}
                </span>
                                <span className="text-sm text-muted-foreground">
                  {challenge.timeLimit} min
                </span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-center">
                                <Button asChild variant="outline" onClick={() => navigate(`/${challenge.id}/attempt`)}>
                                    <Link to={`/challenge-attempt/${challenge.id}/attempt`}>Attempt</Link>
                                </Button>
                                <Button asChild variant="ghost">
                                    <Link to={`/challenges/${challenge.id}`}>Details</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}