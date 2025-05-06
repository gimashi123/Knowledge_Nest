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
import { Plus } from 'lucide-react';

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
        <div className="container mx-auto py-8 max-w-2xl">
            <h1 className="text-2xl font-bold mb-8">
                {initialData ? 'Edit Challenge' : 'Create New Challenge'}
            </h1>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-medium">Challenge Title *</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter challenge title" {...field} />
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
                                    <FormLabel className="font-medium">Skill Category *</FormLabel>
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
                                    <FormLabel className="font-medium">Difficulty Level *</FormLabel>
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
                                <FormLabel className="font-medium">Time Limit (minutes) *</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        min="1"
                                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                                        value={field.value}
                                        placeholder="Enter time limit"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="space-y-4">
                        <FormLabel className="font-medium">Challenge Tasks ({tasks.length}/5)</FormLabel>
                        {tasks.map((_, index) => (
                            <div key={index} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <FormLabel>Task {index + 1} *</FormLabel>
                                    {index > 0 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-500 hover:text-red-600"
                                            onClick={() => removeTask(index)}
                                        >
                                            Remove
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
                                                    placeholder={`Enter task ${index + 1}`}
                                                    className="min-h-[80px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        ))}
                        {tasks.length < 5 && (
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full mt-2"
                                onClick={addTask}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Task
                            </Button>
                        )}
                    </div>

                    {/*<FormField*/}
                    {/*    control={form.control}*/}
                    {/*    name="difficultyLevel"*/}
                    {/*    render={({ field }) => (*/}
                    {/*        <FormItem>*/}
                    {/*            <FormLabel className="font-medium">Difficulty Level *</FormLabel>*/}
                    {/*            <Select onValueChange={field.onChange} defaultValue={field.value}>*/}
                    {/*                <FormControl>*/}
                    {/*                    <SelectTrigger>*/}
                    {/*                        <SelectValue placeholder="Select difficulty" />*/}
                    {/*                    </SelectTrigger>*/}
                    {/*                </FormControl>*/}
                    {/*                <SelectContent>*/}
                    {/*                    <SelectItem value="beginner">Beginner</SelectItem>*/}
                    {/*                    <SelectItem value="intermediate">Intermediate</SelectItem>*/}
                    {/*                    <SelectItem value="pro">Pro</SelectItem>*/}
                    {/*                </SelectContent>*/}
                    {/*            </Select>*/}
                    {/*            <FormMessage />*/}
                    {/*        </FormItem>*/}
                    {/*    )}*/}
                    {/*/>*/}

                    <div className="flex justify-end gap-4 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate('/user-dashboard/challenges')}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">
                            {initialData ? 'Update Challenge' : 'Create Challenge'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}