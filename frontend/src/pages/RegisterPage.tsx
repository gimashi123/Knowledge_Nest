import { useState } from "react";
import { register } from "../services/authService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(name, email, password);
      navigate("/login");
    } catch (err) {
      setError("Registration failed. Email may already be in use.");
    }
  };

  return (
      <div className="min-h-screen bg-[#f1f5fc] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-8">
            <BookOpen className="text-[#44468f] w-10 h-10 mb-2" />
            <h1 className="text-2xl font-bold text-[#44468f]">Create Your Account</h1>
            <p className="text-gray-600">Join our community of learners</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-[#b4c3ed]">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <Input
                      id="name"
                      type="text"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-[#f1f5fc] border-[#b4c3ed] focus:border-[#44468f]"
                  />
                </div>

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
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <Input
                      id="password"
                      type="password"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-[#f1f5fc] border-[#b4c3ed] focus:border-[#44468f]"
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
                Register
              </Button>

              <div className="text-center text-sm text-gray-600 pt-2">
                Already have an account?{" "}
                <Link to="/login" className="text-[#44468f] hover:underline font-medium">
                  Sign in
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
  );
}