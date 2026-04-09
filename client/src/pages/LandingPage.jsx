import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, ShieldCheck, Zap, Lock, Menu, 
  BadgeCheck, BarChart3, Building, Landmark, Scale, Home, 
  CheckCircle, UserCircle, LogOut, FileText, Cpu, FileCheck, 
  Users, UploadCloud, ArrowRight
} from 'lucide-react';

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    const storedName = localStorage.getItem('userName');
    
    if (token && role === 'Buyer') {
      setIsLoggedIn(true);
      setUserName(storedName || 'Buyer');
    } else {
      setIsLoggedIn(false);
      setUserName('');
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    if (isLoggedIn) {
        navigate('/report', { state: { titleNumber: searchQuery } }); 
    } else {
        navigate('/login');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false); 
    setUserName('');
    setSearchQuery('');
    navigate('/'); 
  };

  return (
    <div className="bg-[#f8f7f5] font-sans text-[#181610] antialiased min-h-screen flex flex-col group/design-root">
      
      {/* Navbar */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-[#e7e3da] bg-white/95 backdrop-blur-sm px-6 py-4 lg:px-20">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f0a800]/20 text-[#f0a800]">
            <ShieldCheck size={28} />
          </div>
          <h2 className="text-[#002147] text-xl font-bold leading-tight tracking-tight">LandGuard</h2>
        </div>
        
        <div className="hidden flex-1 justify-end gap-8 md:flex">
          {isLoggedIn ? (
            <div className="flex items-center gap-6 animate-in fade-in duration-300">
              <span className="flex items-center gap-2 font-bold text-[#002147] bg-green-50 px-4 py-2 rounded-full border border-green-200">
                <UserCircle size={18} className="text-green-600"/>
                Welcome, {userName}!
              </span>
              <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-bold text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors cursor-pointer">
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-8">
              <Link to="/" className="text-[#002147] text-sm font-medium hover:text-[#f0a800] transition-colors">Home</Link>
              <Link to="/about" className="text-[#002147] text-sm font-medium hover:text-[#f0a800] transition-colors">About</Link>
              <Link to="/login" className="text-[#002147] text-sm font-medium hover:text-[#f0a800] transition-colors">Login</Link>
              <Link to="/login" className="flex min-w-[100px] cursor-pointer items-center justify-center rounded-lg bg-[#f0a800] h-10 px-6 text-[#002147] text-sm font-bold shadow-sm transition-transform hover:scale-105 hover:bg-[#d69500] hover:shadow-md active:scale-95">
                <span>Register</span>
              </Link>
            </div>
          )}
        </div>
        <button className="flex md:hidden text-[#002147]">
          <Menu />
        </button>
      </header>

      <main className="flex flex-1 flex-col">
        
        <section className="relative overflow-hidden pb-24">
          
          <div className="absolute inset-0 z-0 bg-[#f8f7f5]">
            <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-[#f0a800]/10 blur-[100px]"></div>
            <div className="absolute left-0 bottom-0 h-[400px] w-[400px] rounded-full bg-[#002147]/5 blur-[80px]"></div>
            <div 
              className="absolute inset-0 opacity-20 bg-center bg-cover" 
              style={{ backgroundImage: "url('/nairobi_background.jpg')" }}
            ></div>
          </div>

          {/* Hero Content Area */}
          <div className="relative z-10 flex min-h-[600px] flex-col justify-center py-20 px-4 md:px-10 lg:px-20">
            <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-8 text-center">
              <div className="flex flex-col gap-4 items-center">
                {isLoggedIn ? (
                  <span className="mx-auto w-fit rounded-full bg-green-100 text-green-800 border border-green-200 px-4 py-1.5 text-xs font-bold uppercase tracking-wide mb-2 flex items-center gap-1.5 shadow-sm">
                    <Lock size={14} /> Secure Session Active
                  </span>
                ) : (
                  <span className="mx-auto w-fit rounded-full bg-white/80 backdrop-blur-md shadow-sm border border-[#e7e3da] px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-[#002147]">
                    Trusted Real Estate Verification
                  </span>
                )}
                <h1 className="text-[#002147] text-4xl font-black leading-tight tracking-tight sm:text-5xl md:text-6xl">
                  Secure Your Land Investment
                </h1>
                <p className="mx-auto max-w-2xl text-lg text-[#8d7f5e] font-normal leading-relaxed">
                  Verify property history, check ownership titles, and get AI-powered valuations instantly to make informed decisions.
                </p>
              </div>

              <div className="w-full max-w-2xl mt-4">
                <form onSubmit={handleSearch} className="group flex flex-col sm:flex-row w-full items-stretch rounded-xl border-2 border-[#e7e3da] bg-white p-2 shadow-xl transition-all focus-within:border-[#f0a800] focus-within:ring-4 focus-within:ring-[#f0a800]/20">
                  <div className="flex flex-1 items-center px-2">
                    <Search className="text-[#8d7f5e] ml-2" size={20} />
                    <input 
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      aria-label="Search Property Title" 
                      className="h-12 w-full border-none bg-transparent px-4 text-base text-[#002147] outline-none placeholder:text-[#8d7f5e]/70" 
                      placeholder="Enter Title Number (e.g., LR-12345/NBO)"
                      required
                    />
                  </div>
                  <button type="submit" className="mt-2 sm:mt-0 flex min-w-[140px] cursor-pointer items-center justify-center rounded-lg bg-[#002147] px-6 py-3 text-white font-bold transition-all hover:bg-[#003366] hover:shadow-md sm:h-auto">
                    Search Title
                  </button>
                </form>
                
                <div className="mt-5 flex justify-center gap-6 text-xs font-bold text-[#8d7f5e] uppercase tracking-wider">
                  <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-green-600" /> Verified Data</span>
                  <span className="flex items-center gap-1.5"><Zap size={14} className="text-[#f0a800]" /> Instant Results</span>
                  <span className="flex items-center gap-1.5"><Lock size={14} className="text-[#002147]"/> Secure Search</span>
                </div>
              </div>
            </div>
          </div>

          {/* How It Works Content Area */}
          <div className="relative z-10 pt-10 px-4 md:px-10 lg:px-20">
            <div className="mx-auto max-w-6xl">
              <div className="mb-16 text-center">
                <h2 className="text-3xl font-black text-[#002147] md:text-4xl">How LandGuard Works</h2>
                <p className="mt-4 text-[#8d7f5e] font-medium text-lg">Three simple steps to absolute property transparency.</p>
              </div>
              
              <div className="grid gap-12 md:grid-cols-3 relative">
                
                <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-[#e7e3da] z-0"></div>
                
                <div className="relative z-10 flex flex-col items-center text-center bg-white/70 backdrop-blur-lg p-10 rounded-3xl border border-white shadow-xl hover:-translate-y-2 transition-transform duration-300">
                  <div className="h-24 w-24 rounded-full bg-white border-4 border-[#f0a800] flex items-center justify-center mb-6 shadow-md">
                    <FileText size={36} className="text-[#002147]" />
                  </div>
                  <h3 className="text-xl font-black text-[#002147] mb-3">1. Search or Upload</h3>
                  <p className="text-[#8d7f5e] leading-relaxed">
                    Enter a Title Number to search the public registry, or securely upload your own deed documents for registrar verification.
                  </p>
                </div>

                <div className="relative z-10 flex flex-col items-center text-center bg-white/70 backdrop-blur-lg p-10 rounded-3xl border border-white shadow-xl hover:-translate-y-2 transition-transform duration-300">
                  <div className="h-24 w-24 rounded-full bg-white border-4 border-[#f0a800] flex items-center justify-center mb-6 shadow-md">
                    <Cpu size={36} className="text-[#002147]" />
                  </div>
                  <h3 className="text-xl font-black text-[#002147] mb-3">2. AI & Forensic Analysis</h3>
                  <p className="text-[#8d7f5e] leading-relaxed">
                    Our system cross-references registrar data, checks for duplicate allocations, and runs predictive models to calculate market value.
                  </p>
                </div>

                <div className="relative z-10 flex flex-col items-center text-center bg-white/70 backdrop-blur-lg p-10 rounded-3xl border border-white shadow-xl hover:-translate-y-2 transition-transform duration-300">
                  <div className="h-24 w-24 rounded-full bg-white border-4 border-[#f0a800] flex items-center justify-center mb-6 shadow-md">
                    <FileCheck size={36} className="text-[#002147]" />
                  </div>
                  <h3 className="text-xl font-black text-[#002147] mb-3">3. Generate Trust Report</h3>
                  <p className="text-[#8d7f5e] leading-relaxed">
                    Receive a comprehensive Chain of Custody dashboard and an instant Trust Score to secure your investment with confidence.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* Core Features Section */}
        <section className="py-20 px-4 md:px-10 lg:px-20 bg-white border-t border-b border-[#e7e3da]">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-black text-[#002147] md:text-4xl">Why Choose LandGuard?</h2>
              <p className="mt-4 text-[#8d7f5e] font-medium text-lg">We provide the most accurate and up-to-date land data available.</p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="group flex flex-col rounded-2xl border border-[#e7e3da] bg-[#f8f7f5] p-8 transition-all hover:-translate-y-1 hover:border-[#f0a800]/50 hover:shadow-xl">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                  <BadgeCheck size={32} />
                </div>
                <h3 className="mb-3 text-xl font-black text-[#002147]">Instant Verification</h3>
                <p className="text-[#8d7f5e] leading-relaxed font-medium">
                  Get land ownership details in seconds directly from official land registries. Verify titles before you commit.
                </p>
              </div>
              <div className="group flex flex-col rounded-2xl border border-[#e7e3da] bg-[#f8f7f5] p-8 transition-all hover:-translate-y-1 hover:border-[#f0a800]/50 hover:shadow-xl">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
                  <BarChart3 size={32} />
                </div>
                <h3 className="mb-3 text-xl font-black text-[#002147]">AI Valuations</h3>
                <p className="text-[#8d7f5e] leading-relaxed font-medium">
                  Leverage our data-driven market value estimates powered by historical trends and AI predictive modeling.
                </p>
              </div>
              <div className="group flex flex-col rounded-2xl border border-[#e7e3da] bg-[#f8f7f5] p-8 transition-all hover:-translate-y-1 hover:border-[#f0a800]/50 hover:shadow-xl">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-green-100 text-green-700">
                  <ShieldCheck size={32} />
                </div>
                <h3 className="mb-3 text-xl font-black text-[#002147]">Fraud Prevention</h3>
                <p className="text-[#8d7f5e] leading-relaxed font-medium">
                  Protect yourself from land scams and duplicate title allocations with our rigorous cross-referencing system.
                </p>
              </div>
            </div>
          </div>
        </section>

         {/* Final Call to Action */}
        <section className="py-24 px-4 bg-[#002147] text-center border-t border-slate-800 relative overflow-hidden">
          <div className="absolute inset-0 z-0">
             <div className="absolute top-0 right-[10%] w-96 h-96 bg-[#f0a800] rounded-full blur-[150px] opacity-20"></div>
          </div>
          <div className="mx-auto max-w-3xl relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">Ready to secure your next land transaction?</h2>
            <p className="text-xl text-slate-300 font-medium mb-10 leading-relaxed">
              Join thousands of buyers, sellers, and registrars creating a safer real estate ecosystem.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-5">
               <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="px-8 py-4 bg-[#f0a800] text-[#002147] font-black rounded-xl shadow-lg hover:bg-yellow-400 transition-all hover:-translate-y-1 text-lg">
                 Search a Title Now
               </button>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-white px-6 py-10 border-t border-[#e7e3da]">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between text-sm text-[#8d7f5e]">
          
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f0a800]/20 text-[#f0a800]">
              <ShieldCheck size={20} />
            </div>
            <span className="text-lg font-black text-[#002147]">LandGuard</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-6 font-bold">
            <Link to="/about" className="hover:text-[#f0a800] transition-colors">About</Link>
            <Link to="/contact" className="hover:text-[#f0a800] transition-colors">Contact Us</Link>
            <Link to="/help" className="hover:text-[#f0a800] transition-colors" >Help Center</Link>
          </div>

          <div className="text-xs font-bold">
             © 2026 LandGuard. All rights reserved.
          </div>

        </div>
      </footer>
    </div>
  );
}