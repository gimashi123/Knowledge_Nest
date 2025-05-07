import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context.tsx";
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { loginUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // clear previous errors
    try {
      await loginUser(email, password);
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
      <div className="min-h-screen bg-[#f1f5fc] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-8">
            <BookOpen className="text-[#44468f] w-10 h-10 mb-2" />
            <h1 className="text-2xl font-bold text-[#44468f]">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-[#b4c3ed]">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
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
                      className="bg-[#f1f5fc] border-[#b4c3ed] focus:border-[#44468f]"
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
                      className="bg-[#f1f5fc] border-[#b4c3ed] focus:border-[#44468f]"
                      required
                  />
                </div>
              </div>

              {error && (
                  <div className="text-red-500 text-sm text-center">
                    {error}
                  </div>
              )}

              <Button
                  type="submit"
                  className="w-full bg-[#44468f] hover:bg-[#393b7a] text-white"
              >
                Sign In
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#b4c3ed]"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="flex justify-center">
                <a
                    href="http://localhost:8081/oauth2/authorization/google"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-[#b4c3ed] bg-white hover:bg-[#f1f5fc] text-gray-700 text-sm font-medium transition w-full"
                >
                  <img
                      src="https://www.svgrepo.com/show/475656/google-color.svg"
                      alt="Google"
                      className="w-5 h-5 justify-center"
                  />
                  Continue with Google
                </a>
              </div>

              <div className="text-center text-sm text-gray-600 pt-2">
                Don't have an account?{" "}
                <Link to="/register" className="text-[#44468f] hover:underline font-medium">
                  Register
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
  );
}