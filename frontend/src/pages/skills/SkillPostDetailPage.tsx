import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SkillPostCard } from "@/components/SkillPostCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { deleteSkillPost, getSkillPostById, addComment } from "@/services/skillPostService";

interface SkillPost {
  id: string;
  title: string;
  description: string;
  content: string;
  userId: string;
  userName: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  likes: number;
  comments: {
    id: string;
    userId: string;
    userName: string;
    content: string;
    createdAt: string;
  }[];
}

export default function SkillPostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<SkillPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get current user from localStorage (simplified for demo)
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const isOwner = post?.userId === currentUser?.id;

  const loadPost = async () => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      const response = await getSkillPostById(id);
      setPost(response.data);
    } catch (error) {
      toast.error("Failed to load the post");
      navigate("/skills");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPost();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    
    try {
      await deleteSkillPost(id);
      toast.success("Post deleted successfully");
      navigate("/skills");
    } catch (error) {
      toast.error("Failed to delete the post");
    }
  };

  const handleAddComment = async () => {
    if (!id || !commentText.trim()) return;
    
    setIsSubmitting(true);
    try {
      const updatedPost = await addComment(id, commentText);
      setPost(updatedPost);
      setCommentText("");
      toast.success("Comment added successfully");
    } catch (error) {
      toast.error("Failed to add comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate("/skills")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        
        <div className="space-y-8">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container py-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Post not found</h2>
        <p className="text-muted-foreground mb-4">
          The post you're looking for doesn't exist or has been removed
        </p>
        <Button onClick={() => navigate("/skills")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/skills")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Skills
        </Button>
        
        {isOwner && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate(`/skills/edit/${id}`)}
            >
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your
                    skill post and all associated data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>

      <div className="mb-8">
        <SkillPostCard post={post} isDetailed />
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Comments</h3>
        
        <Card className="mb-6">
          <CardContent className="pt-6">
            <Textarea
              placeholder="Add your comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={3}
              className="mb-4"
            />
            <div className="flex justify-end">
              <Button 
                onClick={handleAddComment} 
                disabled={!commentText.trim() || isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Add Comment"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {post.comments.length > 0 ? (
          <div className="space-y-4">
            {post.comments.map((comment) => (
              <Card key={comment.id}>
                <CardContent className="pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{comment.userName}</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p>{comment.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No comments yet. Be the first to comment!
          </div>
        )}
      </div>
    </div>
  );
} 