import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/services/progress-service'
import { AddProgressForm } from '@/components/progress/AddProgressForm'
import { EditProgressForm } from '@/components/progress/EditProgressForm'
import {
    deleteProgress,
    getProgress,
    createProgress,
    updateProgress
} from '@/services/progress-service'
import toast from 'react-hot-toast'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import { UserSidebar } from "@/components/sidebar/UserSidebar"
import { ClipboardType, Trash, Pencil, SquarePlus } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export const ProgressPage = () => {
    const [progressEntries, setProgressEntries] = useState<Progress[]>([])
    const [selectedProgress, setSelectedProgress] = useState<Progress | null>(null)
    const [showAddForm, setShowAddForm] = useState(false)
    const [showEditForm, setShowEditForm] = useState(false)
    const [showTrackDialog, setShowTrackDialog] = useState(false)
    const [checkedTopics, setCheckedTopics] = useState<boolean[]>([])

    useEffect(() => {
        fetchProgress().then()
    }, [])

    const fetchProgress = async () => {
        try {
            const response = await getProgress()
            setProgressEntries(response.data)
        } catch (error) {
            console.error('Error fetching progress:', error)
            toast.error('Failed to load progress entries')
            setProgressEntries([])
        }
    }

    const handleAddProgress = async (formData: Progress) => {
        try {
            await createProgress(formData)
            toast.success('Progress added successfully')
            await fetchProgress()
            setShowAddForm(false)
        } catch (error) {
            toast.error('Failed to add progress')
        }
    }

    const handleUpdateProgress = async (formData: Progress) => {
        if (!selectedProgress?.progressId) return

        try {
            await updateProgress(selectedProgress.progressId, formData)
            toast.success('Progress updated successfully')
            await fetchProgress()
            setShowEditForm(false)
            setShowTrackDialog(false)
        } catch (error) {
            toast.error('Failed to update progress')
        }
    }

    const handleDelete = async (id: string) => {
        try {
            await deleteProgress(id)
            toast.success('Progress deleted successfully')
            await fetchProgress()
        } catch (error) {
            toast.error('Failed to delete progress')
        }
    }

    const handleTrackClick = (progress: Progress) => {
        setSelectedProgress(progress)
        const topics = progress.topics || []
        const total = topics.length
        const completedCount = Math.round((progress.progress / 100) * total)
        const initialChecked = Array(total).fill(false).map((_, index) => index < completedCount)
        setCheckedTopics(initialChecked)
        setShowTrackDialog(true)
    }

    return (
        <div className="flex min-h-screen ">
            <UserSidebar />

            <main className="flex-1 ml-0 lg:ml-[220px] p-4 lg:p-8">
                <div className="max-w-6xl mx-auto space-y-6">
                    <Card>
                        <CardHeader className="bg-background">
                            <div
                                className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
                                <CardTitle className="text-2xl font-semibold">
                                    Progress Management
                                </CardTitle>
                                <Button
                                    onClick={() => setShowAddForm(true)}
                                    className="gap-2"
                                >
                                    <SquarePlus className="h-4 w-4"/>
                                    New Progress
                                </Button>
                            </div>
                        </CardHeader>
                        <Separator/>
                        <CardContent className="p-0">
                            <AddProgressForm
                                open={showAddForm}
                                onOpenChange={setShowAddForm}
                                //@ts-ignore
                                onSubmit={handleAddProgress}
                            />

                            {selectedProgress && (
                                <EditProgressForm
                                    open={showEditForm}
                                    onOpenChange={setShowEditForm}
                                    progress={selectedProgress}
                                    onSubmit={handleUpdateProgress}
                                />
                            )}

                            <Dialog open={showTrackDialog} onOpenChange={setShowTrackDialog}>
                                <DialogContent className="sm:max-w-[425px] lg:max-w-[600px]">
                                    <DialogHeader>
                                        <DialogTitle>{selectedProgress?.title} - Topics</DialogTitle>
                                    </DialogHeader>
                                    <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto p-2">
                                        {selectedProgress?.topics?.map((topic, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center space-x-4 p-3 rounded-lg hover:bg-accent transition-colors"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={checkedTopics[index] || false}
                                                    onChange={(e) => {
                                                        const newChecked = [...checkedTopics]
                                                        newChecked[index] = e.target.checked
                                                        setCheckedTopics(newChecked)

                                                        const total = selectedProgress.topics?.length || 1
                                                        const completed = newChecked.filter(Boolean).length
                                                        const newProgress = (completed / total) * 100

                                                        setSelectedProgress(prev => prev ? {
                                                            ...prev,
                                                            progress: newProgress
                                                        } : null)
                                                    }}
                                                    className="w-4 h-4 text-primary rounded border-primary/50 focus:ring-primary"
                                                />
                                                <span className="text-sm">{topic}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            onClick={() => {
                                                if (selectedProgress) {
                                                    handleUpdateProgress(selectedProgress)
                                                }
                                            }}
                                        >
                                            Save Changes
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>

                            <div className="rounded-b-lg border">
                                <Table>
                                    <TableHeader className="bg-accent/50">
                                        <TableRow>
                                            <TableHead className="w-[200px]">Title</TableHead>
                                            <TableHead>Topics</TableHead>
                                            <TableHead>Progress</TableHead>
                                            <TableHead className="w-[120px]">Last Updated</TableHead>
                                            <TableHead className="w-[130px]">Actions</TableHead>
                                            <TableHead className="w-[100px]">Track</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {progressEntries.map((progress) => (
                                            <TableRow
                                                key={progress.progressId}
                                                className="hover:bg-accent/20 transition-colors"
                                            >
                                                <TableCell className="font-medium">
                                                    {progress.title}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-wrap gap-2">
                                                        {progress.topics?.map((topic, index) => (
                                                            <Badge
                                                                key={index}
                                                                variant="outline"
                                                                className="text-xs font-normal"
                                                            >
                                                                {topic}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                            <span className="text-sm tabular-nums">
                              {progress.progress}%
                            </span>
                                                        <div
                                                            className="h-2 w-32 bg-accent rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-primary transition-all duration-500"
                                                                style={{width: `${progress.progress}%`}}
                                                            />
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {progress.lastUpdate && new Date(progress.lastUpdate).toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </TableCell>
                                                <TableCell className="space-x-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0"
                                                        onClick={() => {
                                                            setSelectedProgress(progress)
                                                            setShowEditForm(true)
                                                        }}
                                                    >
                                                        <Pencil className="h-4 w-4"/>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                                        onClick={() => progress.progressId && handleDelete(progress.progressId)}
                                                    >
                                                        <Trash className="h-4 w-4"/>
                                                    </Button>
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0"
                                                        onClick={() => handleTrackClick(progress)}
                                                    >
                                                        <ClipboardType className="h-4 w-4"/>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>

                </div>
                <div className={'flex justify-end'}><img
                    src="/5728432.jpg"
                    alt="Progress chart"
                    className="w-1/3 object-cover "
                /></div>
            </main>
        </div>
    )
}