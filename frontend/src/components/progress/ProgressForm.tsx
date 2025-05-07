import {useState, useEffect} from 'react';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {Slider} from '@/components/ui/slider';
import {Card, CardHeader, CardTitle, CardContent} from '@/components/ui/card';
import {Progress} from '@/types/progress';

const formSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    topics: z.array(z.string()).min(1, 'At least one topic is required'),
    progress: z.number().min(0).max(100),
    lastUpdate: z.string().optional(),
});

interface ProgressFormProps {
    onSubmit: (progress: Progress) => void,
    initialData?: Progress | null,
    onCancel?: () => void,
    defaultValues?: Partial<Progress>
}

export const ProgressForm = ({onSubmit, initialData, onCancel, defaultValues}: ProgressFormProps) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            topics: [],
            progress: 0,
            lastUpdate: '',
        },
    });

    const [topics, setTopics] = useState<string[]>([]);
    const [topicInput, setTopicInput] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (initialData) {
            form.reset({
                title: initialData.title,
                topics: initialData.topics,
                progress: initialData.progress,
                lastUpdate: initialData.lastUpdate?.substring(0, 5) || '',
            });
            setTopics(initialData.topics);
            setIsEditing(true);
        }
    }, [initialData, form]);

    const handleAddTopic = () => {
        if (topicInput.trim() && !topics.includes(topicInput.trim())) {
            const newTopics = [...topics, topicInput.trim()];
            setTopics(newTopics);
            form.setValue('topics', newTopics);
            setTopicInput('');
        }
    };

    const handleRemoveTopic = (index: number) => {
        const newTopics = topics.filter((_, i) => i !== index);
        setTopics(newTopics);
        form.setValue('topics', newTopics);
    };

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        const progressData: Progress = {
            ...values,
            completedTopics: initialData?.completedTopics || [],
            lastUpdate: values.lastUpdate ? `${values.lastUpdate}:00` : undefined,
        };
        onSubmit(progressData);
        if (!isEditing) {
            form.reset();
            setTopics([]);
        }
    };

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>{isEditing ? 'Update Progress' : 'Add New Progress'}</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter title" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="topics"
                            render={() => (
                                <FormItem>
                                    <FormLabel>Topics</FormLabel>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex gap-2">
                                            <Input
                                                value={topicInput}
                                                onChange={(e) => setTopicInput(e.target.value)}
                                                placeholder="Add topic"
                                                onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={handleAddTopic}
                                            >
                                                Add
                                            </Button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {topics.map((topic, index) => (
                                                <Badge
                                                    key={index}
                                                    variant="secondary"
                                                    className="flex items-center gap-1"
                                                >
                                                    {topic}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveTopic(index)}
                                                        className="ml-1 rounded-full hover:bg-accent"
                                                    >
                                                        ×
                                                    </button>
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="lastUpdate"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Time</FormLabel>
                                    <FormControl>
                                        <Input type="time" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        {isEditing && (
                            <FormField
                                control={form.control}
                                name="progress"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Progress ({field.value}%)</FormLabel>
                                        <FormControl>
                                            <Slider
                                                min={0}
                                                max={100}
                                                step={1}
                                                value={[field.value]}
                                                onValueChange={(value) => field.onChange(value[0])}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        )}

                        <div className="flex justify-end gap-2">
                            {isEditing && onCancel && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onCancel}
                                >
                                    Cancel
                                </Button>
                            )}
                            <Button type="submit">
                                {isEditing ? 'Update' : 'Add'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};