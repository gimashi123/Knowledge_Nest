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
import { Plus, X, CheckCircle, XCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import {UserSidebar} from "@/components/sidebar/UserSidebar.tsx";

const formSchema = z.object({
    title: z.string()
        .min(3, 'Title must be at least 3 characters')
        .max(100, 'Title cannot exceed 100 characters')
        .regex(/^[a-zA-Z0-9\s\-_]+$/, 'Title can only contain letters, numbers, spaces, hyphens, and underscores'),
    
    skillCategory: z.enum(['coding', 'cooking', 'diy'], {
        required_error: 'Please select a skill category',
        invalid_type_error: 'Please select a valid skill category',
    }),
    
    difficultyLevel: z.enum(['beginner', 'intermediate', 'pro'], {
        required_error: 'Please select a difficulty level',
        invalid_type_error: 'Please select a valid difficulty level',
    }),
    
    timeLimit: z.number({
        required_error: 'Time limit is required',
        invalid_type_error: 'Time limit must be a number',
    })
        .min(1, 'Time limit must be at least 1 minute')
        .max(480, 'Time limit cannot exceed 8 hours (480 minutes)')
        .refine((val) => Number.isInteger(val), {
            message: 'Time limit must be a whole number',
        }),
    
    tasks: z.array(
        z.string()
            .min(10, 'Task must be at least 10 characters')
            .max(500, 'Task cannot exceed 500 characters')
            .regex(/^[^<>]*$/, 'Task cannot contain HTML tags')
    )
        .min(1, 'At least 1 task is required')
        .max(5, 'Maximum 5 tasks allowed')
        .refine((tasks) => tasks.every(task => task.trim().length > 0), {
            message: 'Tasks cannot be empty or contain only whitespace',
        }),
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
                toast.success('Challenge updated successfully!', {
                    duration: 3000,
                    position: 'top-center',
                    style: {
                        background: '#fff',
                        color: '#333',
                        padding: '16px',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        border: '1px solid #e2e8f0',
                    },
                    icon: <CheckCircle className="w-5 h-5 text-green-500" />,
                });
            } else {
                await api.post('/api/challenges', challengeData);
                toast.success('Challenge created successfully!', {
                    duration: 3000,
                    position: 'top-center',
                    style: {
                        background: '#fff',
                        color: '#333',
                        padding: '16px',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        border: '1px solid #e2e8f0',
                    },
                    icon: <CheckCircle className="w-5 h-5 text-green-500" />,
                });
            }
            form.reset();
        } catch (error) {
            console.error('Error saving challenge:', error);
            toast.error('Failed to save challenge. Please try again.', {
                duration: 3000,
                position: 'top-center',
                style: {
                    background: '#fff',
                    color: '#333',
                    padding: '16px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #e2e8f0',
                },
                icon: <XCircle className="w-5 h-5 text-red-500" />,
            });
        }
    };

    const addTask = () => {
        form.setValue('tasks', [...tasks, '']);
    };

    const removeTask = (index: number) => {
        form.setValue('tasks', tasks.filter((_, i) => i !== index));
    };

    return (
        <div className="flex min-h-screen ">
            <UserSidebar />

            <main className="flex-1 ml-0 lg:ml-[220px] p-4 lg:p-8">
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Instructions Sidebar */}
                    <div className="lg:w-1/3">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
                            <h1 className="text-2xl font-bold text-gray-900 mb-6">
                                {initialData ? 'Edit Challenge' : 'Create New Challenge'}
                            </h1>

                            <div className="bg-blue-50 rounded-lg p-5 border border-blue-100 mb-6">
                                <h2 className="font-semibold text-blue-900 mb-4 text-lg">Guidelines</h2>
                                <ul className="space-y-4">
                                    <li className="flex items-start">
                                        <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 text-sm font-medium">1</span>
                                        <span className="text-gray-700">Provide a clear and descriptive title that reflects the challenge's purpose</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 text-sm font-medium">2</span>
                                        <span className="text-gray-700">Select appropriate category and difficulty level for better categorization</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 text-sm font-medium">3</span>
                                        <span className="text-gray-700">Set a reasonable time limit that challenges participants appropriately</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 text-sm font-medium">4</span>
                                        <span className="text-gray-700">Create clear, actionable tasks with specific requirements</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                                <h3 className="font-semibold text-gray-900 mb-3">Tips for Success</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Make your challenge engaging but achievable. Clear instructions and well-defined tasks lead to better submissions and a more rewarding experience for participants.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Main Form Content */}
                    <div className="lg:w-2/3">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Challenge Details</h2>
                                    <div className="space-y-6">
                                        <FormField
                                            control={form.control}
                                            name="title"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-base font-medium text-gray-900">
                                                        Challenge Title
                                                        <span className="text-red-500 ml-1">*</span>
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="e.g., 'JavaScript Array Mastery Challenge'"
                                                            className="text-base h-12"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage className="text-sm" />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="grid grid-cols-3 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="skillCategory"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-base font-medium text-gray-900">
                                                            Skill Category
                                                            <span className="text-red-500 ml-1">*</span>
                                                        </FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="h-12">
                                                                    <SelectValue placeholder="Select category" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="coding">Coding</SelectItem>
                                                                <SelectItem value="cooking">Cooking</SelectItem>
                                                                <SelectItem value="diy">DIY</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage className="text-sm" />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="difficultyLevel"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-base font-medium text-gray-900">
                                                            Difficulty Level
                                                            <span className="text-red-500 ml-1">*</span>
                                                        </FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="h-12">
                                                                    <SelectValue placeholder="Select difficulty" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="beginner">Beginner</SelectItem>
                                                                <SelectItem value="intermediate">Intermediate</SelectItem>
                                                                <SelectItem value="pro">Pro</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage className="text-sm" />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="timeLimit"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-base font-medium text-gray-900">
                                                            Time Limit (min)
                                                            <span className="text-red-500 ml-1">*</span>
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                min="1"
                                                                max="480"
                                                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                                                                value={field.value}
                                                                placeholder="e.g., 30"
                                                                className="h-12"
                                                            />
                                                        </FormControl>
                                                        <FormMessage className="text-sm" />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Tasks Section */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-xl font-semibold text-gray-900">Challenge Tasks</h2>
                                        <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                                            {tasks.length}/5 tasks added
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {tasks.map((_, index) => (
                                            <div key={index} className="group relative bg-gray-50 p-6 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                                                <div className="flex justify-between items-center mb-4">
                                                    <span className="font-medium text-gray-900">Task {index + 1}</span>
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
                                                                    placeholder={`What should the user do for task ${index + 1}? Be specific and clear.`}
                                                                    className="min-h-[120px] resize-none"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage className="text-sm" />
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
                                            className="w-full mt-6 h-12 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                            onClick={addTask}
                                        >
                                            <Plus className="w-5 h-5 mr-2" />
                                            Add Task
                                        </Button>
                                    )}
                                </div>

                                {/* Form Actions */}
                                <div className="flex justify-end gap-4 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="px-8 h-12"
                                        onClick={() => navigate('/user-dashboard/challenges')}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="px-8 h-12 bg-green-600 hover:bg-green-700 text-white"
                                    >
                                        {initialData ? 'Update Challenge' : 'Create Challenge'}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
            <Toaster />
        </div>
            </main>
        </div>
    );
}