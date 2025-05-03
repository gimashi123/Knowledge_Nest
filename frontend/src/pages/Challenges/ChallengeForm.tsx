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

const formSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    skillCategory: z.enum(['coding', 'cooking', 'diy']),
    difficultyLevel: z.enum(['beginner', 'intermediate', 'pro']),
    timeLimit: z.number().min(1, 'Time limit must be at least 1 minute'),
    tasks: z.array(z.string().min(5, 'Task must be at least 5 characters')).length(5, 'Exactly 5 tasks required'),
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
            tasks: ['', '', '', '', ''],
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const challengeData = {
                ...values,
                creatorId: 'current-user-id', // Replace with actual user ID from auth context
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

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-6">
                {initialData ? 'Edit Challenge' : 'Create New Challenge'}
            </h1>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Challenge Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter challenge title" {...field} />
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
                                    <FormLabel>Skill Category</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a category" />
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
                                    <FormLabel>Difficulty Level</FormLabel>
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
                                <FormLabel>Time Limit (minutes)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        min="1"
                                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                                        value={field.value}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="space-y-4">
                        <FormLabel>Challenge Tasks (5 required)</FormLabel>
                        {[0, 1, 2, 3, 4].map((index) => (
                            <FormField
                                key={index}
                                control={form.control}
                                name={`tasks.${index}`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Task {index + 1}</FormLabel>
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
                        ))}
                    </div>

                    <div className="flex justify-end gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate('/challenges')}
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