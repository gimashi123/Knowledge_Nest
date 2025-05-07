import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context.tsx";
import { BookOpen, User, Award, LogOut, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { currentUser, logoutUser } = useAuth();
  
  return (
    <div className="max-w-5xl mx-auto p-8 mt-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Profile Card */}
        <Card className="md:col-span-1 shadow-lg border-t-4 border-t-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold">Profile</CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center mb-4">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <User className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-xl font-bold">{currentUser?.name}</h2>
              <p className="text-sm text-muted-foreground">{currentUser?.email}</p>
              <div className="mt-2 px-3 py-1 bg-secondary text-secondary-foreground text-xs rounded-full">
                {currentUser?.role}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center pt-0">
            <Button onClick={() => navigate("/profile")} variant="outline" className="w-full">
              <User className="mr-2 h-4 w-4" />
              View Full Profile
            </Button>
          </CardFooter>
        </Card>

        {/* Main Content Area */}
        <div className="md:col-span-2 space-y-6">
          {/* Welcome Card */}
          <Card className="shadow-lg bg-gradient-to-r from-primary/10 to-secondary/10">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Welcome to Knowledge Nest 🎓</CardTitle>
              <CardDescription>Your personal learning dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Continue your learning journey and track your progress. Explore skill posts and connect with other learners.
              </p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => navigate("/skill-posts")} className="w-full">
                <BookOpen className="mr-2 h-4 w-4" />
                Explore Skill Posts
              </Button>
            </CardFooter>
          </Card>

          {/* Features Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <Award className="h-5 w-5 mr-2 text-primary" />
                  Learning Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2">
                  <li className="flex items-center text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    View your progress
                  </li>
                  <li className="flex items-center text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    Complete challenges
                  </li>
                  <li className="flex items-center text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    Track achievements
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full justify-between">
                  View Details <ChevronRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-primary" />
                  Skill Resources
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2">
                  <li className="flex items-center text-sm">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                    Browse learning materials
                  </li>
                  <li className="flex items-center text-sm">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                    Create your own posts
                  </li>
                  <li className="flex items-center text-sm">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                    Share knowledge with others
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-between"
                  onClick={() => navigate("/skill-posts")}
                >
                  Explore Posts <ChevronRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <Button 
          onClick={() => logoutUser()} 
          variant="outline" 
          className="flex items-center text-destructive hover:bg-destructive/10"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}