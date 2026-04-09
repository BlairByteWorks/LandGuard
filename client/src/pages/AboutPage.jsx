import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Eye, TrendingUp, Lock, ArrowRight, AlertTriangle, UserCircle, LogOut } from 'lucide-react';

export default function AboutPage() {
    const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedName = localStorage.getItem('userName');
    
    if (token) {
      setIsLoggedIn(true);
      setUserName(storedName || 'User');
    } else {
      setIsLoggedIn(false);
      setUserName('');
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false); 
    setUserName('');
    navigate('/'); 
  };
  return (
    <div className="bg-[#f8f7f5] font-sans text-[#181610] antialiased min-h-screen flex flex-col">
      
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-[#e7e3da] bg-white/95 backdrop-blur-sm px-6 py-4 lg:px-20 shadow-sm">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f0a800] text-[#002147] shadow-md">
            <ShieldCheck size={26} strokeWidth={2.5} />
          </div>
          <h2 className="text-[#002147] text-xl font-black tracking-tight">LandGuard</h2>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-slate-500 text-sm font-bold hover:text-[#002147] transition-colors">Home</Link>

          {isLoggedIn ? (
            <div className="flex items-center gap-4 animate-in fade-in duration-300 ml-2 pl-6 border-l border-slate-200">
              <span className="flex items-center gap-2 font-bold text-[#002147] bg-green-50 px-4 py-2 rounded-full border border-green-200 shadow-sm">
                <UserCircle size={18} className="text-green-600"/>
                {userName}!
              </span>
              <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-bold text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl transition-colors cursor-pointer">
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <div className="ml-2 pl-6 border-l border-slate-200">
              <Link to="/login" className="text-slate-500 text-sm font-bold hover:text-[#002147] transition-colors">Login / Register</Link>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1">
        <section className="relative text-white py-24 px-6 lg:px-20 text-center overflow-hidden bg-[#002147]">
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[#002147]/80 z-10"></div> 
                <div className="absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-[#f0a800]/20 blur-[100px] z-10"></div>
                <div 
                    className="absolute inset-0 bg-center bg-cover z-0 opacity-40 mix-blend-overlay"
                    style={{ backgroundImage: "url('/nairobi-bg.jpg')" }}
                ></div>
            </div>

            <div className="relative z-20 max-w-3xl mx-auto flex flex-col items-center">
                <div className="bg-[#f0a800]/20 text-[#f0a800] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-[#f0a800]/30 backdrop-blur-sm">
                    Our Mission
                </div>
                <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight drop-shadow-md">
                    Restoring Trust in <br/><span className="text-[#f0a800]">Real Estate.</span>
                </h1>
                <p className="text-lg text-slate-200 leading-relaxed font-light drop-shadow-sm">
                    LandGuard was built to solve the "Information Asymmetry" crisis in the Kenyan land sector. 
                    We provide a centralized, secure, and intelligent platform for property verification.
                </p>
            </div>
        </section>

        <section className="relative py-24 px-6 lg:px-10 overflow-hidden">
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[#001733]/80 z-10 backdrop-blur-[2px]"></div>
                <img 
                    src="/nairobi-city.jpg" 
                    alt="Nairobi City CBD Image" 
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="relative z-20 max-w-[1200px] mx-auto grid lg:grid-cols-2 gap-10 items-stretch">
                
                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-slate-100 flex flex-col justify-center transform transition-transform hover:-translate-y-1 duration-300">
                    <h2 className="text-3xl font-black text-[#002147] mb-6">The Problem We Solve</h2>
                    <p className="text-slate-600 leading-relaxed mb-8">
                        For decades, property transactions have relied on fragmented, manual paper records. This opacity has fostered an environment ripe for exploitation, resulting in two major crises:
                    </p>
                    <ul className="space-y-6">
                        <li className="flex items-start gap-4">
                            <div className="bg-red-50 p-2.5 rounded-lg text-red-500 shrink-0 mt-0.5">
                                <AlertTriangle size={20} />
                            </div>
                            <div>
                                <strong className="text-[#002147] block text-lg mb-1">Title Fraud & Double Allocations</strong>
                                <span className="text-slate-600 text-sm leading-relaxed">Fraudsters exploit delays in manual record updating to sell the same piece of land to multiple unsuspecting buyers.</span>
                            </div>
                        </li>
                        <li className="flex items-start gap-4">
                            <div className="bg-red-50 p-2.5 rounded-lg text-red-500 shrink-0 mt-0.5">
                                <AlertTriangle size={20} />
                            </div>
                            <div>
                                <strong className="text-[#002147] block text-lg mb-1">Value Inflation</strong>
                                <span className="text-slate-600 text-sm leading-relaxed">Without a unified pricing index, buyers are often unable to determine if a quoted price aligns with fair market value.</span>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-slate-100 flex flex-col justify-center relative overflow-hidden transform transition-transform hover:-translate-y-1 duration-300">
                    <div className="absolute -top-10 -right-10 bg-[#f0a800] h-40 w-40 rounded-full blur-3xl opacity-20"></div>
                    <h2 className="text-3xl font-black text-[#002147] mb-8 flex items-center gap-3">
                        <ShieldCheck className="text-[#f0a800]" size={36} />
                        The Solution
                    </h2>
                    <div className="space-y-8 relative z-10">
                        <div className="flex gap-4 items-start">
                            <div className="bg-blue-50 p-3 rounded-xl text-blue-600 shrink-0 shadow-sm"><Lock size={22} /></div>
                            <div>
                                <strong className="text-[#002147] block text-base mb-1">Digitized Chain of Custody</strong>
                                <p className="text-sm text-slate-600 leading-relaxed">We centralize the historical timeline of ownership, ensuring buyers can instantly verify a title's legitimacy.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="bg-green-50 p-3 rounded-xl text-green-600 shrink-0 shadow-sm"><TrendingUp size={22} /></div>
                            <div>
                                <strong className="text-[#002147] block text-base mb-1">Intelligent AI Valuation</strong>
                                <p className="text-sm text-slate-600 leading-relaxed">Our integrated machine learning model analyzes location and size data to predict fair market value and flag pricing anomalies.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="bg-purple-50 p-3 rounded-xl text-purple-600 shrink-0 shadow-sm"><Eye size={22} /></div>
                            <div>
                                <strong className="text-[#002147] block text-base mb-1">Role-Based Transparency</strong>
                                <p className="text-sm text-slate-600 leading-relaxed">Strict access controls ensure only authorized registrars can verify documents, while giving buyers read-only transparency.</p>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </section>

        <section className="bg-white border-t border-[#e7e3da] py-20 px-6 text-center">
            <h2 className="text-3xl font-black text-[#002147] mb-6">Ready to secure your investment?</h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/" className="w-full sm:w-auto bg-[#002147] text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                    Search a Title
                </Link>
                <Link to="/login" className="w-full sm:w-auto bg-[#f0a800] text-[#002147] px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-yellow-500 transition-all flex items-center justify-center gap-2">
                    Create an Account <ArrowRight size={18} />
                </Link>
            </div>
        </section>
      </main>

      

      <footer className="bg-[#002147] px-6 py-10 border-t border-[#001733] text-slate-400 text-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 font-bold text-white">
                <ShieldCheck size={20} className="text-[#f0a800]" /> LandGuard
            </div>

            <div className="flex flex-wrap items-center gap-6 font-medium">
                        <Link to="/contact" className="hover:text-[#f0a800] transition-colors">Contact Us</Link>
                        <Link to="/help" className="hover:text-[#f0a800] transition-colors">Help Center</Link>
            </div>

            <div className="text-xs font-medium">
             © 2026 LandGuard. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}