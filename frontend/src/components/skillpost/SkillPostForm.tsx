import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SkillPost, SkillPostRequest } from "@/types/skillpost";
import { X } from "lucide-react";

interface SkillPostFormProps {
  post?: SkillPost;
  onSubmit: (data: SkillPostRequest) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function SkillPostForm({ post, onSubmit, onCancel, isSubmitting }: SkillPostFormProps) {
  const [tags, setTags] = useState<string[]>(post?.tags || []);
  const [tagInput, setTagInput] = useState("");
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<SkillPostRequest>({
    defaultValues: post ? {
      title: post.title,
      description: post.description,
      content: post.content,
      tags: post.tags,
    } : {
      title: "",
      description: "",
      content: "",
      tags: [],
    },
  });

  useEffect(() => {
    if (post) {
      reset({
        title: post.title,
        description: post.description,
        content: post.content,
        tags: post.tags,
      });
      setTags(post.tags);
    }
  }, [post, reset]);

  const handleFormSubmit = (data: SkillPostRequest) => {
    const formData = {
      ...data,
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{post ? "Edit" : "Create"} Skill Post</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <CardContent className="space-y-4">
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
              placeholder="Brief description of your post"
              {...register("description", { required: "Description is required" })}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
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
        
        <CardFooter className="flex justify-between">
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