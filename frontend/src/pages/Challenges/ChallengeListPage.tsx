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
    DialogFooter,
    DialogDescription,
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
import {UserSidebar} from "@/components/sidebar/UserSidebar.tsx";

type SkillCategory = 'coding' | 'cooking' | 'diy';
type DifficultyLevel = 'beginner' | 'intermediate' | 'pro';

export default function ChallengeListPage() {
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | SkillCategory>('all');
    const [difficultyFilter, setDifficultyFilter] = useState<DifficultyLevel | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [challengeToDelete, setChallengeToDelete] = useState<Challenge | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
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

    const handleDeleteClick = (challenge: Challenge) => {
        setChallengeToDelete(challenge);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!challengeToDelete) return;

        try {
            await api.delete(`/api/challenges/${challengeToDelete.id}`);
            setChallenges(challenges.filter(challenge => challenge.id !== challengeToDelete.id));
            setIsDeleteDialogOpen(false);
        } catch (error) {
            console.error('Error deleting challenge:', error);
        }
    };

    const handleUpdateClick = (challenge: Challenge) => {
        setEditingChallenge({ ...challenge }); // Create a copy to avoid direct state mutation
        setIsDialogOpen(true);
    };

    const handleUpdateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingChallenge) return;

        try {
            const response = await api.put(`/api/challenges/${editingChallenge.id}`, {
                title: editingChallenge.title,
                skillCategory: editingChallenge.skillCategory,
                difficultyLevel: editingChallenge.difficultyLevel,
                timeLimit: editingChallenge.timeLimit,
                tasks: editingChallenge.tasks,
            });

            setChallenges(challenges.map(challenge =>
                challenge.id === editingChallenge.id ? response.data : challenge
            ));
            setIsDialogOpen(false);
        } catch (error) {
            console.error('Error updating challenge:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!editingChallenge) return;
        const { name, value } = e.target;
        setEditingChallenge({
            ...editingChallenge,
            [name]: name === 'timeLimit' ? parseInt(value) : value
        });
    };

    const handleTaskChange = (index: number, value: string) => {
        if (!editingChallenge) return;
        const newTasks = [...editingChallenge.tasks];
        newTasks[index] = value;
        setEditingChallenge({
            ...editingChallenge,
            tasks: newTasks
        });
    };

    const addNewTask = () => {
        if (!editingChallenge) return;
        if (editingChallenge.tasks.length >= 5) return; // Prevent adding more than 5 tasks
        setEditingChallenge({
            ...editingChallenge,
            tasks: [...editingChallenge.tasks, '']
        });
    };

    const removeTask = (index: number) => {
        if (!editingChallenge) return;
        const newTasks = editingChallenge.tasks.filter((_, i) => i !== index);
        setEditingChallenge({
            ...editingChallenge,
            tasks: newTasks
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

    // Update filtered challenges computation
    const filteredChallenges = challenges.filter(challenge => {
        const matchesSearch = challenge.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDifficulty = difficultyFilter === 'all' || challenge.difficultyLevel === difficultyFilter;
        return matchesSearch && matchesDifficulty;
    });

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading challenges...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen ">
            <UserSidebar />

            <main className="flex-1 ml-0 lg:ml-[220px] p-4 lg:p-8">
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Header Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Challenges</h1>
                            <p className="text-gray-600 mt-1">Create and manage your learning challenges</p>
                        </div>
                        <Button
                            onClick={() => navigate('/add-challenges')}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 h-12"
                        >
                            <PlusCircle className="mr-2 h-5 w-5" />
                            Create Challenge
                        </Button>
                    </div>
                </div>

                {/* Enhanced Filter Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-8">
                    <div className="flex flex-wrap items-center gap-4">
                        {/* Search Bar */}
                        <div className="flex-1 min-w-[200px] max-w-[300px]">
                            <div className="relative">
                                <Input
                                    type="text"
                                    placeholder="Search challenges..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="h-9 pl-9 pr-4 rounded-lg bg-gray-50 border-gray-200 focus:border-[#44468f] focus:ring-[#44468f] transition-all duration-200"
                                />
                                <svg
                                    className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </div>
                        </div>

                        <div className="h-6 w-px bg-gray-200"></div>

                        {/* Category Filter */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Category:</span>
                            <div className="flex gap-2">
                                <Button
                                    variant={filter === 'all' ? 'default' : 'outline'}
                                    onClick={() => setFilter('all')}
                                    className={`h-9 px-3 rounded-lg transition-all duration-200 ${
                                        filter === 'all' 
                                            ? 'bg-[#44468f] text-white hover:bg-[#44468f]/90' 
                                            : 'hover:bg-gray-50 text-gray-700'
                                    }`}
                                >
                                    All
                                </Button>
                                <Button
                                    variant={filter === 'coding' ? 'default' : 'outline'}
                                    onClick={() => setFilter('coding')}
                                    className={`h-9 px-3 rounded-lg transition-all duration-200 flex items-center gap-1.5 ${
                                        filter === 'coding' 
                                            ? 'bg-[#44468f] text-white hover:bg-[#44468f]/90' 
                                            : 'hover:bg-gray-50 text-gray-700'
                                    }`}
                                >
                                    <Code2 className="h-4 w-4" />
                                    Coding
                                </Button>
                                <Button
                                    variant={filter === 'cooking' ? 'default' : 'outline'}
                                    onClick={() => setFilter('cooking')}
                                    className={`h-9 px-3 rounded-lg transition-all duration-200 flex items-center gap-1.5 ${
                                        filter === 'cooking' 
                                            ? 'bg-[#44468f] text-white hover:bg-[#44468f]/90' 
                                            : 'hover:bg-gray-50 text-gray-700'
                                    }`}
                                >
                                    <ChefHat className="h-4 w-4" />
                                    Cooking
                                </Button>
                                <Button
                                    variant={filter === 'diy' ? 'default' : 'outline'}
                                    onClick={() => setFilter('diy')}
                                    className={`h-9 px-3 rounded-lg transition-all duration-200 flex items-center gap-1.5 ${
                                        filter === 'diy' 
                                            ? 'bg-[#44468f] text-white hover:bg-[#44468f]/90' 
                                            : 'hover:bg-gray-50 text-gray-700'
                                    }`}
                                >
                                    <Hammer className="h-4 w-4" />
                                    DIY
                                </Button>
                            </div>
                        </div>

                        <div className="h-6 w-px bg-gray-200"></div>

                        {/* Difficulty Filter */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Difficulty:</span>
                            <div className="flex gap-2">
                                <Button
                                    variant={difficultyFilter === 'all' ? 'default' : 'outline'}
                                    onClick={() => setDifficultyFilter('all')}
                                    className={`h-9 px-3 rounded-lg transition-all duration-200 ${
                                        difficultyFilter === 'all' 
                                            ? 'bg-[#44468f] text-white hover:bg-[#44468f]/90' 
                                            : 'hover:bg-gray-50 text-gray-700'
                                    }`}
                                >
                                    All
                                </Button>
                                <Button
                                    variant={difficultyFilter === 'beginner' ? 'default' : 'outline'}
                                    onClick={() => setDifficultyFilter('beginner')}
                                    className={`h-9 px-3 rounded-lg transition-all duration-200 ${
                                        difficultyFilter === 'beginner' 
                                            ? 'bg-green-500 text-white hover:bg-green-500/90' 
                                            : 'hover:bg-green-50 text-green-600 border-green-200'
                                    }`}
                                >
                                    Beginner
                                </Button>
                                <Button
                                    variant={difficultyFilter === 'intermediate' ? 'default' : 'outline'}
                                    onClick={() => setDifficultyFilter('intermediate')}
                                    className={`h-9 px-3 rounded-lg transition-all duration-200 ${
                                        difficultyFilter === 'intermediate' 
                                            ? 'bg-yellow-500 text-white hover:bg-yellow-500/90' 
                                            : 'hover:bg-yellow-50 text-yellow-600 border-yellow-200'
                                    }`}
                                >
                                    Intermediate
                                </Button>
                                <Button
                                    variant={difficultyFilter === 'pro' ? 'default' : 'outline'}
                                    onClick={() => setDifficultyFilter('pro')}
                                    className={`h-9 px-3 rounded-lg transition-all duration-200 ${
                                        difficultyFilter === 'pro' 
                                            ? 'bg-red-500 text-white hover:bg-red-500/90' 
                                            : 'hover:bg-red-50 text-red-600 border-red-200'
                                    }`}
                                >
                                    Pro
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Challenges Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredChallenges.map((challenge) => (
                        <Card key={challenge.id} className="hover:shadow-lg transition-all duration-200 border border-gray-200">
                            <CardHeader className="pb-4">
                                <div className="flex justify-between items-start gap-4">
                                    <CardTitle className="text-xl font-semibold text-gray-900 line-clamp-2">
                                        {challenge.title}
                                    </CardTitle>
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                                        {getCategoryIcon(challenge.skillCategory)}
                                        <span className="capitalize">{challenge.skillCategory}</span>
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-600">Difficulty:</span>
                                        <span className={`text-sm font-medium px-2.5 py-1 rounded-full ${
                                            challenge.difficultyLevel === 'beginner' ? 'bg-green-100 text-green-800' :
                                            challenge.difficultyLevel === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {challenge.difficultyLevel.charAt(0).toUpperCase() + challenge.difficultyLevel.slice(1)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-600">Time Limit:</span>
                                        <span className="text-sm font-medium text-gray-900">
                                            {challenge.timeLimit} minutes
                                        </span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleUpdateClick(challenge)}
                                            className="h-9 w-9 hover:bg-gray-100"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleDeleteClick(challenge)}
                                            className="h-9 w-9 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <Button
                                        asChild
                                        className="bg-[#44468f] hover:bg-[#3a3d7a] text-white border border-gray-200"
                                    >
                                        <Link to={`/challenge-attempt/${challenge.id}/attempt`}>
                                            Attempt Challenge
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Empty State */}
                {filteredChallenges.length === 0 && (
                    <div className="text-center py-12">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <Code2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No challenges found</h3>
                            <p className="text-gray-600 mb-6">
                                {searchQuery || difficultyFilter !== 'all' 
                                    ? "No challenges match your current filters"
                                    : "Create your first challenge to get started"}
                            </p>
                            <Button
                                onClick={() => navigate('/add-challenges')}
                                className="bg-green-600 hover:bg-green-700 text-white"
                            >
                                <PlusCircle className="mr-2 h-5 w-5" />
                                Create Challenge
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Update Challenge Dialog */}
            {editingChallenge && (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-lg border border-gray-200">
                        <DialogHeader className="space-y-2 pb-3 border-b border-gray-100">
                            <DialogTitle className="text-xl font-bold text-gray-900">Update Challenge</DialogTitle>
                            <DialogDescription className="text-sm text-gray-600">
                                Modify the challenge details below. All fields are required.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleUpdateSubmit} className="space-y-4 py-3">
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-sm font-medium text-gray-700">Title</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    value={editingChallenge.title}
                                    onChange={handleInputChange}
                                    required
                                    className="h-10 bg-gray-50 border-gray-200 focus:border-[#44468f] focus:ring-[#44468f]"
                                    placeholder="Enter challenge title"
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">Category</Label>
                                    <Select
                                        value={editingChallenge.skillCategory}
                                        onValueChange={handleCategoryChange}
                                    >
                                        <SelectTrigger className="h-10 bg-gray-50 border-gray-200 focus:border-[#44468f] focus:ring-[#44468f]">
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="coding" className="flex items-center gap-2">
                                                <Code2 className="h-4 w-4" />
                                                Coding
                                            </SelectItem>
                                            <SelectItem value="cooking" className="flex items-center gap-2">
                                                <ChefHat className="h-4 w-4" />
                                                Cooking
                                            </SelectItem>
                                            <SelectItem value="diy" className="flex items-center gap-2">
                                                <Hammer className="h-4 w-4" />
                                                DIY
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">Difficulty Level</Label>
                                    <Select
                                        value={editingChallenge.difficultyLevel}
                                        onValueChange={handleDifficultyChange}
                                    >
                                        <SelectTrigger className="h-10 bg-gray-50 border-gray-200 focus:border-[#44468f] focus:ring-[#44468f]">
                                            <SelectValue placeholder="Select difficulty" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="beginner" className="text-green-700">Beginner</SelectItem>
                                            <SelectItem value="intermediate" className="text-yellow-700">Intermediate</SelectItem>
                                            <SelectItem value="pro" className="text-red-700">Pro</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="timeLimit" className="text-sm font-medium text-gray-700">Time Limit (minutes)</Label>
                                    <Input
                                        id="timeLimit"
                                        name="timeLimit"
                                        type="number"
                                        min="1"
                                        value={editingChallenge.timeLimit}
                                        onChange={handleInputChange}
                                        required
                                        className="h-10 bg-gray-50 border-gray-200 focus:border-[#44468f] focus:ring-[#44468f]"
                                        placeholder="Enter time limit"
                                    />
                                </div>
                            </div>

                            {/* Tasks Section */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <Label className="text-sm font-medium text-gray-700">
                                        Challenge Tasks ({editingChallenge.tasks.length}/5)
                                    </Label>
                                    {editingChallenge.tasks.length < 5 && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={addNewTask}
                                            className="h-8 px-3"
                                        >
                                            <PlusCircle className="mr-2 h-4 w-4" />
                                            Add Task
                                        </Button>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    {editingChallenge.tasks.map((task, index) => (
                                        <div key={index} className="flex gap-2">
                                            <Input
                                                value={task}
                                                onChange={(e) => handleTaskChange(index, e.target.value)}
                                                placeholder={`Task ${index + 1}`}
                                                className="flex-1 h-10 bg-gray-50 border-gray-200 focus:border-[#44468f] focus:ring-[#44468f]"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                onClick={() => removeTask(index)}
                                                className="h-10 w-10 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsDialogOpen(false)}
                                    className="h-9 px-4 border-gray-200 hover:bg-gray-50"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="h-9 px-4 bg-[#44468f] hover:bg-[#3a3d7a] text-white"
                                >
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold">Delete Challenge</DialogTitle>
                        <DialogDescription className="text-gray-600">
                            Are you sure you want to delete "{challengeToDelete?.title}"? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteDialogOpen(false)}
                            className="h-11 px-6"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDelete}
                            className="h-11 px-6"
                        >
                            Delete Challenge
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
            </main>
        </div>
    );
}