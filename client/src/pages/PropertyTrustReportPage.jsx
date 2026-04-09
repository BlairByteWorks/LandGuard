import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  ShieldCheck, User, MapPin, Maximize, Hash, 
  AlertTriangle, Zap, CheckCircle, Loader2, ArrowLeft,
  BarChart3, XCircle, Hourglass
} from 'lucide-react';

export default function PropertyTrustReportPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const userName = localStorage.getItem('userName') || 'Buyer';
  
  // We use state for the title so we can update it without reloading the page
  const [currentTitle, setCurrentTitle] = useState(location.state?.titleNumber || '');
  
  const [propertyData, setPropertyData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!currentTitle) {
      navigate('/');
      return;
    }

    const fetchProperty = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await axios.post('http://localhost:5000/api/properties/search', 
          { titleNumber: currentTitle },
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        setPropertyData(response.data);
      } catch (err) {
        console.error("Error fetching property:", err);
        setError(err.response?.data?.message || 'Property not found in the registry.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [currentTitle, navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center font-sans">
        <Loader2 size={48} className="animate-spin text-[#002147] mb-4" />
        <h2 className="text-xl font-bold text-[#002147]">Generating Trust Report...</h2>
        <p className="text-slate-500 mt-2">Running AI valuation and checking custody chain.</p>
      </div>
    );
  }

  // Set up dynamic styling variables based on status
  let dbStatus = 'Pending';
  let trustScore = 0;
  let trustLabel = '';
  let trustColor = '';
  let trustBg = '';
  let trustBorder = '';

  if (propertyData && propertyData.overview) {
      dbStatus = propertyData.overview.status;
      
      if (dbStatus === 'Verified') {
          trustScore = 98;
          trustLabel = 'High Integrity';
          trustColor = 'text-green-800';
          trustBg = 'bg-green-50';
          trustBorder = 'border-green-200';
      } else if (dbStatus === 'Pending') {
          trustScore = 45;
          trustLabel = 'Awaiting Verification';
          trustColor = 'text-yellow-800';
          trustBg = 'bg-yellow-50';
          trustBorder = 'border-yellow-200';
      } else {
          trustScore = 12;
          trustLabel = 'High Risk / Rejected';
          trustColor = 'text-red-800';
          trustBg = 'bg-red-50';
          trustBorder = 'border-red-200';
      }
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans text-slate-800 flex flex-col">
      
      {/* NAVIGATION BAR */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-50">
         <Link to="/" className="flex items-center gap-2 font-black text-xl text-[#002147]">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-[#F2A900]/20 text-[#F2A900]">
              <ShieldCheck size={20} />
            </div>
            LandGuard
         </Link>

         <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500">
            <Link to="/" className="hover:text-[#F2A900] transition-colors">New Search</Link>
            <span className="text-[#F2A900] border-b-2 border-[#F2A900] pb-1">Current Trust Report</span>
         </div>
         
         <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 bg-slate-100 pl-3 pr-1 py-1 rounded-full border border-slate-200">
             <span className="font-bold text-sm text-[#002147] hidden sm:block">{userName}</span>
             <div className="h-8 w-8 rounded-full bg-[#002147] text-white flex items-center justify-center text-xs font-bold">
               {userName.charAt(0).toUpperCase()}
             </div>
           </div>
           <button onClick={handleLogout} className="text-sm font-bold text-red-500 hover:text-red-700 transition-colors">
             Logout
           </button>
         </div>
      </nav>
      
      {/* MAIN CONTENT AREA */}
      <main className="flex-grow w-full max-w-[1200px] mx-auto px-4 sm:px-6 mt-8 pb-12">
        
        {error ? (
           <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center max-w-2xl mx-auto mt-10">
              <div className="mx-auto w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
                 <AlertTriangle size={32} />
              </div>
              <h2 className="text-2xl font-black text-[#002147] mb-2">Record Not Found</h2>
              <p className="text-slate-500 mb-8">{error}</p>
              <Link to="/" className="inline-flex items-center gap-2 bg-[#F2A900] text-[#002147] px-6 py-3 rounded-xl font-bold hover:bg-yellow-500 transition-colors">
                 <ArrowLeft size={18} /> Back to Search
              </Link>
           </div>
        ) : propertyData ? (
           <div className="animate-in fade-in duration-500">
              
              {/* Report Header */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
                 <div>
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h1 className="text-3xl font-black text-[#002147]">
                        Property Report: {propertyData.overview.titleNumber}
                        </h1>
                        
                        {dbStatus === 'Verified' && (
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded text-xs font-black flex items-center gap-1 uppercase tracking-wider">
                            <CheckCircle size={14}/> Verified
                            </span>
                        )}
                        {dbStatus === 'Pending' && (
                            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded text-xs font-black flex items-center gap-1 uppercase tracking-wider">
                            <Hourglass size={14}/> Pending
                            </span>
                        )}
                        {dbStatus === 'Rejected' && (
                            <span className="bg-red-100 text-red-700 px-3 py-1 rounded text-xs font-black flex items-center gap-1 uppercase tracking-wider">
                            <XCircle size={14}/> Rejected
                            </span>
                        )}
                    </div>
                    <p className="text-slate-500 text-sm font-medium">
                        Report generated on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} • Ref: LG-{Math.floor(1000 + Math.random() * 9000)}-X
                    </p>
                 </div>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 
                 {/* LEFT COLUMN (Overview & Custody) */}
                 <div className="space-y-6">
                    
                    {/* Property Overview Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                       <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                         <h2 className="text-lg font-black text-[#002147]">Property Overview</h2>
                       </div>
                       
                       <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
                          <div className="p-6 flex items-start gap-4">
                             <div className="mt-1 text-slate-400 bg-slate-100 p-2 rounded-lg"><MapPin size={20} /></div>
                             <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Location</p>
                                <p className="text-[#002147] font-bold text-lg">{propertyData.overview.locationWard || propertyData.overview.location}</p>
                             </div>
                          </div>
                          
                          <div className="p-6 flex items-start gap-4">
                             <div className="mt-1 text-slate-400 bg-slate-100 p-2 rounded-lg"><User size={20} /></div>
                             <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Registered Owner</p>
                                <p className="text-[#002147] font-bold text-lg flex items-center gap-2">
                                    {propertyData.overview.currentOwnerID?.name || propertyData.overview.ownerId?.name || 'Verified Owner'}
                                    {dbStatus === 'Verified' && <CheckCircle size={16} className="text-[#00D170]"/>}
                                </p>
                             </div>
                          </div>
                          
                          <div className="p-6 flex items-start gap-4 border-t border-slate-100">
                             <div className="mt-1 text-slate-400 bg-slate-100 p-2 rounded-lg"><Maximize size={20} /></div>
                             <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Size</p>
                                <p className="text-[#002147] font-bold text-lg">{propertyData.overview.sizeAcres} Acres</p>
                             </div>
                          </div>
                          
                          <div className="p-6 flex items-start gap-4 border-t border-slate-100">
                             <div className="mt-1 text-slate-400 bg-slate-100 p-2 rounded-lg"><Hash size={20} /></div>
                             <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Title Number</p>
                                <p className="text-[#002147] font-bold text-lg">{propertyData.overview.titleNumber}</p>
                             </div>
                          </div>
                       </div>
                    </div>

                    {/* Chain of Custody Card */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                       <div className="flex justify-between items-end mb-6">
                          <h2 className="text-lg font-black text-[#002147]">Chain of Custody</h2>
                          <span className="text-xs font-bold text-[#F2A900] uppercase tracking-wider cursor-pointer hover:underline">Full History</span>
                       </div>
                       
                       <div className="relative border-l-2 border-slate-200 ml-2 space-y-8 pb-2">
                          {/* Current Status Node */}
                          <div className="relative pl-6">
                             <div className={`absolute w-4 h-4 rounded-full -left-[9px] top-1 ring-4 ring-white shadow-sm ${
                                dbStatus === 'Verified' ? 'bg-[#00D170]' : 
                                dbStatus === 'Pending' ? 'bg-[#F2A900]' : 'bg-red-500'
                             }`}></div>
                             
                             <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${
                                dbStatus === 'Verified' ? 'text-[#00D170]' : 
                                dbStatus === 'Pending' ? 'text-[#F2A900]' : 'text-red-500'
                             }`}>
                                Current Status: {dbStatus}
                             </div>
                             
                             <div className="font-black text-[#002147] text-base">
                                {dbStatus === 'Verified' ? 'Transfer to New Owner Confirmed' : 
                                 dbStatus === 'Pending' ? 'Transfer Pending Verification' : 'Transfer Rejected'}
                             </div>
                             
                             <div className="text-sm text-slate-500 mt-1 mb-2 leading-relaxed">
                                {dbStatus === 'Verified' ? 'Registration officially completed via LandGuard Registrar validation.' : 
                                 dbStatus === 'Pending' ? 'Seller has uploaded documents. Waiting for Registrar approval.' : 
                                 'WARNING: The registrar declined this listing. Potential fraud detected.'}
                             </div>
                             
                             <span className="inline-block bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded border border-slate-200">
                                Doc: #TR-{Math.floor(10000 + Math.random() * 90000)}
                             </span>
                          </div>

                          {/* DYNAMIC HISTORICAL NODES GENERATED FROM DATABASE */}
                          {propertyData.chainOfCustody && propertyData.chainOfCustody.length > 0 ? (
                             propertyData.chainOfCustody.map((log, idx) => (
                                <div key={idx} className="relative pl-6 opacity-50">
                                   <div className="absolute w-3 h-3 bg-slate-300 rounded-full -left-[7px] top-1.5 ring-4 ring-white"></div>
                                   <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                                      {new Date(log.transferDate).getFullYear()}
                                   </div>
                                   <div className="font-bold text-slate-700">Transferred to: {log.newOwner}</div>
                                   <div className="text-sm text-slate-500 mt-1 leading-relaxed">
                                      Previous Owner: {log.previousOwner}
                                   </div>
                                   <div className="mt-2 inline-block bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                                      Ref: {log.verifiedBy}
                                   </div>
                                </div>
                             ))
                          ) : (
                             <p className="text-sm text-slate-400 italic mt-4 pl-6">No historical records found.</p>
                          )}
                       </div>
                    </div>

                 </div>

                 {/* RIGHT COLUMN (Valuation & Trust Score) */}
                 <div className="space-y-6">
                    
                    {/* AI Valuation Card */}
                    <div className={`bg-gradient-to-b ${(propertyData.valuation?.isHighRisk || dbStatus === 'Rejected') ? 'from-red-50' : 'from-[#fffbeb]'} to-white rounded-xl shadow-md border-2 ${(propertyData.valuation?.isHighRisk || dbStatus === 'Rejected') ? 'border-red-200' : 'border-[#F2A900]/30'} overflow-hidden relative`}>
                       <BarChart3 size={120} className={`absolute -right-6 -top-6 rotate-12 pointer-events-none ${(propertyData.valuation?.isHighRisk || dbStatus === 'Rejected') ? 'text-red-500/10' : 'text-[#F2A900]/10'}`} />
                       
                       <div className="p-6 relative z-10">
                          <div className="flex items-center gap-2 mb-4">
                             <div className={`${(propertyData.valuation?.isHighRisk || dbStatus === 'Rejected') ? 'bg-red-500' : 'bg-[#F2A900]'} p-1.5 rounded text-white`}>
                                <Zap size={16} fill="currentColor"/>
                             </div>
                             <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest">AI Estimated Market Value</h2>
                          </div>
                          
                          {/* 1. REAL AI VALUE (Replaced the asking price) */}
                          <div className="text-3xl sm:text-5xl font-black text-[#002147] tracking-tight mb-2">
                             Ksh {propertyData.valuation?.estimatedValue?.toLocaleString() || "Pending"}
                          </div>
                          
                          {/* 2. REAL MATH RANGE */}
                          <p className="text-sm font-medium text-slate-500 mb-4">
                             Range: {(propertyData.valuation?.estimatedValue * 0.90 / 1000000).toFixed(1)}M - {(propertyData.valuation?.estimatedValue * 1.10 / 1000000).toFixed(1)}M
                          </p>

                          {/* 3. DYNAMIC HIGH RISK WARNING (Triggers if variance > 20%) */}
                          {propertyData.valuation?.isHighRisk && (
                             <div className="bg-red-100 text-red-700 p-3 rounded-lg flex items-start gap-2 mb-6 border border-red-200 animate-in fade-in slide-in-from-top-2">
                                <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                                <p className="text-xs font-bold leading-relaxed">
                                   High Risk Warning: The seller's asking price has a {propertyData.valuation?.variancePercentage}% variance from the AI's fair market value. Proceed with caution.
                                </p>
                             </div>
                          )}
                          
                          <div className="mb-2 text-sm font-bold text-[#002147] flex justify-between">
                             <span>AI Confidence Score</span>
                             <span className={(propertyData.valuation?.isHighRisk || dbStatus === 'Rejected') ? 'text-red-500' : 'text-[#F2A900]'}>
                                {propertyData.valuation?.confidence || 85}%
                             </span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2 mb-3">
                             <div className={`${(propertyData.valuation?.isHighRisk || dbStatus === 'Rejected') ? 'bg-red-500' : 'bg-[#F2A900]'} h-2 rounded-full`} style={{width: `${propertyData.valuation?.confidence || 85}%`}}></div>
                          </div>
                          <p className="text-[12px] text-slate-400 font-medium mb-6 leading-relaxed">
                             Based on recent verified sales in {propertyData.overview.locationWard || "this area"} and specific land characteristics. This estimate does not constitute a legal valuation.
                          </p>

                          <button className={`w-full py-3 bg-white border font-bold rounded-lg transition-colors text-sm shadow-sm ${(propertyData.valuation?.isHighRisk || dbStatus === 'Rejected') ? 'border-red-500 text-red-500 hover:bg-red-50' : 'border-[#F2A900] text-[#F2A900] hover:bg-[#fffbeb]'}`}>
                             View Detailed Valuation Metrics
                          </button>
                       </div>
                    </div>

                    {/* Trust Score Banner */}
                    <div className={`${trustBg} border ${trustBorder} rounded-xl p-6 flex items-center justify-between shadow-sm transition-colors duration-500`}>
                       <div className="flex items-center gap-4">
                          <div className={`${dbStatus === 'Verified' ? 'bg-green-600' : dbStatus === 'Pending' ? 'bg-yellow-500' : 'bg-red-600'} text-white p-3 rounded-lg shadow-sm transition-colors`}>
                             {dbStatus === 'Verified' ? <ShieldCheck size={28} /> : dbStatus === 'Pending' ? <AlertTriangle size={28} /> : <XCircle size={28} />}
                          </div>
                          <div>
                             <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${trustColor} opacity-70`}>Overall Trust Score</p>
                             <p className={`${trustColor} font-black text-xl leading-none`}>{trustLabel}</p>
                          </div>
                       </div>
                       <div className={`text-4xl font-black ${trustColor}`}>
                          {trustScore}<span className="text-xl opacity-50">/100</span>
                       </div>
                    </div>

                 </div>
              </div>
           </div>
        ) : null}
      </main>

      {/* FOOTER */}
      <footer className="bg-white px-6 py-10 border-t border-slate-200 mt-auto">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-6 md:flex-row md:items-center md:justify-between text-sm text-slate-500">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F2A900]/20 text-[#F2A900]">
              <ShieldCheck size={20} />
            </div>
            <span className="text-lg font-bold text-[#002147]">LandGuard</span>
          </div>
          <div className="flex flex-wrap items-center gap-6 font-medium">
            <Link to="/about" className="hover:text-[#f0a800] transition-colors">About</Link>
            <Link to="/contact" className="hover:text-[#f0a800] transition-colors">Contact Us</Link>
            <Link to="/help" className="hover:text-[#f0a800] transition-colors" >Help Center</Link>
          </div>
          <div className="text-xs font-medium">
             © 2026 LandGuard. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}