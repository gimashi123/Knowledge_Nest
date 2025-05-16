import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ProgressForm } from './ProgressForm'
import { Progress } from '@/types/progress'
import {useEffect} from "react";
import {useAuth} from "@/contexts/auth-context.tsx";

interface AddProgressFormProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (data: Progress | undefined ) => Promise<void>
    imageUrl?: string
}

export function AddProgressForm({ open, onOpenChange, onSubmit, imageUrl = 'https://nodeslinks.com/wp-content/uploads/2024/03/PROGRESS-TRACKING.jpg' }: AddProgressFormProps) {
    const defaultValues: Partial<Progress> = {
        title: '',
        topics: [],
        progress: 0,
        lastUpdate: '',
        userId: ''
    }

    const {currentUser} = useAuth();

    useEffect(() => {
        if(currentUser){
            defaultValues.userId = currentUser.id;
        }
    }, [currentUser?.id]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>Add New Progress</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Form Section */}
                    <div className="col-span-1">
                        <ProgressForm
                            defaultValues={defaultValues}
                            onSubmit={onSubmit}
                        />
                    </div>

                    {/* Image Section */}
                    <div className="col-span-1 hidden md:block">
                        <div className="relative h-full min-h-[300px] rounded-lg overflow-hidden bg-gray-100">
                            <img
                                src={imageUrl}
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