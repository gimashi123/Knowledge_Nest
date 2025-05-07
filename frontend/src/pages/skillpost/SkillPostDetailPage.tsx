import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { SkillPostForm } from '@/components/skillpost/SkillPostForm';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { ArrowLeftIcon, HeartIcon, MessageCircleIcon, Share2Icon, EditIcon, TrashIcon, Edit2Icon, YoutubeIcon } from 'lucide-react';
import { SkillPost, SkillPostRequest, CommentRequest } from '@/types/skillpost';
import { SkillPostService } from '@/services/skillPostService';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { extractYoutubeVideoId, getYoutubeEmbedUrl } from '@/utils/youtubeUtils';

export default function SkillPostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [post, setPost] = useState<SkillPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [comment, setComment] = useState('');
  const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);
  const [editCommentContent, setEditCommentContent] = useState("");
  const [isEditingComment, setIsEditingComment] = useState(false);

  const fetchPost = async () => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      const fetchedPost = await SkillPostService.getById(id);
      
      if (!fetchedPost) {
        console.error('Fetched post is null or undefined');
        toast.error('Failed to load post data');
        navigate('/skill-posts');
        return;
      }
      
      setPost(fetchedPost);
      
      const likedBy = fetchedPost.likedBy || [];
      const currentUserId = currentUser?.id || currentUser?.email || '';
      
      setIsLiked(currentUserId ? likedBy.includes(currentUserId) : false);
      setLikesCount(fetchedPost.likes || 0);
    } catch (error) {
      console.error('Error fetching post:', error);
      toast.error('Failed to load post');
      navigate('/skill-posts');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  const handleEditPost = async (data: SkillPostRequest) => {
    if (!post || !id) return;
    
    setIsSubmitting(true);
    try {
      const updatedPost = await SkillPostService.update(id, data);
      setPost(updatedPost);
      setIsEditDialogOpen(false);
      toast.success('Post updated successfully!');
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error('Failed to update post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async () => {
    if (!id) return;
    
    try {
      await SkillPostService.delete(id);
      toast.success('Post deleted successfully!');
      navigate('/skill-posts');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  const handleLike = async () => {
    if (!id || !currentUser) return;
    
    try {
      const updatedPost = await SkillPostService.toggleLike(id);
      
      // Add safe null checks when accessing properties
      const likedBy = updatedPost.likedBy || [];
      const currentUserId = currentUser.id || currentUser.email || '';
      
      setIsLiked(likedBy.includes(currentUserId));
      setLikesCount(updatedPost.likes || 0);
      setPost(updatedPost);
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to like post');
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !comment.trim()) return;
    
    setIsCommentSubmitting(true);
    try {
      const commentRequest: CommentRequest = { content: comment.trim() };
      const updatedPost = await SkillPostService.addComment(id, commentRequest);
      setPost(updatedPost);
      setComment('');
      toast.success('Comment added successfully!');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    } finally {
      setIsCommentSubmitting(false);
    }
  };

  const handleEditComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !editingCommentId || !editCommentContent.trim()) return;
    
    setIsEditingComment(true);
    try {
      const commentRequest: CommentRequest = { content: editCommentContent.trim() };
      const updatedPost = await SkillPostService.updateComment(id, editingCommentId, commentRequest);
      setPost(updatedPost);
      setEditingCommentId(null);
      setEditCommentContent("");
      toast.success('Comment updated successfully!');
    } catch (error) {
      console.error('Error updating comment:', error);
      toast.error('Failed to update comment');
    } finally {
      setIsEditingComment(false);
    }
  };

  const handleDeleteComment = async () => {
    if (!id || !deletingCommentId) return;
    
    try {
      const updatedPost = await SkillPostService.deleteComment(id, deletingCommentId);
      setPost(updatedPost);
      setDeletingCommentId(null);
      toast.success('Comment deleted successfully!');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
    }
  };

  const startEditComment = (commentId: string, currentContent: string) => {
    setEditingCommentId(commentId);
    setEditCommentContent(currentContent);
  };

  const isOwner = post?.userId === currentUser?.id;

  // Safe render helper for content
  const renderContent = () => {
    if (!post || !post.content) return <p className="text-muted-foreground">No content available</p>;
    
    return post.content.split('\n').map((paragraph, index) => (
      paragraph ? <p key={index}>{paragraph}</p> : null
    ));
  };

  // Helper to render YouTube video if present
  const renderYoutubeVideo = () => {
    if (!post || !post.youtubeUrl) return null;
    
    const videoId = extractYoutubeVideoId(post.youtubeUrl);
    if (!videoId) return null;
    
    const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
    
    return (
      <div className="my-6">
        <div className="relative w-full pt-[56.25%] rounded-lg overflow-hidden shadow-lg">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={embedUrl}
            title="YouTube video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <div className="mt-2 flex items-center text-sm text-muted-foreground">
          <YoutubeIcon className="h-4 w-4 mr-1 text-red-500" />
          <a 
            href={post.youtubeUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-primary hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            Watch on YouTube
          </a>
        </div>
      </div>
    );
  };

  // Safe render helper for tags
  const renderTags = () => {
    if (!post) return null;
    
    const tags = post.tags || [];
    if (tags.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-2 pt-4">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary">
            #{tag}
          </Badge>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="h-[600px] w-full rounded-lg bg-muted animate-pulse" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto py-6 text-center">
        <h2 className="text-2xl font-bold">Post not found</h2>
        <Button onClick={() => navigate('/skill-posts')} className="mt-4">
          Back to Skill Posts
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <Button 
        onClick={() => navigate('/skill-posts')} 
        variant="ghost" 
        className="mb-6 flex items-center gap-2"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back to Posts
      </Button>
      
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-3xl font-bold">{post.title}</CardTitle>
              <CardDescription className="mt-2 flex items-center text-sm">
                <div className="flex items-center">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarFallback>{post.userName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">@{post.userName}</span>
                </div>
                <span className="mx-2">•</span>
                <span>
                  {post.createdAt ? format(new Date(post.createdAt), 'MMM d, yyyy') : 'Unknown date'}
                </span>
                {post.youtubeUrl && (
                  <>
                    <span className="mx-2">•</span>
                    <div className="flex items-center text-red-500">
                      <YoutubeIcon className="h-4 w-4 mr-1" />
                      <span>YouTube</span>
                    </div>
                  </>
                )}
              </CardDescription>
            </div>
            
            {isOwner && (
              <div className="flex space-x-2">
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <EditIcon className="h-4 w-4" />
                      <span>Edit</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <SkillPostForm
                      post={post}
                      onSubmit={handleEditPost}
                      onCancel={() => setIsEditDialogOpen(false)}
                      isSubmitting={isSubmitting}
                    />
                  </DialogContent>
                </Dialog>
                
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => setShowDeleteAlert(true)}
                >
                  <TrashIcon className="h-4 w-4" />
                  <span>Delete</span>
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {renderYoutubeVideo()}
          
          <div className="space-y-4 prose prose-sm max-w-none">
            {renderContent()}
          </div>
          
          {renderTags()}
        </CardContent>
        
        <CardFooter className="flex justify-between py-4 border-t">
          <div className="flex space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`flex items-center gap-1 ${isLiked ? 'text-red-500' : ''}`}
              onClick={handleLike}
            >
              <HeartIcon className="h-4 w-4" fill={isLiked ? "currentColor" : "none"} />
              <span>{likesCount}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={() => document.getElementById('comments-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <MessageCircleIcon className="h-4 w-4" />
              <span>{post.comments.length}</span>
            </Button>
          </div>
          
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <Share2Icon className="h-4 w-4" />
            <span>Share</span>
          </Button>
        </CardFooter>
      </Card>
      
      <div id="comments-section" className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Comments ({post.comments.length})</h2>
        
        <form onSubmit={handleAddComment} className="mb-6">
          <Textarea
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="mb-2"
          />
          <Button 
            type="submit" 
            disabled={!comment.trim() || isCommentSubmitting}
            className="ml-auto"
          >
            {isCommentSubmitting ? 'Posting...' : 'Post Comment'}
          </Button>
        </form>
        
        {post.comments.length > 0 ? (
          <div className="space-y-4">
            {post.comments.map((comment) => (
              <Card key={comment.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarFallback>{comment.userName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">@{comment.userName}</p>
                        <p className="text-xs text-muted-foreground">
                          {comment.createdAt ? format(new Date(comment.createdAt), 'MMM d, yyyy • h:mm a') : 'Recently'}
                        </p>
                      </div>
                    </div>
                    
                    {/* Add edit/delete buttons for comment owner */}
                    {comment.userId === currentUser?.id && (
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => startEditComment(comment.id, comment.content)}
                        >
                          <Edit2Icon className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-destructive"
                          onClick={() => setDeletingCommentId(comment.id)}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {editingCommentId === comment.id ? (
                    <form onSubmit={handleEditComment} className="space-y-2">
                      <Textarea
                        value={editCommentContent}
                        onChange={(e) => setEditCommentContent(e.target.value)}
                        className="w-full"
                      />
                      <div className="flex justify-end space-x-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setEditingCommentId(null)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit"
                          disabled={!editCommentContent.trim() || isEditingComment}
                        >
                          {isEditingComment ? 'Saving...' : 'Save'}
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <p>{comment.content}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">No comments yet. Be the first to comment!</p>
        )}
      </div>
      
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeletePost} 
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add comment deletion confirmation dialog */}
      <AlertDialog open={!!deletingCommentId} onOpenChange={(open) => !open && setDeletingCommentId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Comment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this comment? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteComment} 
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}