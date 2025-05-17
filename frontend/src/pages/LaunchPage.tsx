import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Code2, ChefHat, Hammer, Trophy, Zap, Users, Award, BookOpen } from "lucide-react";
import {useAuth} from "@/contexts/auth-context.tsx";

export default function LaunchPage() {
    const {currentUser} = useAuth()
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f1f5fc] via-[#e0e6fa] to-[#b4c3ed] flex flex-col">
            {/* Navigation Bar */}
            <nav className="bg-white/80 backdrop-blur-sm shadow-sm py-4 px-6 flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <BookOpen className="text-[#44468f] w-7 h-7" />
                    <span className="font-bold text-xl text-[#44468f]">Knowledge Nest</span>
                </div>
                <div className="flex gap-4">
                    <Button variant="ghost" asChild className="hover:bg-[#e0e6fa] transition-colors">
                        <Link to="/about" className="flex items-center gap-1 text-[#44468f] font-medium">
                            About
                        </Link>
                    </Button>
                    {
                        currentUser != null ? (
                            <Button variant="ghost" asChild className="hover:bg-[#e0e6fa] transition-colors">
                                <Link to={currentUser.role === 'ROLE_ADMIN' ? '/admin-dashboard' : '/user-dashboard'} className="flex items-center gap-1 text-[#44468f] font-medium">
                                    Dashboard
                                </Link>
                            </Button>
                        ) : (
                            <Button variant="ghost" asChild className="hover:bg-[#e0e6fa] transition-colors">
                                <Link to="/login" className="flex items-center gap-1 text-[#44468f] font-medium">
                                    Login
                                </Link>
                            </Button>
                        )
                    }
                </div>
            </nav>

            {/* Hero Section */}
            <main className="flex-grow flex flex-col items-center justify-center p-8 text-center">
                <div className="max-w-4xl">
                    <div className="inline-flex items-center gap-2 mb-6 px-5 py-2.5 bg-[#e0e6fa] rounded-full text-[#44468f] shadow-sm hover:shadow-md transition-shadow">
                        <Zap className="w-5 h-5" />
                        <span className="font-medium">Share. Learn. Grow.</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
                        Master Skills in <span className="text-[#44468f] relative">
                            Knowledge Nest
                            <span className="absolute -bottom-2 left-0 w-full h-1 bg-[#44468f] transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
                        </span>
                    </h1>

                    <p className="text-xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed">
                        A vibrant community where coders, cooks, and DIY enthusiasts share knowledge,
                        tackle challenges, and earn rewards for their growth.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-24">
                        <Button asChild className="gap-2 bg-[#44468f] hover:bg-[#393b7a] text-white shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5" size="lg">
                            <Link to="/login">
                                Join Community
                            </Link>
                        </Button>
                        {currentUser != null ? (
                            <Button asChild variant="outline" className="gap-2 border-[#44468f] text-[#44468f] hover:bg-[#e0e6fa] shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5" size="lg">
                                <Link to={currentUser.role === 'ROLE_ADMIN' ? '/admin-dashboard' : '/user-dashboard'}>
                                    Go to Dashboard
                                </Link>
                            </Button>
                        ) : (
                            <Button asChild variant="outline" className="gap-2 border-[#44468f] text-[#44468f] hover:bg-[#e0e6fa] shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5" size="lg">
                                <Link to="/register">
                                    Create Account
                                </Link>
                            </Button>
                        )}
                    </div>

                    {/* Skill Categories */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                        {[
                            {
                                icon: <Code2 className="w-12 h-12 text-[#44468f]" />,
                                title: "Code",
                                desc: "Programming tutorials & pair coding"
                            },
                            {
                                icon: <ChefHat className="w-12 h-12 text-[#44468f]" />,
                                title: "Cook",
                                desc: "Recipes & culinary techniques"
                            },
                            {
                                icon: <Hammer className="w-12 h-12 text-[#44468f]" />,
                                title: "DIY",
                                desc: "Crafts & home projects"
                            }
                        ].map((skill, i) => (
                            <div key={i} className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 border border-[#e0e6fa] group">
                                <div className="flex justify-center mb-6 group-hover:scale-110 transition-transform">{skill.icon}</div>
                                <h3 className="font-bold text-2xl mb-3 text-[#44468f]">{skill.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{skill.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Features Section */}
            <section className="py-20 bg-white">
                <div className="max-w-6xl mx-auto px-8">
                    <h2 className="text-3xl font-bold text-center mb-6 text-[#44468f]">Why Knowledge Nest?</h2>
                    <p className="text-gray-600 text-center mb-16 max-w-2xl mx-auto text-lg">
                        Our unique features make skill-sharing rewarding and engaging
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: <Award className="w-10 h-10 text-[#44468f]" />,
                                title: "Skill Challenges",
                                desc: "Weekly tasks to test your knowledge"
                            },
                            {
                                icon: <Users className="w-10 h-10 text-[#44468f]" />,
                                title: "Community",
                                desc: "Get feedback from experts"
                            },
                            {
                                icon: <Trophy className="w-10 h-10 text-[#44468f]" />,
                                title: "Rewards System",
                                desc: "Earn badges and points"
                            },
                            {
                                icon: <BookOpen className="w-10 h-10 text-[#44468f]" />,
                                title: "Learning Paths",
                                desc: "Structured skill progression"
                            }
                        ].map((feature, i) => (
                            <div key={i} className="p-8 rounded-xl border border-[#e0e6fa] bg-[#f1f5fc] hover:shadow-lg transition-all transform hover:-translate-y-1">
                                <div className="flex items-center gap-4 mb-4">
                                    {feature.icon}
                                    <h3 className="font-semibold text-lg text-[#44468f]">{feature.title}</h3>
                                </div>
                                <p className="text-gray-600">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 bg-[#f1f5fc]">
                <div className="max-w-4xl mx-auto px-8 text-center">
                    <h2 className="text-3xl font-bold mb-16 text-[#44468f]">What Our Nest Members Say</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                quote: "The coding challenges helped me land my first developer job!",
                                author: "Sarah Chen",
                                role: "Frontend Developer",
                                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=b6e3f4",
                                company: "Tech Solutions Inc."
                            },
                            {
                                quote: "Never knew cooking could be this fun with community feedback",
                                author: "Miguel Rodriguez",
                                role: "Home Chef",
                                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Miguel&backgroundColor=ffdfbf",
                                company: "Culinary Arts Studio"
                            },
                            {
                                quote: "My DIY projects improved 10x with Kowlage Nest tutorials",
                                author: "Priya Sharma",
                                role: "DIY Enthusiast",
                                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya&backgroundColor=d1d4f9",
                                company: "Creative Crafts"
                            }
                        ].map((testimonial, i) => (
                            <div key={i} className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 border border-[#e0e6fa]">
                                <div className="flex flex-col items-center mb-6">
                                    <img 
                                        src={testimonial.avatar} 
                                        alt={testimonial.author}
                                        className="w-16 h-16 rounded-full border-2 border-[#44468f] mb-4"
                                    />
                                    <div className="text-center">
                                        <h4 className="font-semibold text-[#44468f] text-lg">{testimonial.author}</h4>
                                        <p className="text-gray-600 text-sm">{testimonial.role}</p>
                                        <p className="text-gray-500 text-xs mt-1">{testimonial.company}</p>
                                    </div>
                                </div>
                                <div className="relative">
                                    <svg className="absolute -top-4 -left-2 w-8 h-8 text-[#44468f] opacity-20" fill="currentColor" viewBox="0 0 32 32">
                                        <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                                    </svg>
                                    <p className="text-lg italic mb-6 leading-relaxed relative z-10">"{testimonial.quote}"</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-[#44468f] to-[#393b7a] text-white">
                <div className="max-w-4xl mx-auto px-8 text-center">
                    <h2 className="text-3xl font-bold mb-8">Ready to Grow Your Skills?</h2>
                    <p className="mb-12 text-[#b4c3ed] max-w-2xl mx-auto text-lg">
                        Join thousands of learners and sharers in the most vibrant skill-sharing community
                    </p>
                    <Button asChild size="lg" className="bg-white text-[#44468f] hover:bg-gray-100 gap-3 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                        <Link to="/register">
                            <Zap className="w-6 h-6" />
                            Start Your Journey Today
                        </Link>
                    </Button>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 bg-[#44468f] text-[#f1f5fc]">
                <div className="max-w-6xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div>
                        <h3 className="font-bold text-xl mb-6">Knowledge Nest</h3>
                        <p className="text-sm leading-relaxed">Where skills take flight and knowledge finds its home</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-lg mb-4">Skills</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link to="/skills/code" className="hover:underline transition-colors">Programming</Link></li>
                            <li><Link to="/skills/cook" className="hover:underline transition-colors">Cooking</Link></li>
                            <li><Link to="/skills/diy" className="hover:underline transition-colors">DIY Projects</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-lg mb-4">Community</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link to="/challenges" className="hover:underline transition-colors">Challenges</Link></li>
                            <li><Link to="/rewards" className="hover:underline transition-colors">Rewards</Link></li>
                            <li><Link to="/discussions" className="hover:underline transition-colors">Discussions</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-lg mb-4">Company</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link to="/about" className="hover:underline transition-colors">About Us</Link></li>
                            <li><Link to="/contact" className="hover:underline transition-colors">Contact</Link></li>
                            <li><Link to="/privacy" className="hover:underline transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-6xl mx-auto px-8 pt-12 mt-12 border-t border-[#5a5d9d] text-center text-sm">
                    © {new Date().getFullYear()} Knowledge Nest. All rights reserved.
                </div>
            </footer>
        </div>
    );
}