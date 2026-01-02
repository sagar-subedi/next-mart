'use client';

import { CheckCircle, DollarSign, Globe, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const BecomeSeller = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative bg-slate-900 text-white overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/seller-bg.jpg')] bg-cover bg-center opacity-20"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 flex flex-col items-center text-center">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                        Start Selling on <span className="text-brand-primary-400">DokoMart</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 max-w-2xl mb-10">
                        Reach millions of customers, grow your business, and build your brand with our world-class e-commerce platform.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            href="http://localhost:3001/register" // Assuming seller-ui runs on 3001, or update later
                            className="bg-brand-primary-600 hover:bg-brand-primary-700 text-white font-semibold py-3 px-8 rounded-full transition-all transform hover:scale-105 shadow-lg"
                        >
                            Register Now
                        </Link>
                        <Link
                            href="#benefits"
                            className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-8 rounded-full backdrop-blur-sm transition-all"
                        >
                            Learn More
                        </Link>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-slate-50 py-12 border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-3xl font-bold text-brand-primary-600 mb-1">5M+</div>
                            <div className="text-sm text-slate-600">Active Customers</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-brand-primary-600 mb-1">10k+</div>
                            <div className="text-sm text-slate-600">Sellers</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-brand-primary-600 mb-1">150+</div>
                            <div className="text-sm text-slate-600">Countries Served</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-brand-primary-600 mb-1">$2B+</div>
                            <div className="text-sm text-slate-600">Annual Sales</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Benefits Section */}
            <div id="benefits" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Sell on DokoMart?</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">
                            We provide the tools, support, and reach you need to take your business to the next level.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-slate-50 transition-colors">
                            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
                                <Globe size={32} />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-3">Global Reach</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Access customers from around the world. Our logistics network makes international shipping easy and affordable.
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-slate-50 transition-colors">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                                <DollarSign size={32} />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-3">Low Fees</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Keep more of what you earn with our competitive commission rates and transparent pricing structure.
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-slate-50 transition-colors">
                            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-6">
                                <TrendingUp size={32} />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-3">Powerful Tools</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Manage your inventory, track orders, and analyze performance with our advanced seller dashboard.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Steps Section */}
            <div className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">How It Works</h2>
                        <p className="text-slate-600">Get started in 3 simple steps</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                step: '01',
                                title: 'Register',
                                desc: 'Create your seller account and verify your business details.',
                            },
                            {
                                step: '02',
                                title: 'List Products',
                                desc: 'Upload your products, set prices, and manage inventory.',
                            },
                            {
                                step: '03',
                                title: 'Start Selling',
                                desc: 'Receive orders, ship products, and get paid securely.',
                            },
                        ].map((item, idx) => (
                            <div key={idx} className="relative bg-white p-8 rounded-xl shadow-sm border border-slate-100">
                                <div className="text-6xl font-bold text-slate-100 absolute top-4 right-4 select-none">
                                    {item.step}
                                </div>
                                <div className="relative z-10">
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                                    <p className="text-slate-600">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-brand-primary-600 py-20">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        Ready to grow your business?
                    </h2>
                    <p className="text-brand-primary-100 text-lg mb-10 max-w-2xl mx-auto">
                        Join thousands of successful sellers on DokoMart today. Setup takes less than 10 minutes.
                    </p>
                    <Link
                        href="http://localhost:3001/register"
                        className="inline-flex items-center gap-2 bg-white text-brand-primary-600 font-bold py-4 px-10 rounded-full hover:bg-slate-100 transition-all shadow-xl transform hover:scale-105"
                    >
                        <CheckCircle size={20} />
                        Become a Seller
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BecomeSeller;
