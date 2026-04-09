import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

export default function LoginRegisterPage() {
    const [tab, setTab] = useState('login');
    const navigate = useNavigate();

    const [name, setName] = useState(''); 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('buyer'); 
    
    const [errorMessage, setErrorMessage] = useState(''); 
    const [successMessage, setSuccessMessage] = useState('');

    const activeClasses = 'bg-white text-[#002147] shadow-sm';
    const inactiveClasses = 'text-slate-500 hover:text-[#002147] bg-transparent shadow-none';

    const handleAuth = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        try {
            if (tab === 'register') {

                const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
                if (!passwordRegex.test(password)) {
                    setErrorMessage("Password must be at least 8 characters long and contain an uppercase letter, a lowercase letter, and a number!");
                    return;
                }
                
                if (password !== confirmPassword) {
                    setErrorMessage("Passwords do not match!");
                    return;
                }

                await axios.post('http://localhost:5000/api/auth/register', {
                    name: name || "New User", 
                    email: email,
                    password: password,
                    role: role.charAt(0).toUpperCase() + role.slice(1) 
                });

                setSuccessMessage('Registration successful! Please log in.');
                setTab('login'); 
                setName(''); 
                setPassword(''); 
                setConfirmPassword('');
                
            } else {
                const response = await axios.post('http://localhost:5000/api/auth/login', {
                    email: email,
                    password: password
                });
                
                // Clear old ghost data
                localStorage.clear(); 
                
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userName', response.data.name || "Buyer"); 
                localStorage.setItem('userEmail', response.data.email || email); 
                localStorage.setItem('userRole', response.data.role); 
                
                const userRole = response.data.role;
                if (userRole === 'Buyer') {
                    
                    navigate('/'); 
                } else if (userRole === 'Seller') {
                    navigate('/seller-upload');
                } else {
                    navigate('/registrar-verify');
                }
            }
        } catch (error) {
            console.error("Auth Error:", error);
            if (error.response && error.response.data) {
                setErrorMessage(error.response.data.message || 'An error occurred.');
            } else {
                setErrorMessage('Cannot connect to server. Is it running on port 5000?');
            }
        }
    };

    return (
        <div className="bg-slate-100 min-h-screen flex items-center justify-center p-4 font-sans">
            <main className="w-full max-w-[1100px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[600px] border border-slate-200">

                <section className="lg:w-5/12 bg-[#002147] relative p-10 flex flex-col justify-between text-white overflow-hidden">
                    <Link to="/" className="relative z-10 flex items-center gap-3">
                        <div className="size-10 bg-[#f0a800] text-[#002147] rounded-lg flex items-center justify-center shadow-lg">
                        
                            <ShieldCheck size={24} strokeWidth={2.5} />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight">LandGuard</h1>
                    </Link>

                    <div className="relative z-10 my-auto py-12">
                        <h2 className="text-3xl lg:text-4xl font-bold leading-tight mb-4">Secure Real Estate Management</h2>
                        <p className="text-slate-300 text-lg font-light leading-relaxed max-w-sm">
                            Connect with verified buyers, sellers, and agents in a trusted environment built for transparency.
                        </p>
                    </div>
                </section>

                <section className="lg:w-7/12 p-8 lg:p-16 bg-white flex flex-col justify-center relative">
                    <Link to="/" className="absolute top-6 right-6 md:top-8 md:right-8 flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-[#002147] transition-colors">
                        <ArrowLeft size={16} /> Back to Home
                    </Link>
                    <div className="max-w-md mx-auto w-full">
                        <div className="flex p-1 bg-slate-100 rounded-lg mb-8 relative">
                            <button
                                className={`flex-1 py-3 text-sm font-bold rounded-md transition-all duration-200 ${tab === 'login' ? activeClasses : inactiveClasses}`}
                                onClick={() => { setTab('login'); setErrorMessage(''); setSuccessMessage(''); }}
                            >
                                Log In
                            </button>
                            <button
                                className={`flex-1 py-3 text-sm font-bold rounded-md transition-all duration-200 ${tab === 'register' ? activeClasses : inactiveClasses}`}
                                onClick={() => { setTab('register'); setErrorMessage(''); setSuccessMessage(''); }}
                            >
                                Register
                            </button>
                        </div>

                        {errorMessage && <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg text-sm font-bold border border-red-200">{errorMessage}</div>}
                        {successMessage && <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg text-sm font-bold border border-green-200">{successMessage}</div>}


                        {tab === 'login' && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <div className="text-center mb-6">
                                    <h3 className="text-2xl font-bold text-[#002147]">Welcome Back</h3>
                                </div>

                                <form className="space-y-5" onSubmit={handleAuth}>
                                    <label className="block">
                                        <span className="block text-sm font-bold text-[#002147] mb-2">Email Address</span>
                                        <input 
                                            className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-[#f0a800] text-slate-900 transition-colors" 
                                            placeholder="Enter registered email address" type="email" required
                                            value={email} onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </label>
                                    
                                    
                                    <div className="block">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-bold text-[#002147]">Password</span>
                                            <Link to="/forgot-password" className="text-sm font-bold text-[#f0a800] hover:text-yellow-600 transition-colors">
                                                Forgot password?
                                            </Link>
                                        </div>
                                        <input 
                                            className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-[#f0a800] text-slate-900 transition-colors" 
                                            placeholder="Enter your password" type="password" required
                                            value={password} onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>

                                    <button type="submit" className="w-full flex items-center justify-center bg-[#f0a800] text-[#002147] font-bold py-4 px-4 rounded-xl shadow-md hover:bg-yellow-500 transition-all cursor-pointer">
                                        Sign In
                                    </button>
                                </form>
                            </div>
                        )}

                        {tab === 'register' && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <div className="text-center mb-6">
                                    <h3 className="text-2xl font-bold text-[#002147]">Create Account</h3>
                                </div>

                                <form className="space-y-4" onSubmit={handleAuth}>
                                    <label className="block">
                                        <span className="block text-sm font-bold text-[#002147] mb-2">I am a</span>
                                        <select 
                                            className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-[#f0a800] text-slate-900 cursor-pointer"
                                            value={role} onChange={(e) => setRole(e.target.value)}
                                        >
                                            <option value="buyer">Property Buyer</option>
                                            <option value="seller">Property Seller</option>    
                                        </select>
                                    </label>

                                    <label className="block">
                                        <span className="block text-sm font-bold text-[#002147] mb-2">Full Name</span>
                                        <input 
                                            className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-[#f0a800] text-slate-900 transition-colors" 
                                            placeholder="Enter your full name" type="text" required
                                            value={name} onChange={(e) => setName(e.target.value)}
                                        />
                                    </label>

                                    <label className="block">
                                        <span className="block text-sm font-bold text-[#002147] mb-2">Email Address</span>
                                        <input 
                                            className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-[#f0a800] text-slate-900 transition-colors" 
                                            placeholder="Enter your valid email address" type="email" required
                                            value={email} onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </label>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <label className="block">
                                            <span className="block text-sm font-bold text-[#002147] mb-2">Password</span>
                                            <input className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-[#f0a800] text-slate-900 transition-colors" placeholder="Min. 8 chars" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                                        </label>
                                        <label className="block">
                                            <span className="block text-sm font-bold text-[#002147] mb-2">Confirm</span>
                                            <input className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-[#f0a800] text-slate-900 transition-colors" placeholder="Confirm password" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                        </label>
                                    </div>

                                    <button type="submit" className="w-full flex justify-center bg-[#f0a800] hover:bg-yellow-500 text-[#002147] font-black text-lg py-4 px-4 rounded-xl shadow-md transition-all mt-4 cursor-pointer">
                                        Create Account
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}