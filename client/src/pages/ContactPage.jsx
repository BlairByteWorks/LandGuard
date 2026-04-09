import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, MapPin, Phone, Mail, Clock, Send, CheckCircle, UserCircle, LogOut } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle');

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('submitting');
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    }, 1500);
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
        
        <section className="relative text-white py-24 px-6 lg:px-20 text-center overflow-hidden bg-[#002147]">
            <div className="absolute inset-0 z-0">
                <div className="absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-[#f0a800]/20 blur-[100px] z-10"></div>
                
            </div>

            <div className="relative z-20 max-w-2xl mx-auto flex flex-col items-center">
                <div className="bg-[#f0a800]/20 text-[#f0a800] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-[#f0a800]/30 backdrop-blur-sm">
                    Contact Us
                </div>
                <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight drop-shadow-md">
                    Get in Touch
                </h1>
                <p className="text-lg text-slate-200 leading-relaxed font-light drop-shadow-sm">
                    Have questions about verifying a title or partnering with LandGuard? Our Nairobi-based team is here to help you secure your investments.
                </p>
            </div>
        </section>

        
        <section className="relative py-24 px-6 lg:px-10 overflow-hidden">
            
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[#001733]/80 z-10 backdrop-blur-[2px]"></div>
                <img 
                    src="/contactpage-image.png" 
                    alt="Corporate Background" 
                    className="w-full h-full object-cover" 
                />
            </div>

            <div className="relative z-20 max-w-[1200px] mx-auto grid lg:grid-cols-5 gap-10 items-stretch">
                
                <div className="lg:col-span-2 bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-slate-100 flex flex-col justify-center transform transition-transform hover:-translate-y-1 duration-300">
                    <div>
                        <h2 className="text-3xl font-black text-[#002147] mb-6">Contact Information</h2>
                        <p className="text-slate-600 leading-relaxed mb-8">
                            Reach out to us through any of the channels below. For official legal inquiries, please visit our headquarters.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="bg-blue-50 p-3 rounded-xl text-blue-600 shrink-0 shadow-sm mt-0.5">
                                <MapPin size={22} />
                            </div>
                            <div>
                                <h3 className="font-bold text-[#002147] text-lg mb-1">LandGuard Headquarters</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">
                                    4th Floor, Blair Tower<br />
                                    K/N Road, Ridge<br />
                                    P.O. Box 12345 - 00100<br />
                                    Nairobi, Kenya
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="bg-green-50 p-3 rounded-xl text-green-600 shrink-0 shadow-sm mt-0.5">
                                <Phone size={22} />
                            </div>
                            <div>
                                <h3 className="font-bold text-[#002147] text-lg mb-1">Phone Lines</h3>
                                <p className="text-slate-600 text-sm flex flex-col gap-1">
                                    <span>Main: <a href="tel:+254201234567" className="hover:text-[#f0a800] font-medium">+254 20 123 456 789</a></span>
                                    <span>Support: <a href="tel:+254700000000" className="hover:text-[#f0a800] font-medium">+254 721 000 000</a></span>
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="bg-purple-50 p-3 rounded-xl text-purple-600 shrink-0 shadow-sm mt-0.5">
                                <Mail size={22} />
                            </div>
                            <div>
                                <h3 className="font-bold text-[#002147] text-lg mb-1">Email Address</h3>
                                <p className="text-slate-600 text-sm flex flex-col gap-1">
                                    <span><a href="mailto:support@landguard.co.ke" className="hover:text-[#f0a800] font-medium">support@landguard.co.ke</a></span>
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="bg-orange-50 p-3 rounded-xl text-orange-600 shrink-0 shadow-sm mt-0.5">
                                <Clock size={22} />
                            </div>
                            <div>
                                <h3 className="font-bold text-[#002147] text-lg mb-1">Business Hours (EAT)</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">
                                    Monday - Friday: 8:00 AM - 5:00 PM<br />
                                    Saturday: Closed<br />
                                    Sunday & Public Holidays: Closed
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-3 bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-slate-100 relative overflow-hidden h-full flex flex-col justify-center transform transition-transform hover:-translate-y-1 duration-300">
                    <div className="absolute -top-10 -right-10 bg-[#f0a800] h-40 w-40 rounded-full blur-3xl opacity-20"></div>
                    
                    {status === 'success' ? (
                        <div className="flex flex-col items-center justify-center text-center h-full py-12 animate-in zoom-in duration-300 relative z-10">
                            <div className="h-20 w-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
                                <CheckCircle size={40} />
                            </div>
                            <h3 className="text-3xl font-black text-[#002147] mb-3">Message Sent!</h3>
                            <p className="text-slate-600 text-lg leading-relaxed">
                                Asante! We have received your message and our team will get back to you shortly.
                            </p>
                        </div>
                    ) : (
                        <div className="relative z-10">
                            <h3 className="text-3xl font-black text-[#002147] mb-8">Send us a Message</h3>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-[#002147]">Full Name</label>
                                        <input 
                                            type="text" 
                                            required
                                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#f0a800] focus:ring-2 focus:ring-[#f0a800]/20 transition-all font-medium"
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-[#002147]">Email Address</label>
                                        <input 
                                            type="email" 
                                            required
                                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#f0a800] focus:ring-2 focus:ring-[#f0a800]/20 transition-all font-medium"
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#002147]">Subject</label>
                                    <select 
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#f0a800] focus:ring-2 focus:ring-[#f0a800]/20 transition-all font-medium"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                    >
                                        <option value="">Select a topic...</option>
                                        <option value="verification">Title Verification Issue</option>
                                        <option value="valuation">AI Valuation Query</option>
                                        <option value="other">Other Inquiry</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#002147]">Your Message</label>
                                    <textarea 
                                        required 
                                        placeholder="How can we help you today?"
                                        rows="5"
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-4 focus:outline-none focus:border-[#f0a800] focus:ring-2 focus:ring-[#f0a800]/20 transition-all resize-none font-medium"
                                        value={formData.message}
                                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                                    ></textarea>
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={status === 'submitting'}
                                    className="w-full flex items-center justify-center gap-2 bg-[#f0a800] hover:bg-[#d69500] text-[#002147] font-black text-lg py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                                >
                                    {status === 'submitting' ? 'Sending Message...' : (
                                        <>Send Message <Send size={20} className="ml-1" /></>
                                    )}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </section>
      </main>

      <footer className="bg-white px-6 py-10 border-t border-[#e7e3da] mt-auto">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between text-sm text-[#8d7f5e]">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f0a800]/20 text-[#f0a800]">
              <ShieldCheck size={20} />
            </div>
            <span className="text-lg font-bold text-[#002147]">LandGuard</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-6 font-medium">
            <Link to="/about" className="hover:text-[#f0a800] transition-colors">About</Link>
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