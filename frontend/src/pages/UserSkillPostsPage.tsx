import { useNavigate, useParams } from 'react-router-dom';
import { UserSidebar } from '@/components/sidebar/UserSidebar';
import SkillPostsPage from '@/pages/skillpost/SkillPostsPage';
import SkillPostDetailPage from '@/pages/skillpost/SkillPostDetailPage';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, BookOpen, Search, Filter, PlusCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function UserSkillPostsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Handle back navigation
  const handleBack = () => {
    navigate('/skill-posts');
  };

  // This is just for UI demonstration - actual search would be handled by SkillPostsPage
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search query:', searchQuery);
    // The actual search functionality is in SkillPostsPage component
  };

  return (
    <div className="flex min-h-screen bg-background">
      <UserSidebar />

      <main className="flex-1 ml-[220px] p-8">
        <div className="max-w-6xl mx-auto">
          {id ? (
            <div>
              <Button 
                onClick={handleBack}
                variant="ghost"
                className="mb-6 flex items-center gap-2 hover:bg-secondary/80"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Back to Resources
              </Button>
              <SkillPostDetailPage />
            </div>
          ) : (
            <div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                  <h1 className="text-3xl font-bold flex items-center">
                    <BookOpen className="h-7 w-7 mr-3 text-primary" />
                    Learning Resources
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Discover and share knowledge with the community
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <form onSubmit={handleSearch} className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search resources..."
                      className="pl-9 w-full"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </form>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" title="Filter">
                      <Filter className="h-4 w-4" />
                    </Button>
                    <Button className="whitespace-nowrap">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Create Post
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-primary/5 hover:bg-primary/10 cursor-pointer">
                    All Posts
                  </Badge>
                  <Badge variant="outline" className="hover:bg-secondary cursor-pointer">
                    My Posts
                  </Badge>
                  <Badge variant="outline" className="hover:bg-secondary cursor-pointer">
                    Trending
                  </Badge>
                  <Badge variant="outline" className="hover:bg-secondary cursor-pointer">
                    #programming
                  </Badge>
                  <Badge variant="outline" className="hover:bg-secondary cursor-pointer">
                    #design
                  </Badge>
                </div>
              </div>
              
              <Card className="mb-6 border-none shadow-none bg-secondary/30">
                <CardContent className="p-4">
                  <p className="text-sm">
                    <span className="font-medium">Pro Tip:</span> Use tags to filter content and find exactly what you're looking for. Create your own posts to share knowledge with others.
                  </p>
                </CardContent>
              </Card>
              
              <SkillPostsPage adminView={false} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}