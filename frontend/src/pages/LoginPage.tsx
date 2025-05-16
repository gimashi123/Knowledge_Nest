import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context.tsx";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Sparkles,
  Code2,
  ChefHat,
  Hammer
} from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { loginUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await loginUser(email, password);
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    }
  };

  const skillIcons = [
    { icon: Code2, color: "text-blue-500", label: "Coding" },
    { icon: ChefHat, color: "text-red-500", label: "Cooking" },
    { icon: Hammer, color: "text-yellow-500", label: "DIY" }
  ];

  return (
      <div className="min-h-screen flex">
        {/* Left side - Skill Icons Pattern */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#44468f] to-[#6b6fd9] items-center justify-center p-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            {skillIcons.map((Skill, index) => (
                <div
                    key={index}
                    className="absolute"
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      transform: `rotate(${Math.random() * 360}deg)`,
                    }}
                >
                  <Skill.icon className={`w-12 h-12 ${Skill.color}`} />
                </div>
            ))}
          </div>
          <div className="max-w-lg text-white relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-8 h-8" />
              <h2 className="text-3xl font-bold">Knowledge Nest</h2>
            </div>
            <h1 className="text-3xl font-bold mb-4">Share Your Skills, Grow Together</h1>
            <p className="text-lg text-white/80 mb-6">
              Join our community of coders, chefs, and DIY enthusiasts. Share your expertise, learn from others, and build your knowledge network.
            </p>
            <div className="grid grid-cols-3 gap-4">
              {skillIcons.map((Skill, index) => (
                  <div
                      key={index}
                      className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center justify-center hover:bg-white/20 transition-all duration-300 group"
                  >
                    <Skill.icon className={`w-10 h-10 ${Skill.color} mb-2`} />
                    <span className="text-sm text-white/80 group-hover:text-white transition-colors">
                  {Skill.label}
                </span>
                  </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-[#f8fafc]">
          <div className="w-full max-w-md">
            <div className="flex flex-col items-center mb-6">
              <div className="bg-[#44468f]/10 p-3 rounded-full mb-3">
                <BookOpen className="text-[#44468f] w-8 h-8" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome Back</h1>
              <p className="text-gray-600">Sign in to continue your learning journey</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-gray-50 border-gray-200 focus:border-[#44468f] focus:ring-[#44468f] transition-colors"
                        required
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-gray-50 border-gray-200 focus:border-[#44468f] focus:ring-[#44468f] transition-colors"
                        required
                    />
                  </div>
                </div>

                {error && (
                    <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">
                      {error}
                    </div>
                )}

                <Button
                    type="submit"
                    className="w-full bg-[#44468f] hover:bg-[#393b7a] text-white py-5 text-base font-medium transition-all duration-200"
                >
                  Sign In
                </Button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                <div className="flex justify-center">
                  <a
                      href="http://localhost:8081/oauth2/authorization/google"
                      className="inline-flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium transition-all duration-200 w-full group"
                  >
                    <img
                        src="https://www.svgrepo.com/show/475656/google-color.svg"
                        alt="Google"
                        className="w-5 h-5"
                    />
                    <span>Continue with Google</span>
                  </a>
                </div>

                <div className="text-center text-sm text-gray-600 pt-3">
                  Don't have an account?{" "}
                  <Link
                      to="/register"
                      className="text-[#44468f] hover:text-[#393b7a] font-medium transition-colors"
                  >
                    Create an account
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
  );
}