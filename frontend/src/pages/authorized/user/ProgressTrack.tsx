import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.tsx'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.tsx'
import { Badge } from '@/components/ui/badge.tsx'
import { Progress } from '@/services/progress-service.tsx'
import { AddProgressForm } from '@/components/progress/AddProgressForm.tsx'
import { EditProgressForm } from '@/components/progress/EditProgressForm.tsx'
import { deleteProgress, getProgress, createProgress, updateProgress } from '@/services/progress-service.tsx'
import toast from 'react-hot-toast'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

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
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Progress Management</h1>
                <Button onClick={() => setShowAddForm(true)}>Add New Progress</Button>
            </div>

            <AddProgressForm
                open={showAddForm}
                onOpenChange={setShowAddForm}
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
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedProgress?.title} - Topics</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
                        {selectedProgress?.topics?.map((topic, index) => (
                            <div key={index} className="flex items-center space-x-2">
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
                                    className="w-4 h-4"
                                />
                                <span>{topic}</span>
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

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Topics</TableHead>
                            <TableHead>Progress</TableHead>
                            <TableHead>Last Update</TableHead>
                            <TableHead>Actions</TableHead>
                            <TableHead>Track</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {progressEntries.map((progress) => (
                            <TableRow key={progress.progressId}>
                                <TableCell className="font-medium">{progress.title}</TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-2">
                                        {progress.topics?.map((topic, index) => (
                                            <Badge key={index} variant="secondary">
                                                {topic}
                                            </Badge>
                                        ))}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <span>{progress.progress}%</span>
                                        <div className="h-2 w-20 bg-secondary rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary"
                                                style={{ width: `${progress.progress}%` }}
                                            />
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {progress.lastUpdate && new Date(progress.lastUpdate).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </TableCell>
                                <TableCell className="space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setSelectedProgress(progress)
                                            setShowEditForm(true)
                                        }}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => progress.progressId && handleDelete(progress.progressId)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="outline"
                                        onClick={() => handleTrackClick(progress)}
                                    >
                                        Track
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}