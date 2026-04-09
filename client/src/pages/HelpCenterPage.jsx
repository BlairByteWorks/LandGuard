import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Search, ChevronDown, ChevronUp, BookOpen, UserCircle, LogOut } from 'lucide-react';

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqId, setOpenFaqId] = useState(null);
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

  const faqs = [
    {
      id: 1,
      category: 'General',
      question: 'What is LandGuard?',
      answer: 'LandGuard is an intelligent property verification and valuation system designed for the Kenyan real estate market. We help buyers verify the chain of custody of a land title and provide AI-estimated market valuations to prevent fraud and price inflation.'
    },
    {
      id: 2,
      category: 'General',
      question: 'How do I reset my password?',
      answer: 'If you have forgotten your password, go to the Login page and click on "Forgot password?". Enter your registered email address, and we will send you a secure link to create a new password.'
    },
    {
      id: 3,
      category: 'Buyers',
      question: 'What is a Property Trust Report?',
      answer: 'A Trust Report is a comprehensive digital document generated when you search for a property. It includes the verified ownership history (Chain of Custody), current verification status, size, location, and an AI-generated fair market valuation.'
    },
    {
      id: 4,
      category: 'Buyers',
      question: 'Is the AI Valuation legally binding?',
      answer: 'No. The AI Valuation estimate is calculated using historical market data and regression analysis for informational purposes only. It is designed to flag suspiciously priced properties but does not replace a professional, legally-binding valuation report.'
    },
    {
      id: 5,
      category: 'Sellers',
      question: 'How do I upload my Title Deed?',
      answer: 'To list a property, log in to your Seller Dashboard, click "Add Listing", fill in the property details, and upload a clear PDF or image of your Title Deed. Your listing will remain "Pending" until verified by a Registrar.'
    },
    {
      id: 6,
      category: 'Sellers',
      question: 'How long does Registrar verification take?',
      answer: 'Once you submit a property listing, our partnered registrars typically verify the documents against official records within 24 to 48 business hours (East African Time).'
    },
    {
      id: 7,
      category: 'Security',
      question: 'Is my uploaded Title Deed public?',
      answer: 'No. Only authorized Registrars can view the actual document you upload for verification purposes. Buyers can only see the extracted, verified details (like the owner name and title number) in the Trust Report.'
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    return faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
           faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const toggleFaq = (id) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <div className="bg-[#f8f7f5] font-sans text-[#181610] antialiased min-h-screen flex flex-col">
      
      {/* Navbar */}
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
        {/* Header & Search */}
        <section className="bg-[#002147] text-white py-20 px-6 lg:px-20 text-center relative overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }}></div>
            <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
                <h1 className="text-4xl md:text-5xl font-black mb-6">How can we help you?</h1>
                
                {/* Search Bar */}
                <div className="w-full max-w-xl relative mt-4 shadow-2xl">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                        type="text"
                        placeholder="Search for articles, guides, or questions..."
                        className="w-full h-14 pl-12 pr-4 bg-white rounded-xl text-slate-900 border-none outline-none focus:ring-4 focus:ring-[#f0a800]/50 transition-all font-medium"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
        </section>

        <section className="relative py-24 px-6 lg:px-10 overflow-hidden">
            
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[#001733]/85 z-10 backdrop-blur-[2px]"></div>
                <img 
                    src="/help-bg.jpg" 
                    alt="Corporate Architecture Background" 
                    className="w-full h-full object-cover opacity-50" 
                />
            </div>

            <div className="relative z-20 max-w-[900px] mx-auto">
                
                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-slate-100">
                    <div className="text-center mb-10">
                        <div className="bg-blue-50 text-blue-600 px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-4 inline-block shadow-sm">
                            FAQs
                        </div>
                        <h2 className="text-3xl font-black text-[#002147]">Frequently Asked Questions</h2>
                    </div>

                    <div className="space-y-4">
                        {filteredFaqs.length > 0 ? (
                            filteredFaqs.map(faq => (
                                <div 
                                    key={faq.id} 
                                    className={`bg-white border rounded-2xl overflow-hidden transition-all duration-200 ${
                                        openFaqId === faq.id ? 'border-[#f0a800] shadow-md' : 'border-[#e7e3da] shadow-sm hover:border-[#002147]/30'
                                    }`}
                                >
                                    <button 
                                        onClick={() => toggleFaq(faq.id)}
                                        className="w-full px-6 py-5 text-left flex justify-between items-center gap-4 focus:outline-none"
                                    >
                                        <span className={`font-bold text-lg ${openFaqId === faq.id ? 'text-[#002147]' : 'text-slate-800'}`}>
                                            {faq.question}
                                        </span>
                                        <div className={`shrink-0 p-1 rounded-full transition-colors ${openFaqId === faq.id ? 'bg-[#f0a800]/20 text-[#f0a800]' : 'bg-slate-100 text-slate-400'}`}>
                                            {openFaqId === faq.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                        </div>
                                    </button>
                                    
                                    {openFaqId === faq.id && (
                                        <div className="px-6 pb-6 animate-in slide-in-from-top-2 duration-200">
                                            <div className="pt-4 border-t border-slate-100 text-slate-600 leading-relaxed">
                                                {faq.answer}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
                                <BookOpen size={48} className="mx-auto text-slate-300 mb-4" />
                                <h3 className="text-xl font-bold text-[#002147]">No results found</h3>
                                <p className="text-slate-500 mt-2">Try adjusting your search terms to find what you're looking for.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-12 bg-[#002147] rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-xl border border-white/10">
                    <div className="absolute -top-10 -right-10 bg-[#f0a800] w-40 h-40 rounded-full blur-3xl opacity-20"></div>
                    <div className="absolute -bottom-10 -left-10 bg-[#00D170] w-40 h-40 rounded-full blur-3xl opacity-10"></div>
                    
                    <div className="relative z-10">
                        <h3 className="text-2xl sm:text-3xl font-black mb-3">Still have questions?</h3>
                        <p className="text-slate-300 mb-8 max-w-xl mx-auto">
                            If you cannot find the answer you are looking for in our FAQs, our support team is ready to assist you.
                        </p>
                        <Link to="/contact" className="inline-flex items-center justify-center bg-[#f0a800] text-[#002147] px-8 py-3.5 rounded-xl font-bold shadow-lg hover:bg-yellow-500 transition-all hover:scale-105">
                            Contact Support
                        </Link>
                    </div>
                </div>

            </div>
        </section>
      </main>

      {/* Standard Footer */}
      <footer className="bg-white px-6 py-10 border-t border-[#e7e3da] mt-auto relative z-30">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between text-sm text-[#8d7f5e]">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f0a800]/20 text-[#f0a800]">
              <ShieldCheck size={20} />
            </div>
            <span className="text-lg font-bold text-[#002147]">LandGuard</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 font-medium">
            <Link to="/about" className="hover:text-[#f0a800] transition-colors">About</Link>
            <Link to="/contact" className="hover:text-[#f0a800] transition-colors">Contact Us</Link>
          </div>

          <div className="text-xs font-medium">
             © 2026 LandGuard. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}