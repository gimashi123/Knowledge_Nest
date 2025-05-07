import { useNavigate, useParams } from 'react-router-dom';
import { UserSidebar } from '@/components/sidebar/UserSidebar';
import SkillPostsPage from '@/pages/skillpost/SkillPostsPage';
import SkillPostDetailPage from '@/pages/skillpost/SkillPostDetailPage';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon } from 'lucide-react';

export default function UserSkillPostsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Handle back navigation
  const handleBack = () => {
    navigate('/skill-posts');
  };

  return (
    <div className="flex min-h-screen">
      <UserSidebar />

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
                Back to Resources
              </Button>
              <SkillPostDetailPage />
            </div>
          ) : (
            <div>
              <h1 className="text-3xl font-bold mb-6">Learning Resources</h1>
              <SkillPostsPage adminView={false} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 