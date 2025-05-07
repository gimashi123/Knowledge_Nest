import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { 
    BookOpen, 
    GraduationCap, 
    Trophy,
    CheckCircle,
    Clock,
    BarChart
} from "lucide-react";

export const UserDashboardPage = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Welcome back, {currentUser?.name}!</h1>
                    <p className="text-muted-foreground">Track your learning progress and explore new skills</p>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg border p-6 flex items-center">
                        <div className="rounded-full bg-blue-100 p-3 mr-4">
                            <BookOpen className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-muted-foreground text-sm">Courses Started</p>
                            <h3 className="text-2xl font-bold">3</h3>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg border p-6 flex items-center">
                        <div className="rounded-full bg-green-100 p-3 mr-4">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-muted-foreground text-sm">Completed</p>
                            <h3 className="text-2xl font-bold">1</h3>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg border p-6 flex items-center">
                        <div className="rounded-full bg-yellow-100 p-3 mr-4">
                            <Trophy className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-muted-foreground text-sm">Achievements</p>
                            <h3 className="text-2xl font-bold">5</h3>
                        </div>
                    </div>
                </div>

                {/* Current Learning and Recommendations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="bg-white rounded-lg border p-6">
                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                            <Clock className="h-5 w-5 mr-2 text-blue-600" />
                            Continue Learning
                        </h2>
                        <div className="space-y-4">
                            <div className="border rounded-md p-4">
                                <h3 className="font-medium">JavaScript Fundamentals</h3>
                                <div className="mt-2 h-2 w-full bg-gray-200 rounded-full">
                                    <div className="h-2 bg-blue-600 rounded-full" style={{ width: '65%' }}></div>
                                </div>
                                <div className="mt-2 flex justify-between text-sm text-muted-foreground">
                                    <span>65% complete</span>
                                    <span>4/6 modules</span>
                                </div>
                                <Button 
                                    onClick={() => navigate("/skill-posts")}
                                    className="mt-3 w-full"
                                >
                                    Continue
                                </Button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg border p-6">
                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                            <GraduationCap className="h-5 w-5 mr-2 text-purple-600" />
                            Recommended For You
                        </h2>
                        <div className="space-y-3">
                            <div className="border rounded-md p-3 hover:bg-gray-50 cursor-pointer" onClick={() => navigate("/skill-posts")}>
                                <h3 className="font-medium">React for Beginners</h3>
                                <p className="text-sm text-muted-foreground mt-1">Learn the basics of React framework</p>
                            </div>
                            
                            <div className="border rounded-md p-3 hover:bg-gray-50 cursor-pointer" onClick={() => navigate("/skill-posts")}>
                                <h3 className="font-medium">Introduction to Spring Boot</h3>
                                <p className="text-sm text-muted-foreground mt-1">Build your first Java web application</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Learning Progress */}
                <div className="bg-white rounded-lg border p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                        <BarChart className="h-5 w-5 mr-2 text-indigo-600" />
                        Your Learning Progress
                    </h2>
                    <div className="space-y-4">
                        <div className="border-b pb-3">
                            <div className="flex justify-between mb-1">
                                <span className="font-medium">JavaScript</span>
                                <span className="text-muted-foreground text-sm">65%</span>
                            </div>
                            <div className="h-2 w-full bg-gray-200 rounded-full">
                                <div className="h-2 bg-blue-600 rounded-full" style={{ width: '65%' }}></div>
                            </div>
                        </div>
                        
                        <div className="border-b pb-3">
                            <div className="flex justify-between mb-1">
                                <span className="font-medium">HTML & CSS</span>
                                <span className="text-muted-foreground text-sm">90%</span>
                            </div>
                            <div className="h-2 w-full bg-gray-200 rounded-full">
                                <div className="h-2 bg-green-600 rounded-full" style={{ width: '90%' }}></div>
                            </div>
                        </div>
                        
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="font-medium">React</span>
                                <span className="text-muted-foreground text-sm">30%</span>
                            </div>
                            <div className="h-2 w-full bg-gray-200 rounded-full">
                                <div className="h-2 bg-yellow-600 rounded-full" style={{ width: '30%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};
