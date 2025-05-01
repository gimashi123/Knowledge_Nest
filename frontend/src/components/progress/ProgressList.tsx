import { useEffect, useState } from 'react';
import {ProgressService} from "@/services/api.ts";
import {Progress} from "@/types/progress.ts";
import ProgressForm from "./ProgressForm.tsx";
import ProgressItem from "./ProgressItem.tsx";

const ProgressList = () => {
  const [progressItems, setProgressItems] = useState<Progress[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [editingProgress, setEditingProgress] = useState<Progress | null>(null);

  useEffect(() => {
    fetchProgressItems().then();
  }, []);

  const fetchProgressItems = async () => {
    setIsLoading(true);
    const data = await ProgressService.getAll();
    setProgressItems(data);
    setIsLoading(false);
  };

  const handleAddProgress = async (progress: Progress) => {
    // Initialize with empty completedTopics and 0 progress
    const progressToAdd = {
      ...progress,
      completedTopics: [],
      progress: 0
    };
    
    const newProgress = await ProgressService.create(progressToAdd);
    
    if (newProgress) {
      setProgressItems([...progressItems, newProgress]);
    }
  };

  const handleUpdateProgress = async (id: string, progress: Progress) => {
    // Keep existing completedTopics and progress if not provided
    const existingProgress = progressItems.find(item => item.progressId === id);
    const progressToUpdate = {
      ...progress,
      completedTopics: progress.completedTopics || existingProgress?.completedTopics || [],
      progress: progress.progress !== undefined ? progress.progress : existingProgress?.progress || 0
    };
    
    const updatedProgress = await ProgressService.update(id, progressToUpdate);
    
    if (updatedProgress) {
      setProgressItems(progressItems.map(item => 
        item.progressId === id ? updatedProgress : item
      ));
      setEditingProgress(null);
    }
  };

  const handleProgressItemUpdate = (updatedProgress: Progress) => {
    // This function is called when a topic checkbox is toggled
    setProgressItems(progressItems.map(item => 
      item.progressId === updatedProgress.progressId ? updatedProgress : item
    ));
  };

  const handleDeleteProgress = async (id: string) => {
    const success = await ProgressService.delete(id);
    if (success) {
      setProgressItems(progressItems.filter(item => item.progressId !== id));
    }
  };

  const startEditing = (progress: Progress) => {
    setEditingProgress(progress);
  };

  const cancelEditing = () => {
    setEditingProgress(null);
  };

  return (
    <div className="progress-list">
      <h2>Learning Progress</h2>
      
      <ProgressForm 
        onSubmit={editingProgress ? 
          (progress) => handleUpdateProgress(editingProgress.progressId!, progress) : 
          handleAddProgress
        }
        initialData={editingProgress}
        onCancel={editingProgress ? cancelEditing : undefined}
      />
      
      {isLoading ? (
        <p>Loading progress data...</p>
      ) : progressItems.length === 0 ? (
        <p>No progress items found. Start tracking your learning!</p>
      ) : (
        <div className="progress-items">
          {progressItems.map(progress => (
            <ProgressItem 
              key={progress.progressId} 
              progress={progress}
              onEdit={() => startEditing(progress)}
              onDelete={() => handleDeleteProgress(progress.progressId!)}
              onUpdate={handleProgressItemUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProgressList; 