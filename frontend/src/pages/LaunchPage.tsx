import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Code2, ChefHat, Hammer, Trophy, Zap, Users, Award, BookOpen } from "lucide-react";
import {useAuth} from "@/contexts/auth-context.tsx";

export default function LaunchPage() {

    const {currentUser} = useAuth()
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f1f5fc] to-[#b4c3ed] flex flex-col">
            {/* Navigation Bar */}
            <nav className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <BookOpen className="text-[#44468f] w-6 h-6" />
                    <span className="font-bold text-lg text-[#44468f]">Kowlage Nest</span>
                </div>
                <div className="flex gap-4">
                    <Button variant="ghost" asChild>
                        <Link to="/about" className="flex items-center gap-1 text-[#44468f]">
                            About
                        </Link>
                    </Button>
                    {
                        currentUser != null ? (
                            <Button variant="ghost" asChild>
                                <Link to={currentUser.role === 'ROLE_ADMIN' ? '/admin-dashboard' : '/user-dashboard'} className="flex items-center gap-1 text-[#44468f]">
                                    Dashboard
                                </Link>
                            </Button>
                        ) : (
                            <Button variant="ghost" asChild>
                                <Link to="/login" className="flex items-center gap-1 text-[#44468f]">
                                    Login
                                </Link>
                            </Button>
                        )
                    }
                </div>
            </nav>

            {/* Hero Section */}
            <main className="flex-grow flex flex-col items-center justify-center p-6 text-center">
                <div className="max-w-4xl">
                    <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-[#e0e6fa] rounded-full text-[#44468f]">
                        <Zap className="w-5 h-5" />
                        <span>Share. Learn. Grow.</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Master Skills in <span className="text-[#44468f]">Kowlage Nest</span>
                    </h1>

                    <p className="text-xl text-gray-700 mb-10 max-w-3xl mx-auto">
                        A vibrant community where coders, cooks, and DIY enthusiasts share knowledge,
                        tackle challenges, and earn rewards for their growth.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
                        <Button asChild className="gap-2 bg-[#44468f] hover:bg-[#393b7a] text-white" size="lg">
                            <Link to="/login">
                                Join Community
                            </Link>
                        </Button>
                        {currentUser != null ? (<Button asChild variant="outline" className="gap-2 border-[#44468f] text-[#44468f] hover:bg-[#e0e6fa]" size="lg">
                            <Link to={currentUser.role === 'ROLE_ADMIN' ? '/admin-dashboard' : '/user-dashboard'}>
                                Go to Dashboard
                            </Link>
                        </Button>): (<Button asChild variant="outline" className="gap-2 border-[#44468f] text-[#44468f] hover:bg-[#e0e6fa]" size="lg">
                            <Link to="/register">
                                Create Account
                            </Link>
                        </Button>)}

                    </div>

                    {/* Skill Categories */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                        {[
                            {
                                icon: <Code2 className="w-10 h-10 text-[#44468f]" />,
                                title: "Code",
                                desc: "Programming tutorials & pair coding"
                            },
                            {
                                icon: <ChefHat className="w-10 h-10 text-[#44468f]" />,
                                title: "Cook",
                                desc: "Recipes & culinary techniques"
                            },
                            {
                                icon: <Hammer className="w-10 h-10 text-[#44468f]" />,
                                title: "DIY",
                                desc: "Crafts & home projects"
                            }
                        ].map((skill, i) => (
                            <div key={i} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-[#e0e6fa]">
                                <div className="flex justify-center mb-4">{skill.icon}</div>
                                <h3 className="font-bold text-xl mb-2 text-[#44468f]">{skill.title}</h3>
                                <p className="text-gray-600">{skill.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Features Section */}
            <section className="py-16 bg-white">
                <div className="max-w-6xl mx-auto px-6">
                    <h2 className="text-2xl font-bold text-center mb-4 text-[#44468f]">Why Knowledge Nest?</h2>
                    <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
                        Our unique features make skill-sharing rewarding and engaging
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                icon: <Award className="w-8 h-8 text-[#44468f]" />,
                                title: "Skill Challenges",
                                desc: "Weekly tasks to test your knowledge"
                            },
                            {
                                icon: <Users className="w-8 h-8 text-[#44468f]" />,
                                title: "Community",
                                desc: "Get feedback from experts"
                            },
                            {
                                icon: <Trophy className="w-8 h-8 text-[#44468f]" />,
                                title: "Rewards System",
                                desc: "Earn badges and points"
                            },
                            {
                                icon: <BookOpen className="w-8 h-8 text-[#44468f]" />,
                                title: "Learning Paths",
                                desc: "Structured skill progression"
                            }
                        ].map((feature, i) => (
                            <div key={i} className="p-6 rounded-lg border border-[#e0e6fa] bg-[#f1f5fc]">
                                <div className="flex items-center gap-3 mb-3">
                                    {feature.icon}
                                    <h3 className="font-semibold text-[#44468f]">{feature.title}</h3>
                                </div>
                                <p className="text-gray-600 text-sm">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-16 bg-[#f1f5fc]">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-2xl font-bold mb-12 text-[#44468f]">What Our Nest Members Say</h2>
                    <div className="space-y-8">
                        {[
                            {
                                quote: "The coding challenges helped me land my first developer job!",
                                author: "Sarah, Frontend Developer"
                            },
                            {
                                quote: "Never knew cooking could be this fun with community feedback",
                                author: "Miguel, Home Chef"
                            },
                            {
                                quote: "My DIY projects improved 10x with Kowlage Nest tutorials",
                                author: "Priya, DIY Enthusiast"
                            }
                        ].map((testimonial, i) => (
                            <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-[#e0e6fa]">
                                <p className="text-lg italic mb-4">"{testimonial.quote}"</p>
                                <p className="font-medium text-[#44468f]">{testimonial.author}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-[#44468f] to-[#393b7a] text-white">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-2xl font-bold mb-6">Ready to Grow Your Skills?</h2>
                    <p className="mb-8 text-[#b4c3ed] max-w-2xl mx-auto">
                        Join thousands of learners and sharers in the most vibrant skill-sharing community
                    </p>
                    <Button asChild size="lg" className="bg-white text-[#44468f] hover:bg-gray-100 gap-2">
                        <Link to="/register">
                            <Zap className="w-5 h-5" />
                            Start Your Journey Today
                        </Link>
                    </Button>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 bg-[#44468f] text-[#f1f5fc]">
                <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="font-bold text-lg mb-4">Kowlage Nest</h3>
                        <p className="text-sm">Where skills take flight and knowledge finds its home</p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-3">Skills</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/skills/code" className="hover:underline">Programming</Link></li>
                            <li><Link to="/skills/cook" className="hover:underline">Cooking</Link></li>
                            <li><Link to="/skills/diy" className="hover:underline">DIY Projects</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-3">Community</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/challenges" className="hover:underline">Challenges</Link></li>
                            <li><Link to="/rewards" className="hover:underline">Rewards</Link></li>
                            <li><Link to="/discussions" className="hover:underline">Discussions</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-3">Company</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/about" className="hover:underline">About Us</Link></li>
                            <li><Link to="/contact" className="hover:underline">Contact</Link></li>
                            <li><Link to="/privacy" className="hover:underline">Privacy Policy</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-6xl mx-auto px-6 pt-8 mt-8 border-t border-[#5a5d9d] text-center text-sm">
                    © {new Date().getFullYear()} Knowledge Nest. All rights reserved.
                </div>
            </footer>
        </div>
    );
}