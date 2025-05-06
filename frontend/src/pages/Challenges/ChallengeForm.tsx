import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Challenge } from '@/types/challenge';
import { api } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import { Plus, X } from 'lucide-react';

const formSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    skillCategory: z.enum(['coding', 'cooking', 'diy']),
    difficultyLevel: z.enum(['beginner', 'intermediate', 'pro']),
    timeLimit: z.number().min(1, 'Time limit must be at least 1 minute'),
    tasks: z.array(z.string().min(5, 'Task must be at least 5 characters')).min(1, 'At least 1 task required'),
});

interface ChallengeFormProps {
    initialData?: Challenge;
}

export function ChallengeForm({ initialData }: ChallengeFormProps) {
    const navigate = useNavigate();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            title: '',
            skillCategory: 'coding',
            difficultyLevel: 'beginner',
            timeLimit: 5,
            tasks: [''],
        },
    });

    const tasks = form.watch('tasks');

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const challengeData = {
                ...values,
                creatorId: 'current-user-id',
            };

            if (initialData) {
                await api.put(`/api/challenges/${initialData.id}`, challengeData);
            } else {
                await api.post('/api/challenges', challengeData);
            }

            navigate('/challenges');
        } catch (error) {
            console.error('Error saving challenge:', error);
        }
    };

    const addTask = () => {
        form.setValue('tasks', [...tasks, '']);
    };

    const removeTask = (index: number) => {
        form.setValue('tasks', tasks.filter((_, i) => i !== index));
    };

    return (
        <div className="container mx-auto py-8 max-w-4xl">
            {/* Header Section */}
            <div className="bg-white shadow-sm rounded-lg p-6 mb-6 border border-gray-200">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            {initialData ? 'Edit Challenge' : 'Create New Challenge'}
                        </h1>
                        <p className="text-gray-600 mb-4">
                            {initialData ? 'Update your challenge details' : 'Design a new challenge for users to attempt'}
                        </p>
                    </div>
                </div>

                {/* Instructions Section */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-4">
                    <h2 className="font-semibold text-blue-800 mb-2">Guidelines:</h2>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                        <li>Provide a clear and descriptive title for your challenge</li>
                        <li>Select appropriate category and difficulty level</li>
                        <li>Set a reasonable time limit (minimum 1 minute)</li>
                        <li>Create at least 1 task (maximum 5 tasks allowed)</li>
                        <li>Each task should have clear instructions (minimum 5 characters)</li>
                    </ul>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Main Form Content */}
                    <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
                        <div className="space-y-6">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-medium text-gray-700">Challenge Title *</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter challenge title"
                                                className="text-base py-4"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="skillCategory"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-medium text-gray-700">Skill Category *</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="py-4">
                                                        <SelectValue placeholder="Select category" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="coding" className="py-2">Coding</SelectItem>
                                                    <SelectItem value="cooking" className="py-2">Cooking</SelectItem>
                                                    <SelectItem value="diy" className="py-2">DIY</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="difficultyLevel"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-medium text-gray-700">Difficulty Level *</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="py-4">
                                                        <SelectValue placeholder="Select difficulty" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="beginner" className="py-2">Beginner</SelectItem>
                                                    <SelectItem value="intermediate" className="py-2">Intermediate</SelectItem>
                                                    <SelectItem value="pro" className="py-2">Pro</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="timeLimit"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-medium text-gray-700">Time Limit (minutes) *</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min="1"
                                                className="py-4"
                                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                                                value={field.value}
                                                placeholder="Enter time limit"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {/* Tasks Section */}
                    <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="font-medium text-gray-700 text-lg">Challenge Tasks ({tasks.length}/5)</h3>
                                {tasks.length < 5 && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="text-blue-600 hover:text-blue-700"
                                        onClick={addTask}
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Task
                                    </Button>
                                )}
                            </div>

                            <div className="space-y-4">
                                {tasks.map((_, index) => (
                                    <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="font-medium text-gray-700">Task {index + 1} *</span>
                                            {index > 0 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-500 hover:text-red-600 p-1 h-auto"
                                                    onClick={() => removeTask(index)}
                                                >
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </div>
                                        <FormField
                                            control={form.control}
                                            name={`tasks.${index}`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder={`Enter detailed instructions for task ${index + 1}`}
                                                            className="min-h-[100px]"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end gap-4 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="px-8 py-4 text-base"
                            onClick={() => navigate('/user-dashboard/challenges')}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="px-8 py-4 text-base bg-green-600 hover:bg-green-700 transition-colors shadow-md"
                        >
                            {initialData ? 'Update Challenge' : 'Create Challenge'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}