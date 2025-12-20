'use client';

import React from 'react';

const TechnologyStack = () => {
    const stacks = [
        {
            title: 'Backend Architecture',
            color: 'blue',
            items: ['Node.js & Express', 'MongoDB with Prisma', 'JWT & OAuth2', 'RESTful API Design', 'Event-Driven Logic'],
        },
        {
            title: 'Frontend Engineering',
            color: 'green',
            items: ['Next.js 14 (App Router)', 'TypeScript & ES6+', 'Tailwind CSS & Framer', 'React Query & Context', 'Performance Optimization'],
        },
        {
            title: 'System Design',
            color: 'purple',
            items: ['Microservices Pattern', 'API Gateway Pattern', 'Service Discovery', 'Distributed Tracing', 'Scalable Infrastructure'],
        },
        {
            title: 'DevOps & CI/CD',
            color: 'orange',
            items: ['Docker Containerization', 'Nx Monorepo Management', 'GitHub Actions CI/CD', 'Prometheus Monitoring', 'Automated Testing'],
        },
    ];

    const colorClasses = {
        blue: {
            text: 'text-blue-600',
            dot: 'bg-blue-500',
        },
        green: {
            text: 'text-green-600',
            dot: 'bg-green-500',
        },
        purple: {
            text: 'text-purple-600',
            dot: 'bg-purple-500',
        },
        orange: {
            text: 'text-orange-600',
            dot: 'bg-orange-500',
        },
    };

    return (
        <section className="relative py-16 overflow-hidden bg-slate-900">
            {/* Dynamic background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800/60 via-gray-800/70 to-slate-800/60"></div>

            {/* Dynamic grid background */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
                    backgroundSize: '50px 50px'
                }}></div>
            </div>

            {/* Floating light effects */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-32 left-32 w-56 h-56 bg-gradient-to-r from-slate-400/20 to-gray-400/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-32 right-32 w-72 h-72 bg-gradient-to-r from-gray-400/20 to-slate-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
                <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-gradient-to-r from-gray-300/20 to-slate-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.8s' }}></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
                <div className="text-center mb-16">
                    <h3 className="text-4xl font-bold text-white mb-4">🛠️ Technical Architecture</h3>
                    <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                        A robust e-commerce ecosystem built on a distributed microservices architecture, emphasizing scalability, maintainability, and high-performance engineering.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {stacks.map((stack, idx) => (
                        <div
                            key={idx}
                            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-7 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                            <h4
                                className={`text-xl font-semibold text-center mb-4 ${colorClasses[stack.color as keyof typeof colorClasses].text}`}
                            >
                                {stack.title}
                            </h4>
                            <ul className="space-y-2 text-sm text-gray-700">
                                {stack.items.map((item, i) => (
                                    <li key={i} className="flex items-center gap-2">
                                        <span
                                            className={`inline-block w-2 h-2 ${colorClasses[stack.color as keyof typeof colorClasses].dot} rounded-full`}
                                        ></span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <span className="px-6 py-3 bg-white/70 backdrop-blur-sm border border-white/30 rounded-full text-sm shadow-sm">
                        Built with modern microservices for <strong>scalability & performance</strong>
                    </span>
                </div>
            </div>
        </section>
    );
};

export default TechnologyStack;
