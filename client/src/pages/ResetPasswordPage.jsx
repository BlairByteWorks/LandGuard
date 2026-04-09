import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck, Lock, ArrowRight, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';

export default function ResetPasswordPage() {
  // Grab the secret token from the URL (e.g., /reset-password/:token)
  const { token } = useParams(); 
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // 1. Basic Validation
    if (password.length < 8) {
      setStatus('error');
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setStatus('error');
      setErrorMessage('Passwords do not match.');
      return;
    }

    setStatus('loading');

    try {
      // 2. Send the new password and the secret token to the backend
      await axios.post('http://localhost:5000/api/auth/reset-password', { 
        token: token,
        newPassword: password 
      });
      
      // 3. Show Success
      setStatus('success');
      
      // Optional: Auto-redirect to login after 3 seconds
      setTimeout(() => {
          navigate('/login');
      }, 3000);

    } catch (error) {
      console.error(error);
      setStatus('error');
      setErrorMessage(
        error.response?.data?.message || 
        "Failed to reset password. The link may have expired."
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
      
      {/* Centered Card */}
      <div className="w-full max-w-[480px] bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden relative">
        
        {/* Loading Overlay */}
        {status === 'loading' && (
           <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center"></div>
        )}

        <div className="p-8 sm:p-10 flex flex-col items-center">
          
          {/* Logo */}
          <div className="mb-6 flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f0a800]/20 text-[#f0a800] shadow-sm">
              {status === 'success' ? <CheckCircle size={36} className="text-green-600" /> : <ShieldCheck size={36} />}
            </div>
          </div>
          
          {status === 'success' ? (
             // --- SUCCESS STATE ---
             <div className="text-center animate-in zoom-in duration-300 w-full">
                <h1 className="text-[#002147] text-2xl font-bold mb-3">Password Reset!</h1>
                <p className="text-slate-500 text-sm leading-relaxed mb-8">
                  Your password has been successfully updated. You can now log in with your new credentials.
                </p>
                <Link 
                  to="/login"
                  className="w-full flex items-center justify-center bg-[#f0a800] hover:bg-yellow-500 text-[#002147] font-bold py-3.5 px-6 rounded-xl transition-colors shadow-sm"
                >
                  Proceed to Login
                </Link>
                <p className="text-xs text-slate-400 mt-4">Redirecting automatically...</p>
             </div>
          ) : (
             // --- FORM STATE ---
             <div className="w-full flex flex-col items-center animate-in fade-in duration-300">
                {/* Text Content */}
                <h1 className="text-[#002147] text-2xl font-bold text-center mb-3">Create New Password</h1>
                <p className="text-slate-500 text-center text-sm leading-relaxed mb-6 max-w-xs mx-auto">
                  Please enter your new password below. Make sure it is at least 8 characters long.
                </p>
                
                {/* Error Message Box */}
                {status === 'error' && (
                  <div className="w-full mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-sm font-medium rounded-lg flex items-start gap-3">
                     <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                     <span>{errorMessage}</span>
                  </div>
                )}

                {/* Form */}
                <form className="w-full flex flex-col gap-5" onSubmit={handleSubmit}>
                  
                  {/* New Password Input */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[#002147] text-sm font-bold" htmlFor="password">New Password</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <Lock size={20} />
                      </span>
                      <input 
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-[#f0a800] text-slate-900 transition-colors" 
                        id="password" 
                        placeholder="••••••••" 
                        required 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={status === 'loading'}
                      />
                    </div>
                  </div>

                  {/* Confirm Password Input */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[#002147] text-sm font-bold" htmlFor="confirmPassword">Confirm Password</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <Lock size={20} />
                      </span>
                      <input 
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-[#f0a800] text-slate-900 transition-colors" 
                        id="confirmPassword" 
                        placeholder="••••••••" 
                        required 
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={status === 'loading'}
                      />
                    </div>
                  </div>
                  
                  {/* Submit Button */}
                  <button 
                    className="group w-full flex items-center justify-center gap-2 bg-[#f0a800] hover:bg-yellow-500 disabled:bg-[#f0a800]/70 text-[#002147] font-bold py-4 px-6 rounded-xl shadow-md transition-all mt-2 cursor-pointer disabled:cursor-not-allowed" 
                    type="submit"
                    disabled={status === 'loading'}
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <span>Reset Password</span>
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                  
                </form>
             </div>
          )}
          
        </div>
      </div>

    </div>
  );
}