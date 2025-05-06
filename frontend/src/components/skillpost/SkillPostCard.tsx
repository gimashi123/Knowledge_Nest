import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HeartIcon, MessageCircleIcon, Share2Icon, MoreHorizontalIcon, Calendar, YoutubeIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SkillPost } from "@/types/skillpost";
import { SkillPostService } from "@/services/skillPostService";
import { formatDistanceToNow } from 'date-fns';
import { extractYoutubeVideoId, getYoutubeThumbnailUrl } from "@/utils/youtubeUtils";

interface SkillPostCardProps {
  post: SkillPost;
  onEdit: (post: SkillPost) => void;
  onDelete: (id: string) => void;
  currentUserId: string;
  adminView?: boolean;
}

export function SkillPostCard({ post, onEdit, onDelete, currentUserId, adminView = false }: SkillPostCardProps) {
  const navigate = useNavigate();
  
  // Safe check for likedBy array - if it's undefined or null, default to an empty array
  const likedBy = post.likedBy || [];
  
  // Safe check for currentUserId being valid before checking includes
  const [isLiked, setIsLiked] = useState(
    currentUserId ? likedBy.includes(currentUserId) : false
  );
  
  const [likesCount, setLikesCount] = useState(post.likes || 0);
  
  // Safe check for userId comparison
  const isOwner = currentUserId && post.userId === currentUserId;
  
  const formattedDate = post.createdAt ? 
    formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) : 
    'recently';
  
  // Get YouTube thumbnail if available
  const videoId = extractYoutubeVideoId(post.youtubeUrl);
  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
  
  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when liking
    
    // Don't allow likes if there's no current user
    if (!currentUserId) return;
    
    try {
      const updatedPost = await SkillPostService.toggleLike(post.id);
      // Safe check when updating like status
      setIsLiked(updatedPost.likedBy ? updatedPost.likedBy.includes(currentUserId) : false);
      setLikesCount(updatedPost.likes || 0);
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
      {/* Display YouTube thumbnail if available */}
      {thumbnailUrl && (
        <div className="relative aspect-video overflow-hidden rounded-t-lg">
          <img 
            src={thumbnailUrl} 
            alt="YouTube Video Thumbnail" 
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error('Thumbnail failed to load:', thumbnailUrl);
              e.currentTarget.onerror = null;
              // Try default quality if high quality fails
              e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/default.jpg`;
            }}
          />
          <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-colors duration-200">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 flex items-center justify-center bg-red-600 rounded-full">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}
    
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
        
        {(post.tags && post.tags.length > 0) && (
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
            <span>{post.comments?.length || 0}</span>
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