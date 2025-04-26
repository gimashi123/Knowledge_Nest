import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, MessageCircle, Share2, Clock, User } from "lucide-react";
import { format } from "date-fns";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toggleLike } from "@/services/skillPostService";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SkillPostCardProps {
  post: {
    id: string;
    title: string;
    description: string;
    tags: string[];
    createdAt: string;
    userName: string;
    userId: string;
    likes: number;
    comments: any[];
    content?: string;
  };
  isDetailed?: boolean;
}

export function SkillPostCard({ post, isDetailed = false }: SkillPostCardProps) {
  const navigate = useNavigate();
  const [likes, setLikes] = useState(post.likes);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = async () => {
    try {
      await toggleLike(post.id);
      setLikes(isLiked ? likes - 1 : likes + 1);
      setIsLiked(!isLiked);
    } catch (error) {
      toast.error("Failed to like the post");
    }
  };

  const handleCardClick = () => {
    if (!isDetailed) {
      navigate(`/skills/${post.id}`);
    }
  };

  return (
    <Card className={cn(
      "w-full", 
      !isDetailed && "hover:shadow-md cursor-pointer transition-shadow"
    )}>
      <CardHeader className="p-4 pb-0" onClick={handleCardClick}>
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold line-clamp-2">{post.title}</h3>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
          {post.description}
        </p>
      </CardHeader>
      <CardContent className="p-4" onClick={handleCardClick}>
        {isDetailed && post.content && (
          <div className="prose prose-sm max-w-none mt-2">
            {post.content}
          </div>
        )}
        <div className="flex flex-wrap gap-2 mt-2">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-col space-y-2">
        <div className="flex justify-between items-center w-full text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <User className="h-3 w-3" />
            <span>{post.userName}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>{format(new Date(post.createdAt), 'MMM d, yyyy')}</span>
          </div>
        </div>
        <div className="flex justify-between items-center w-full">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-1 px-2"
            onClick={handleLike}
          >
            <Heart
              className={cn("h-4 w-4", isLiked && "fill-red-500 text-red-500")}
            />
            <span>{likes}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-1 px-2"
          >
            <MessageCircle className="h-4 w-4" />
            <span>{post.comments.length}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-1 px-2"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
} 