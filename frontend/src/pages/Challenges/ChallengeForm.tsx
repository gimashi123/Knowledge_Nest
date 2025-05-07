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
        <div className="container mx-auto py-8 max-w-6xl">
            <div className="flex flex-col md:flex-row gap-6">
                {/* Instructions Sidebar */}
                <div className="md:w-1/3">
                    <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200 sticky top-6">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">
                            {initialData ? 'Edit Challenge' : 'Create New Challenge'}
                        </h1>

                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <h2 className="font-semibold text-blue-800 mb-3 text-lg">Guidelines</h2>
                            <ul className="space-y-3">
                                <li className="flex items-start">
                                    <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">1</span>
                                    <span className="text-gray-700">Provide a clear and descriptive title</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">2</span>
                                    <span className="text-gray-700">Select appropriate category and difficulty</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">3</span>
                                    <span className="text-gray-700">Set reasonable time limit (min 1 minute)</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">4</span>
                                    <span className="text-gray-700">Create 1-5 clear tasks (min 5 chars each)</span>
                                </li>
                            </ul>
                        </div>

                        <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h3 className="font-semibold text-gray-800 mb-2">Tips</h3>
                            <p className="text-sm text-gray-600">
                                Make your challenge engaging but achievable. Clear instructions lead to better submissions!
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Form Content */}
                <div className="md:w-2/3">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-800 mb-6">Challenge Details</h2>
                                <div className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-medium text-gray-700">Challenge Title *</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="e.g., 'JavaScript Array Mastery'"
                                                        className="text-base"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="skillCategory"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-medium text-gray-700">Skill Category *</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select category" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="coding">Coding</SelectItem>
                                                            <SelectItem value="cooking">Cooking</SelectItem>
                                                            <SelectItem value="diy">DIY</SelectItem>
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
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select difficulty" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="beginner">Beginner</SelectItem>
                                                            <SelectItem value="intermediate">Intermediate</SelectItem>
                                                            <SelectItem value="pro">Pro</SelectItem>
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
                                                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                                                        value={field.value}
                                                        placeholder="e.g., 30"
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
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold text-gray-800">Challenge Tasks</h2>
                                    <div className="text-sm text-gray-500">
                                        {tasks.length}/5 tasks added
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {tasks.map((_, index) => (
                                        <div key={index} className="group relative bg-gray-50 p-4 rounded-lg border border-gray-200">
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="font-medium text-gray-700">Task {index + 1} *</span>
                                                {index > 0 && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-red-500 hover:text-red-600 p-1 h-auto opacity-0 group-hover:opacity-100 transition-opacity"
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
                                                                placeholder={`What should the user do for task ${index + 1}? Be specific.`}
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

                                {tasks.length < 5 && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full mt-4"
                                        onClick={addTask}
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Task
                                    </Button>
                                )}
                            </div>

                            {/* Form Actions */}
                            <div className="flex justify-end gap-4 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="px-6"
                                    onClick={() => navigate('/user-dashboard/challenges')}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="px-6 bg-green-600 hover:bg-green-700"
                                >
                                    {initialData ? 'Update Challenge' : 'Create Challenge'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}