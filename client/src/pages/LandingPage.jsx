import { Link } from 'react-router-dom';
import { ShieldCheck, BarChart3, Users, MessageSquare, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-orange-100">
            {/* Navigation */}
            <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="h-8 w-8 text-orange-600" />
                            <span className="font-bold text-xl tracking-tight text-gray-900">CampusDesk</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium transition">
                                Log in
                            </Link>
                            <Link to="/get-in-touch" className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition shadow-sm hover:shadow-md">
                                Get in Touch
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-24 pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
                <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 rounded-full bg-orange-100 blur-3xl opacity-50"></div>
                <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 rounded-full bg-purple-100 blur-3xl opacity-50"></div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-sm font-semibold mb-8 border border-orange-100">
                        <span className="flex h-2 w-2 rounded-full bg-orange-600 animate-pulse"></span>
                        Modernizing Campus Operations
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
                        Streamline your campus <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400">
                            support experience.
                        </span>
                    </h1>
                    
                    <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
                        The all-in-one ticketing and facility management platform designed exclusively for educational institutions. Connect students, faculty, and maintenance teams seamlessly.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/get-in-touch" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-xl font-semibold text-lg transition shadow-lg hover:shadow-xl">
                            Request Demo <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link to="/login" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 px-8 py-4 rounded-xl font-semibold text-lg transition shadow-sm hover:shadow-md">
                            Sign In to Portal
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-gray-50 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            Everything you need to run your campus
                        </h2>
                        <p className="mt-4 text-lg text-gray-600">
                            Powerful tools that help your team resolve issues faster and keep the campus environment thriving.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-6">
                                <MessageSquare className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Intuitive Ticketing</h3>
                            <p className="text-gray-600">
                                Students and staff can effortlessly submit service requests with categories, priority levels, and attachments.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Approval Workflows</h3>
                            <p className="text-gray-600">
                                Built-in multi-stage approval queues for administrative oversight on major maintenance or IT requests.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6">
                                <BarChart3 className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Real-time Analytics</h3>
                            <p className="text-gray-600">
                                Comprehensive dashboards providing insights into resolution times, staff performance, and trending issues.
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-6">
                                <Users className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Role-Based Access</h3>
                            <p className="text-gray-600">
                                Tailored interfaces for Students, Staff, and Administrators. Everyone gets exactly the tools they need.
                            </p>
                        </div>
                        
                        {/* Feature 5 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Kanban Boards</h3>
                            <p className="text-gray-600">
                                Staff can manage their daily workload visually with drag-and-drop Kanban boards for ultimate efficiency.
                            </p>
                        </div>

                        {/* Feature 6 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                            <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-xl flex items-center justify-center mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Notifications</h3>
                            <p className="text-gray-600">
                                Real-time updates via WebSockets and email keep everyone in the loop regarding ticket status changes.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-orange-600 py-20">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-6">Ready to upgrade your campus infrastructure?</h2>
                    <p className="text-orange-100 mb-10 text-lg">
                        Join other progressive institutions that have revolutionized their internal support systems.
                    </p>
                    <Link to="/get-in-touch" className="inline-block bg-white text-orange-600 font-bold px-8 py-4 rounded-xl text-lg hover:bg-gray-50 transition shadow-lg">
                        Contact Sales Team
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 py-12 border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="h-6 w-6 text-orange-500" />
                        <span className="font-bold text-xl text-white">CampusDesk</span>
                    </div>
                    <p className="text-gray-400 text-sm">
                        &copy; {new Date().getFullYear()} Campus Service Desk. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
