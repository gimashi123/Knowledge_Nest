import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SkillPostCard } from "@/components/SkillPostCard";
import { getSkillPosts, getTrendingSkillPosts } from "@/services/skillPostService";
import { Skeleton } from "@/components/ui/skeleton";

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
  comments: any[];
}

interface PaginatedResponse {
  posts: SkillPost[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
  pageSize: number;
}

export default function SkillPostsPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [posts, setPosts] = useState<SkillPost[]>([]);
  const [trendingPosts, setTrendingPosts] = useState<SkillPost[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalItems: 0,
    totalPages: 0,
    pageSize: 10,
  });

  const loadPosts = async (page = 0, searchTerm = keyword) => {
    setIsLoading(true);
    try {
      const params = {
        page,
        size: 10,
        sortBy: "createdAt",
        sortDir: "desc",
        keyword: searchTerm,
      };
      
      const response = await getSkillPosts(params);
      const data = response.data as PaginatedResponse;
      
      setPosts(data.posts);
      setPagination({
        currentPage: data.currentPage,
        totalItems: data.totalItems,
        totalPages: data.totalPages,
        pageSize: data.pageSize,
      });
    } catch (error) {
      console.error("Failed to load posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrendingPosts = async () => {
    try {
      const response = await getTrendingSkillPosts(5);
      setTrendingPosts(response.data);
    } catch (error) {
      console.error("Failed to load trending posts:", error);
    }
  };

  useEffect(() => {
    loadPosts();
    loadTrendingPosts();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadPosts(0, keyword);
  };

  const handlePageChange = (page: number) => {
    loadPosts(page);
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Skill Posts</h1>
        <Button onClick={() => navigate("/skills/create")}>
          <Plus className="mr-2 h-4 w-4" /> New Post
        </Button>
      </div>

      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            placeholder="Search posts..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="flex-1"
          />
          <Button type="submit">
            <Search className="h-4 w-4 mr-2" /> Search
          </Button>
        </form>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Posts</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="border rounded-lg p-4">
                  <Skeleton className="h-8 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-4 w-1/3 mb-4" />
                  <div className="flex justify-between mt-3">
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-6 w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <SkillPostCard key={post.id} post={post} />
                ))}
              </div>
              
              <div className="mt-8 flex justify-center">
                <Pagination 
                  totalItems={pagination.totalItems}
                  itemsPerPage={pagination.pageSize}
                  currentPage={pagination.currentPage}
                  onPageChange={handlePageChange}
                />
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No posts found</h3>
              <p className="text-muted-foreground mb-4">
                Try changing your search term or create a new post
              </p>
              <Button onClick={() => navigate("/skills/create")}>
                <Plus className="mr-2 h-4 w-4" /> Create New Post
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="trending">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingPosts.length > 0 ? (
              trendingPosts.map((post) => (
                <SkillPostCard key={post.id} post={post} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <h3 className="text-lg font-medium">No trending posts yet</h3>
                <p className="text-muted-foreground">
                  Posts with more likes and comments will appear here
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 