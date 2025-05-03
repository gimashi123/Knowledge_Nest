import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { SkillPostCard } from '@/components/skillpost/SkillPostCard';
import { SkillPostForm } from '@/components/skillpost/SkillPostForm';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { PlusIcon, SearchIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { SkillPost, SkillPostRequest } from '@/types/skillpost';
import { SkillPostService } from '@/services/skillPostService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { toast } from 'sonner';
import { ErrorBoundary } from 'react-error-boundary';

interface SkillPostsPageProps {
  adminView?: boolean;
}

// Helper to safely get user ID
const getUserId = (user: any): string => {
  if (!user) return '';

  // When user object is available, log it for debugging
  if (user) {
    console.log('Current user object:', user);
  }
  
  // Check for different potential ID fields
  if (typeof user === 'object' && user !== null) {
    // First try actual ID if available (this would be the MongoDB ObjectId)
    if ('id' in user && user.id) {
      console.log('Using user.id as userId:', user.id);
      return String(user.id);
    }
    
    // Next try MongoDB's _id format
    if ('_id' in user && user._id) {
      console.log('Using user._id as userId:', user._id);
      return String(user._id);
    }
    
    // Finally fall back to email if that's all we have
    // This works with the current backend implementation
    if ('email' in user && user.email) {
      console.log('Using user.email as userId:', user.email);
      return String(user.email);
    }
  }
  
  console.warn('No valid user ID found in user object:', user);
  return '';
};

export default function SkillPostsPage({ adminView = false }: SkillPostsPageProps) {
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<SkillPost[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingPost, setEditingPost] = useState<SkillPost | null>(null);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const userId = getUserId(currentUser);
  
  // For debugging user ID issues
  useEffect(() => {
    console.log('Current user ID:', userId);
  }, [userId]);

  const fetchPosts = async (page = 0, tab = activeTab) => {
    setIsLoading(true);
    try {
      let response;
      
      console.log('Fetching posts for tab:', tab, 'User ID:', userId);
      
      switch (tab) {
        case 'trending':
          response = await SkillPostService.getTrending(page);
          break;
        case 'my-posts':
          if (userId) {
            console.log('Fetching my posts with userId:', userId);
            response = await SkillPostService.getByUser(userId, page);
            console.log('My posts response:', response);
          } else {
            // If no user is logged in, show empty result
            response = { content: [], totalPages: 0, totalElements: 0, number: 0, size: 10 };
            toast.error('Please log in to view your posts');
          }
          break;
        case 'search':
          if (searchQuery.trim()) {
            response = await SkillPostService.search(searchQuery, page);
          } else {
            response = await SkillPostService.getAll(page);
          }
          break;
        default: // 'all'
          response = await SkillPostService.getAll(page);
      }
      
      setPosts(response.content);
      setTotalPages(response.totalPages);
      setCurrentPage(response.number);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(0, activeTab);
  }, [activeTab, userId]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(0);
    fetchPosts(0, tab);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchPosts(page);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveTab('search');
    setCurrentPage(0);
    fetchPosts(0, 'search');
  };

  const handleCreatePost = async (data: SkillPostRequest) => {
    setIsSubmitting(true);
    try {
      console.log('Submitting post data:', data);
      
      // Ensure all required fields are present
      if (!data.title || !data.description || !data.content || !data.tags || data.tags.length === 0) {
        toast.error('Please fill in all required fields');
        setIsSubmitting(false);
        return;
      }
      
      // Enforce description length requirements
      if (data.description.length < 10) {
        toast.error('Description must be at least 10 characters long');
        setIsSubmitting(false);
        return;
      }
      
      const createdPost = await SkillPostService.create(data);
      console.log('Post created successfully:', createdPost);
      
      toast.success('Post created successfully!');
      setIsFormOpen(false);
      
      // Switch to My Posts tab and refresh posts
      setActiveTab('my-posts');
      fetchPosts(0, 'my-posts');
    } catch (error: any) {
      console.error('Error creating post:', error);
      
      // Show more specific error message based on the error
      if (error.message && error.message.includes('Description must be')) {
        toast.error(error.message);
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to create post: ' + (error.message || 'Unknown error'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdatePost = async (data: SkillPostRequest) => {
    if (!editingPost) return;
    
    setIsSubmitting(true);
    try {
      await SkillPostService.update(editingPost.id, data);
      toast.success('Post updated successfully!');
      setIsFormOpen(false);
      setEditingPost(null);
      fetchPosts(currentPage);
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error('Failed to update post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async () => {
    if (!deletingPostId) return;
    
    try {
      await SkillPostService.delete(deletingPostId);
      toast.success('Post deleted successfully!');
      fetchPosts(currentPage);
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    } finally {
      setDeletingPostId(null);
    }
  };

  const openEditDialog = (post: SkillPost) => {
    setEditingPost(post);
    setIsFormOpen(true);
  };

  const closeDialog = () => {
    setIsFormOpen(false);
    setEditingPost(null);
  };

  // Function to render the post content based on loading state and available posts
  const renderPostContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      );
    } 
    
    if (!posts) {
      console.error('Posts array is undefined');
      return (
        <div className="text-center p-8">
          <h3 className="text-xl font-medium">Error loading posts</h3>
          <p className="text-muted-foreground mt-2">
            There was an error loading the posts. Please try again.
          </p>
          <Button onClick={() => fetchPosts(currentPage)} className="mt-4">
            Retry
          </Button>
        </div>
      );
    }
    
    if (posts.length > 0) {
      try {
        // Validate posts before rendering to catch errors
        const validPosts = posts.filter(post => {
          // Check if post has all required fields
          const isValid = post && 
            typeof post === 'object' && 
            post.id && 
            post.title && 
            post.description;
          
          if (!isValid) {
            console.error('Invalid post object detected:', post);
          }
          
          return isValid;
        });
        
        if (validPosts.length === 0) {
          return (
            <div className="text-center p-8">
              <h3 className="text-xl font-medium">No valid posts found</h3>
              <p className="text-muted-foreground mt-2">
                There was an issue with the post data. Please try refreshing.
              </p>
            </div>
          );
        }
        
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {validPosts.map((post) => (
              <ErrorBoundary
                key={post.id}
                fallback={
                  <div className="border p-4 rounded-lg shadow-sm">
                    <p className="text-destructive">Error rendering this post</p>
                  </div>
                }
              >
                <SkillPostCard
                  key={post.id}
                  post={post}
                  onEdit={openEditDialog}
                  onDelete={(id) => setDeletingPostId(id)}
                  currentUserId={userId}
                  adminView={adminView}
                />
              </ErrorBoundary>
            ))}
          </div>
        );
      } catch (error) {
        console.error('Error rendering posts:', error);
        return (
          <div className="text-center p-8">
            <h3 className="text-xl font-medium">Error rendering posts</h3>
            <p className="text-muted-foreground mt-2">
              There was an error displaying the posts. Please try again.
            </p>
          </div>
        );
      }
    }
    
    return (
      <div className="text-center p-8">
        <h3 className="text-xl font-medium">No posts found</h3>
        <p className="text-muted-foreground mt-2">
          {activeTab === 'my-posts'
            ? "You haven't created any posts yet."
            : activeTab === 'search'
            ? "No results found for your search."
            : "There are no posts available."}
        </p>
        {activeTab === 'my-posts' && (
          <Button onClick={() => setIsFormOpen(true)} className="mt-4">
            Create Your First Post
          </Button>
        )}
      </div>
    );
  };

  // Custom pagination component
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    // Generate pagination items
    const renderPaginationItems = () => {
      const items = [];
      const maxItems = Math.min(5, totalPages);
      
      // Calculate start and end page numbers
      let startPage = Math.max(0, currentPage - Math.floor(maxItems / 2));
      let endPage = Math.min(totalPages - 1, startPage + maxItems - 1);
      
      // Adjust if we're at the end
      if (endPage - startPage + 1 < maxItems) {
        startPage = Math.max(0, endPage - maxItems + 1);
      }
      
      // Generate items
      for (let i = startPage; i <= endPage; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink 
              href="#" 
              isActive={i === currentPage}
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(i);
              }}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        );
      }
      
      return items;
    };

    return (
      <div className="flex justify-center mt-6">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 0) handlePageChange(currentPage - 1);
                }}
              />
            </PaginationItem>
            
            {renderPaginationItems()}
            
            <PaginationItem>
              <PaginationNext 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages - 1) handlePageChange(currentPage + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{adminView ? 'Manage Skill Posts' : 'Skill Posts'}</h1>
        
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusIcon className="h-4 w-4" />
              <span>Create Post</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogTitle>{editingPost ? 'Edit Skill Post' : 'Create New Skill Post'}</DialogTitle>
            <DialogDescription>
              {editingPost 
                ? 'Update your skill post details below.' 
                : 'Share your knowledge with the community by creating a new skill post.'}
            </DialogDescription>
            <SkillPostForm
              post={editingPost || undefined}
              onSubmit={editingPost ? handleUpdatePost : handleCreatePost}
              onCancel={closeDialog}
              isSubmitting={isSubmitting}
            />
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Search form outside of Tabs */}
      <div className="flex justify-end mb-4">
        <form onSubmit={handleSearch} className="flex w-full md:w-auto">
          <Input
            placeholder="Search skill posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-[300px]"
          />
          <Button type="submit" variant="secondary" className="ml-2">
            <SearchIcon className="h-4 w-4" />
          </Button>
        </form>
      </div>
      
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Posts</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="my-posts">My Posts</TabsTrigger>
        </TabsList>
          
        {/* Content for each tab */}
        <TabsContent value="all" className="mt-0">
          {renderPostContent()}
        </TabsContent>
        
        <TabsContent value="trending" className="mt-0">
          {renderPostContent()}
        </TabsContent>
        
        <TabsContent value="my-posts" className="mt-0">
          {renderPostContent()}
        </TabsContent>
        
        <TabsContent value="search" className="mt-0">
          {renderPostContent()}
        </TabsContent>
      </Tabs>
      
      {renderPagination()}
      
      <AlertDialog open={!!deletingPostId} onOpenChange={(open) => !open && setDeletingPostId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePost} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 