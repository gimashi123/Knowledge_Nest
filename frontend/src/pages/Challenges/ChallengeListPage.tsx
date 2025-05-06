import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Code2, ChefHat, Hammer, PlusCircle, Trash2, Pencil } from 'lucide-react';
import { Challenge } from '@/types/challenge';
import { api } from '@/lib/api';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

// Define type aliases for better type safety
type SkillCategory = 'coding' | 'cooking' | 'diy';
type DifficultyLevel = 'beginner' | 'intermediate' | 'pro';

export default function ChallengeListPage() {
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | SkillCategory>('all');
    const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
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

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`/api/challenges/${id}`);
            setChallenges(challenges.filter(challenge => challenge.id !== id));
        } catch (error) {
            console.error('Error deleting challenge:', error);
        }
    };

    const handleUpdateClick = (challenge: Challenge) => {
        setEditingChallenge(challenge);
        setIsDialogOpen(true);
    };

    const handleUpdateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingChallenge) return;

        try {
            const response = await api.put(`/api/challenges/${editingChallenge.id}`, editingChallenge);
            setChallenges(challenges.map(challenge =>
                challenge.id === editingChallenge.id ? response.data.data : challenge
            ));
            setIsDialogOpen(false);
        } catch (error) {
            console.error('Error updating challenge:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!editingChallenge) return;
        setEditingChallenge({
            ...editingChallenge,
            [e.target.name]: e.target.value
        });
    };

    const handleCategoryChange = (value: SkillCategory) => {
        if (!editingChallenge) return;
        setEditingChallenge({
            ...editingChallenge,
            skillCategory: value
        });
    };

    const handleDifficultyChange = (value: DifficultyLevel) => {
        if (!editingChallenge) return;
        setEditingChallenge({
            ...editingChallenge,
            difficultyLevel: value
        });
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
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium">Difficulty:</span>
                                    <span className="text-sm capitalize">{challenge.difficultyLevel}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium">Time Limit:</span>
                                    <span className="text-sm">{challenge.timeLimit} minutes</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleUpdateClick(challenge)}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleDelete(challenge.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                                <Button asChild variant="default">
                                    <Link to={`/user-dashboard/challenge-attempt/${challenge.id}/attempt`}>Attempt Challenge</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Update Challenge Dialog */}
            {editingChallenge && (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Update Challenge</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleUpdateSubmit} className="space-y-6 py-2">
                            <div className="space-y-3">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    value={editingChallenge.title}
                                    onChange={handleInputChange}
                                    required
                                    className="mt-1"
                                />
                            </div>

                            <div className="space-y-3">
                                <Label>Category</Label>
                                <Select
                                    value={editingChallenge.skillCategory}
                                    onValueChange={handleCategoryChange}
                                >
                                    <SelectTrigger className="mt-1">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="coding">Coding</SelectItem>
                                        <SelectItem value="cooking">Cooking</SelectItem>
                                        <SelectItem value="diy">DIY</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-3">
                                <Label>Difficulty Level</Label>
                                <Select
                                    value={editingChallenge.difficultyLevel}
                                    onValueChange={handleDifficultyChange}
                                >
                                    <SelectTrigger className="mt-1">
                                        <SelectValue placeholder="Select difficulty" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="beginner">Beginner</SelectItem>
                                        <SelectItem value="intermediate">Intermediate</SelectItem>
                                        <SelectItem value="advanced">Pro</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
                                <Input
                                    id="timeLimit"
                                    name="timeLimit"
                                    type="number"
                                    value={editingChallenge.timeLimit}
                                    onChange={handleInputChange}
                                    required
                                    className="mt-1"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsDialogOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit">Save Changes</Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}