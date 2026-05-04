import { Link } from 'react-router-dom';
import { 
    ShieldCheck, BarChart3, Users, MessageSquare, ArrowRight, 
    CheckCircle2, Activity, Layout, AlertTriangle, HelpCircle, 
    Clock, Lock
} from 'lucide-react';

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
                        One Platform. Total Accountability.
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
                        Solve fragmented reporting. <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400">
                            Eliminate orphan issues.
                        </span>
                    </h1>
                    
                    <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
                        A decoupled MERN stack issue tracker designed to replace scattered emails and paper forms with a single, transparent, and verifiable 6-phase workflow.
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

            {/* Problem Section (Slide 1) */}
            <section className="py-24 bg-gray-50 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            The Cost of Chaos
                        </h2>
                        <p className="mt-4 text-lg text-gray-600">
                            Current facility management relies on broken systems. We fix the four critical failures.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
                                    <MessageSquare className="w-5 h-5" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Fragmented Channels</h3>
                            </div>
                            <p className="text-gray-600">Complaints scattered across WhatsApp, emails, and paper forms with no central tracking.</p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                                    <HelpCircle className="w-5 h-5" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Orphan Issues</h3>
                            </div>
                            <p className="text-gray-600">Tickets get lost, unassigned, or neglected due to the lack of an organized system.</p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Premature Closures</h3>
                            </div>
                            <p className="text-gray-600">Staff mark issues as resolved without physical verification from the reporter.</p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center">
                                    <AlertTriangle className="w-5 h-5" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Zero Accountability</h3>
                            </div>
                            <p className="text-gray-600">No audit trail, timestamps, or clear ownership to measure performance.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stakeholders Section (Slide 4) */}
            <section className="py-24 bg-white border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            Tailored For Everyone
                        </h2>
                        <p className="mt-4 text-lg text-gray-600">
                            Role-based access ensures every user gets exactly what they need.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Students */}
                        <div className="flex flex-col items-center text-center p-8 bg-gray-50 rounded-3xl border border-gray-100 hover:shadow-md transition">
                            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                                <Users className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Students & Faculty</h3>
                            <p className="text-blue-600 font-semibold mb-4 text-sm uppercase tracking-wider">The Reporters</p>
                            <p className="text-gray-600 leading-relaxed">
                                Fast, friction-free UI optimized for mobile. Submit issues in under 30 seconds with dynamic priority tagging and image attachments.
                            </p>
                        </div>

                        {/* Staff */}
                        <div className="flex flex-col items-center text-center p-8 bg-orange-50 rounded-3xl border border-orange-100 hover:shadow-md transition">
                            <div className="w-16 h-16 bg-orange-200 text-orange-700 rounded-2xl flex items-center justify-center mb-6">
                                <Layout className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Maintenance Staff</h3>
                            <p className="text-orange-600 font-semibold mb-4 text-sm uppercase tracking-wider">The Solvers</p>
                            <p className="text-gray-600 leading-relaxed">
                                Task-focused workflow restricted to a personal drag-and-drop Kanban board. See assigned tickets and 24-hour SLA warnings.
                            </p>
                        </div>

                        {/* Admins */}
                        <div className="flex flex-col items-center text-center p-8 bg-purple-50 rounded-3xl border border-purple-100 hover:shadow-md transition">
                            <div className="w-16 h-16 bg-purple-200 text-purple-700 rounded-2xl flex items-center justify-center mb-6">
                                <ShieldCheck className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Administrators</h3>
                            <p className="text-purple-600 font-semibold mb-4 text-sm uppercase tracking-wider">The Overseers</p>
                            <p className="text-gray-600 leading-relaxed">
                                High-privilege control. Approve tickets, manage roles, view comprehensive analytics dashboards, and export CSV reports.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6-Phase Lifecycle Section (Slide 5) */}
            <section className="py-24 bg-gray-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            The 6-Phase Lifecycle
                        </h2>
                        <p className="mt-4 text-lg text-gray-400 max-w-3xl mx-auto">
                            A strict, event-driven state machine governs how every issue moves from creation to permanent closure, ensuring total accountability.
                        </p>
                    </div>

                    <div className="relative">
                        {/* Timeline Line */}
                        <div className="hidden lg:block absolute top-7 left-[5%] right-[5%] h-1 bg-gray-800 rounded-full"></div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 relative z-10">
                            {[
                                { step: 1, title: 'Approval', desc: 'Admin sets SLA & assigns staff', color: 'bg-yellow-500', text: 'text-yellow-900' },
                                { step: 2, title: 'Open', desc: 'Staff notified, ticket locked', color: 'bg-blue-500', text: 'text-blue-900' },
                                { step: 3, title: 'In Progress', desc: 'Staff actively resolving', color: 'bg-purple-500', text: 'text-purple-900' },
                                { step: 4, title: 'Completed', desc: 'Staff marks as resolved', color: 'bg-orange-500', text: 'text-orange-900' },
                                { step: 5, title: 'Review', desc: 'Reporter physical verify', color: 'bg-green-500', text: 'text-green-900' },
                                { step: 6, title: 'Closed', desc: 'Irreversible audit trail', color: 'bg-gray-400', text: 'text-gray-900' }
                            ].map((phase, i) => (
                                <div key={i} className="flex flex-col items-center text-center group">
                                    <div className={`w-14 h-14 ${phase.color} ${phase.text} rounded-full flex items-center justify-center text-xl font-bold border-4 border-gray-900 shadow-xl mb-6 relative transition-transform group-hover:scale-110`}>
                                        {phase.step}
                                    </div>
                                    <h4 className="text-lg font-bold mb-2 text-gray-100">{phase.title}</h4>
                                    <p className="text-sm text-gray-400">{phase.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Core USPs Section (Slide 2) */}
            <section className="py-24 bg-gray-50 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            Why CampusDesk?
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Closed-Loop Verification</h3>
                            <p className="text-gray-600">
                                Prevent premature closures. Only the original reporter can confirm physical resolution and finalize the ticket audit trail.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                                <BarChart3 className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Admin Analytics</h3>
                            <p className="text-gray-600">
                                Eliminate zero-accountability scenarios with comprehensive dashboards, timestamps, clear ownership, and CSV exports.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-6">
                                <Lock className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">JWT Access Control</h3>
                            <p className="text-gray-600">
                                Enterprise-grade security ensuring robust authentication and authorization across all tailored role interfaces.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-orange-600 py-20">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-6">Ready to digitize internal complaint handling?</h2>
                    <p className="text-orange-100 mb-10 text-lg">
                        Replace chaos with measurable workflows and enforce SLA deadlines across your campus.
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
