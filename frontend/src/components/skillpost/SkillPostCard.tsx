import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HeartIcon, MessageCircleIcon, Share2Icon, MoreHorizontalIcon, Calendar } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SkillPost } from "@/types/skillpost";
import { SkillPostService } from "@/services/skillPostService";
import { formatDistanceToNow } from 'date-fns';

interface SkillPostCardProps {
  post: SkillPost;
  onEdit: (post: SkillPost) => void;
  onDelete: (id: string) => void;
  currentUserId: string;
  adminView?: boolean;
}

export function SkillPostCard({ post, onEdit, onDelete, currentUserId, adminView = false }: SkillPostCardProps) {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(post.likedBy.includes(currentUserId));
  const [likesCount, setLikesCount] = useState(post.likes);
  
  const isOwner = post.userId === currentUserId;
  
  const formattedDate = post.createdAt ? 
    formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) : 
    'recently';
  
  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when liking
    try {
      const updatedPost = await SkillPostService.toggleLike(post.id);
      setIsLiked(updatedPost.likedBy.includes(currentUserId));
      setLikesCount(updatedPost.likes);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleCardClick = () => {
    if (adminView) {
      navigate(`/admin/posts/${post.id}`);
    } else {
      navigate(`/skill-posts/${post.id}`);
    }
  };
  
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking edit
    onEdit(post);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking delete
    onDelete(post.id);
  };
  
  return (
    <Card 
      className="w-full hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold">{post.title}</CardTitle>
            <CardDescription className="flex items-center mt-1 text-sm text-muted-foreground">
              <span>@{post.userName}</span>
              <span className="mx-2">•</span>
              <Calendar className="h-3 w-3 mr-1" />
              <span>{formattedDate}</span>
            </CardDescription>
          </div>
          
          {isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={(e) => e.stopPropagation()} // Prevent card click when opening dropdown
                >
                  <MoreHorizontalIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                <DropdownMenuItem onClick={handleEditClick}>Edit</DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-destructive focus:text-destructive"
                  onClick={handleDeleteClick}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{post.description}</p>
        <div className="line-clamp-3 text-sm mb-4">{post.content}</div>
        
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2 border-t">
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
          
          <Button variant="ghost" size="sm" className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <MessageCircleIcon className="h-4 w-4" />
            <span>{post.comments.length}</span>
          </Button>
        </div>
        
        <Button variant="ghost" size="sm" className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <Share2Icon className="h-4 w-4" />
          <span>Share</span>
        </Button>
      </CardFooter>
    </Card>
  );
} 