import { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import SkillPostsPage from '@/pages/skillpost/SkillPostsPage';
import { AdminSidebar } from '@/components/sidebar/AdminSidebar';
import SkillPostDetailPage from '@/pages/skillpost/SkillPostDetailPage';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon } from 'lucide-react';

export default function AdminPostsPage() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get id from URL params directly
  
  // Handle back navigation
  const handleBack = () => {
    navigate('/admin/posts');
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <main className="flex-1 ml-[220px] p-8">
        <div className="max-w-6xl mx-auto">
          {id ? (
            <div>
              <Button 
                onClick={handleBack}
                variant="ghost"
                className="mb-6 flex items-center gap-2"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Back to Posts
              </Button>
              <SkillPostDetailPage />
            </div>
          ) : (
            <SkillPostsPage adminView={true} />
          )}
        </div>
      </main>
    </div>
  );
} 