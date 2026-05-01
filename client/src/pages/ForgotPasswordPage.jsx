import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck, Mail, ArrowRight, ArrowLeft, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      await axios.post('https://landguard-backend-ar7b.onrender.com/api/auth/forgot-password', { email });
      
      setStatus('success');
    } catch (error) {
      console.error(error);
      setStatus('error');

      setErrorMessage(
        error.response?.data?.message || 
        "Something went wrong. Please check the email and try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
      
      <div className="w-full max-w-[480px] bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden relative">
        

        {status === 'loading' && (
           <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center"></div>
        )}

        <div className="p-8 sm:p-10 flex flex-col items-center">
          
          <div className="mb-6 flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f0a800]/20 text-[#f0a800] shadow-sm">
              {status === 'success' ? <CheckCircle size={36} className="text-green-600" /> : <ShieldCheck size={36} />}
            </div>
          </div>
          
          {status === 'success' ? (
             
             <div className="text-center animate-in zoom-in duration-300">
                <h1 className="text-[#002147] text-2xl font-bold mb-3">Check your inbox</h1>
                <p className="text-slate-500 text-sm leading-relaxed mb-8">
                  We have sent a password reset link to <br/>
                  <span className="font-bold text-[#002147]">{email}</span>. <br/>
                  Please check your spam folder if you don't see it.
                </p>
                <Link 
                  to="/login"
                  className="w-full flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-[#002147] font-bold py-3.5 px-6 rounded-xl transition-colors"
                >
                  Return to Login
                </Link>
             </div>
          ) : (
             <div className="w-full flex flex-col items-center animate-in fade-in duration-300">
                <h1 className="text-[#002147] text-2xl font-bold text-center mb-3">Forgot Password?</h1>
                <p className="text-slate-500 text-center text-sm leading-relaxed mb-6 max-w-xs mx-auto">
                  Enter the email address associated with your account and we will send you a link to reset your password.
                </p>
                
                {status === 'error' && (
                  <div className="w-full mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-sm font-medium rounded-lg flex items-start gap-3">
                     <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                     <span>{errorMessage}</span>
                  </div>
                )}

                <form className="w-full flex flex-col gap-5" onSubmit={handleSubmit}>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-[#002147] text-sm font-bold" htmlFor="email">Email Address</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <Mail size={20} />
                      </span>
                      <input 
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-[#f0a800] text-slate-900 transition-colors" 
                        id="email" 
                        name="email" 
                        placeholder="user@example.com" 
                        required 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={status === 'loading'}
                      />
                    </div>
                  </div>
                  
                  <button 
                    className="group w-full flex items-center justify-center gap-2 bg-[#f0a800] hover:bg-yellow-500 disabled:bg-[#f0a800]/70 text-[#002147] font-bold py-4 px-6 rounded-xl shadow-md transition-all mt-2 cursor-pointer disabled:cursor-not-allowed" 
                    type="submit"
                    disabled={status === 'loading'}
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Reset Link</span>
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                  
                </form>
                
                <div className="mt-8 pt-6 border-t border-slate-100 w-full flex justify-center">
                  <Link 
                    to="/login" 
                    className="group flex items-center gap-2 text-slate-500 hover:text-[#002147] text-sm font-bold transition-colors"
                  >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Login
                  </Link>
                </div>
             </div>
          )}
          
        </div>
      </div>

    </div>
  );
}