import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SkillPost, SkillPostRequest } from "@/types/skillpost";
import { X } from "lucide-react";
import { extractYoutubeVideoId,isYoutubeUrl } from "@/utils/youtubeUtils";

interface SkillPostFormProps {
  post?: SkillPost;
  onSubmit: (data: SkillPostRequest) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function SkillPostForm({ post, onSubmit, onCancel, isSubmitting }: SkillPostFormProps) {
  const [tags, setTags] = useState<string[]>(post?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState<string>(post?.youtubeUrl || "");
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<SkillPostRequest>({
    defaultValues: post ? {
      title: post.title,
      description: post.description,
      content: post.content,
      youtubeUrl: post.youtubeUrl,
      tags: post.tags,
    } : {
      title: "",
      description: "",
      content: "",
      youtubeUrl: "",
      tags: [],
    },
  });

  useEffect(() => {
    if (post) {
      reset({
        title: post.title,
        description: post.description,
        content: post.content,
        youtubeUrl: post.youtubeUrl,
        tags: post.tags,
      });
      setTags(post.tags);
      setYoutubeUrl(post.youtubeUrl || "");
      updateThumbnail(post.youtubeUrl || "");
    }
  }, [post, reset]);

  const updateThumbnail = (url: string) => {
    const videoId = extractYoutubeVideoId(url);
    if (videoId) {
      setThumbnailUrl(`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`);
    } else {
      setThumbnailUrl(null);
    }
  };

  const handleYoutubeUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setYoutubeUrl(url);
    updateThumbnail(url);
  };

  const handleFormSubmit = (data: SkillPostRequest) => {
    const formData = {
      ...data,
      youtubeUrl: youtubeUrl,
      tags,
    };
    onSubmit(formData);
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
    }
    setTagInput("");
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
      <Card className="w-full flex flex-col">
        <CardHeader>
          <CardTitle>{post ? "Edit" : "Create"} Skill Post</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex-1 flex flex-col">
          <CardContent className="space-y-4 flex-1 overflow-y-auto max-h-[70vh]">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                  id="title"
                  placeholder="Enter a title for your post"
                  {...register("title", { required: "Title is required" })}
              />
              {errors.title && (
                  <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                  id="description"
                  placeholder="Brief description of your post (min 10 characters)"
                  {...register("description", {
                    required: "Description is required",
                    minLength: {
                      value: 10,
                      message: "Description must be at least 10 characters long"
                    },
                    maxLength: {
                      value: 500,
                      message: "Description must be less than 500 characters"
                    }
                  })}
              />
              {errors.description && (
                  <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="youtubeUrl">YouTube Video URL (optional)</Label>
              <Input
                  id="youtubeUrl"
                  placeholder="Paste YouTube video URL here"
                  value={youtubeUrl}
                  onChange={handleYoutubeUrlChange}
              />
              {youtubeUrl && !isYoutubeUrl(youtubeUrl) && (
                  <p className="text-sm text-destructive">Please enter a valid YouTube URL</p>
              )}
              {thumbnailUrl && (
                  <div className="mt-3 relative">
                    <img
                        src={thumbnailUrl}
                        alt="YouTube Thumbnail"
                        className="w-full h-auto rounded-md"
                        onError={(e) => {
                          console.error('Thumbnail failed to load:', thumbnailUrl);
                          e.currentTarget.onerror = null;
                          const videoId = extractYoutubeVideoId(youtubeUrl);
                          if (videoId) {
                            e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/default.jpg`;
                          }
                        }}
                    />
                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                      <div className="w-12 h-12 flex items-center justify-center bg-red-600/90 rounded-full">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                    <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 bg-black/50 hover:bg-black/70"
                        onClick={() => {
                          setYoutubeUrl("");
                          setThumbnailUrl(null);
                        }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                  id="content"
                  rows={10}
                  placeholder="Share your knowledge or skill here..."
                  {...register("content", { required: "Content is required" })}
                  className="resize-none"
              />
              {errors.content && (
                  <p className="text-sm text-destructive">{errors.content.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="flex items-center gap-2">
                <Input
                    id="tagInput"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder="Add a tag and press Enter"
                />
                <Button type="button" onClick={addTag} variant="secondary">
                  Add
                </Button>
              </div>
              {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag) => (
                        <div
                            key={tag}
                            className="flex items-center px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                        >
                          #{tag}
                          <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 ml-1 p-0"
                              onClick={() => removeTag(tag)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                    ))}
                  </div>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex justify-between border-t pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : post ? "Update" : "Create"}
            </Button>
          </CardFooter>
        </form>
      </Card>
  );
}