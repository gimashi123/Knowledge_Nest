import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Progress } from "@/services/progress-service"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

export function EditProgressForm({open, onOpenChange, progress, onSubmit }: {
    open: boolean
    onOpenChange: (open: boolean) => void
    progress: Progress
    onSubmit: (formData: Progress) => void
}) {
    const [formData, setFormData] = useState<Progress>(progress)
    const [newTopic, setNewTopic] = useState("")

    useEffect(() => {
        setFormData(progress)
    }, [progress])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit({
            ...formData,
            lastUpdate: new Date().toISOString()
        })
    }

    const addTopic = () => {
        if (newTopic.trim() && !formData.topics.includes(newTopic.trim())) {
            setFormData({
                ...formData,
                topics: [...formData.topics, newTopic.trim()]
            })
            setNewTopic("")
        }
    }

    const removeTopic = (topicToRemove: string) => {
        setFormData({
            ...formData,
            topics: formData.topics.filter(topic => topic !== topicToRemove),
            progress: 0
        })
    }

    const formatDateForInput = (dateString: string) => {
        if (!dateString) return ""
        try {
            const date = new Date(dateString)
            if (isNaN(date.getTime())) return ""
            return date.toISOString().slice(0, 16)
        } catch {
            return ""
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[1000px] m"> {/* Increased max width */}
                <div className="flex gap-8">
                    {/* Form Section */}
                    <div className="flex-1">
                        <DialogHeader>
                            <DialogTitle>Edit Progress</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit}>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="title" className="text-right">
                                        Title
                                    </Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                        className="col-span-3"
                                    />
                                </div>

                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="lastUpdate" className="text-right">
                                        Last Update
                                    </Label>
                                    <Input
                                        id="lastUpdate"
                                        type="datetime-local"
                                        value={formatDateForInput(formData.lastUpdate)}
                                        onChange={(e) => {
                                            if (e.target.value) {
                                                setFormData({
                                                    ...formData,
                                                    lastUpdate: new Date(e.target.value).toISOString()
                                                })
                                            }
                                        }}
                                        className="col-span-3"
                                    />
                                </div>

                                <div className="grid grid-cols-4 items-start gap-4">
                                    <Label className="text-right mt-2">
                                        Topics
                                    </Label>
                                    <div className="col-span-3 space-y-2">
                                        <div className="flex flex-wrap gap-2">
                                            {formData.topics.map((topic) => (
                                                <Badge key={topic} variant="secondary" className="flex items-center gap-1">
                                                    {topic}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeTopic(topic)}
                                                        className="hover:text-red-500"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </Badge>
                                            ))}
                                        </div>
                                        <div className="flex gap-2 mt-2">
                                            <Input
                                                value={newTopic}
                                                onChange={(e) => setNewTopic(e.target.value)}
                                                placeholder="Add new topic"
                                                className="flex-1"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={addTopic}
                                            >
                                                Add
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit">Save Changes</Button>
                            </DialogFooter>
                        </form>
                    </div>

                    {/* Image Section */}
                    <div className="hidden md:block flex-1">
                        <div className="h-full rounded-lg overflow-hidden border">
                            <img
                                src="https://nodeslinks.com/wp-content/uploads/2024/03/PROGRESS-TRACKING.jpg"
                                alt="Progress illustration"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}