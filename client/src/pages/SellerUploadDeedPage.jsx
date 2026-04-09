import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ShieldCheck, LayoutDashboard, Home, PlusCircle, Settings, Bell, HelpCircle, 
  FileText, Hash, MapPin, Maximize, DollarSign, UploadCloud, CheckCircle, 
  LogOut, Loader2, AlertTriangle, FileUp, Clock, Activity 
} from 'lucide-react';

export default function SellerUploadDeedPage() {
  const navigate = useNavigate();

  // Safely grab user details
  const userName = localStorage.getItem('userName') || 'Seller';
  const userEmail = localStorage.getItem('userEmail') || 'Email not found';
  
  const [activeView, setActiveView] = useState('dashboard'); 
  
  // Form State
  const [titleNumber, setTitleNumber] = useState('');
  const [locationWard, setLocationWard] = useState('');
  const [sizeAcres, setSizeAcres] = useState('');
  const [listingPrice, setListingPrice] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  
  // File Upload State
  const [fileName, setFileName] = useState(''); 
  const [fileBase64, setFileBase64] = useState('');   
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // My Properties State
  const [myProperties, setMyProperties] = useState([]);
  const [isLoadingProps, setIsLoadingProps] = useState(true);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const fetchMyProperties = async () => {
    setIsLoadingProps(true);
    try {
      const response = await axios.get('http://localhost:5000/api/properties/me', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMyProperties(response.data);
    } catch (error) {
      console.error("Fetch Error:", error);
      // Auto-logout if token is expired or invalid
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        handleLogout();
      }
      setMyProperties([]); 
    } finally {
      setIsLoadingProps(false);
    }
  };

  useEffect(() => {
    if (activeView === 'list' || activeView === 'dashboard') {
      fetchMyProperties();
    }
  }, [activeView]);

  // --- HANDLE FILE UPLOAD ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if file is too large (e.g., > 10MB) to prevent browser crashing before Base64
      if (file.size > 10 * 1024 * 1024) {
        setStatusMessage({ type: 'error', text: 'File is too large. Please upload a document under 10MB.' });
        return;
      }

      setFileName(file.name);
      
      // Convert file to Base64 string for easy JSON transport
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setFileBase64(reader.result);
        setStatusMessage({ type: '', text: '' });
      };
      reader.onerror = (error) => {
        console.error("Error reading file:", error);
        setStatusMessage({ type: 'error', text: 'Failed to read file.' });
      };
    }
  };

  // --- SUBMIT FUNCTION ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Ensure a file was uploaded before submitting
    if (!fileBase64) {
      setStatusMessage({ type: 'error', text: 'Please upload a Title Deed document.' });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage({ type: '', text: '' });

    try {
      await axios.post('http://localhost:5000/api/properties/add', {
        titleNumber,
        locationWard, 
        sizeAcres,
        listingPrice,
        deedDocument: fileBase64 // Send the Base64 document to the backend
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      setStatusMessage({ type: 'success', text: "Property successfully submitted!" });
      setTitleNumber('');
      setLocationWard('');
      setSizeAcres('');
      setListingPrice('');
      setAdditionalNotes('');
      setFileName('');
      setFileBase64('');
      
      setTimeout(() => { setActiveView('list'); }, 2000);

    } catch (error) {
      console.error(error);
      
      // Catch expired token and log user out automatically
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        setStatusMessage({ type: 'error', text: 'Your session has expired. Logging you out...' });
        setTimeout(() => {
          handleLogout();
        }, 2000);
      } else if (error.response && error.response.status === 413) {
        // Catch "Payload Too Large" error specifically
        setStatusMessage({ type: 'error', text: 'File is too large for the server. Check backend JSON limits.' });
      } else {
        setStatusMessage({ type: 'error', text: error.response?.data?.message || 'Submission failed. Make sure all fields are valid.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalListings = myProperties.length;
  const totalValue = myProperties.reduce((sum, p) => sum + (Number(p.listingPrice) || 0), 0);
  const pendingCount = myProperties.filter(p => p.status === 'Pending').length;

  return (
    <div className="min-h-screen flex bg-[#0F172A] font-sans text-slate-200">
       
       {/* Sidebar */}
       <aside className="w-72 bg-[#0B1120] border-r border-slate-800 flex flex-col min-h-screen shrink-0 z-10 relative">
          <div className="p-8">
            <Link to="/" className="flex items-center gap-3">
               <div className="bg-[#00D170] p-2 rounded-lg"><ShieldCheck className="text-[#0B1120]" size={24} /></div>
               <div>
                  <h1 className="font-bold text-xl text-white tracking-tight leading-none">LandGuard</h1>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Seller Portal</p>
               </div>
            </Link>
          </div>
          
          <nav className="flex-1 px-4 space-y-2 mt-4">
             <button onClick={() => setActiveView('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold ${activeView === 'dashboard' ? 'bg-[#00D170] text-[#0B1120]' : 'text-slate-400 hover:text-white'}`}><LayoutDashboard size={20} /> Dashboard</button>
             <button onClick={() => setActiveView('list')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold ${activeView === 'list' ? 'bg-[#00D170] text-[#0B1120]' : 'text-slate-400 hover:text-white'}`}><Home size={20} /> My Properties</button>
             <button onClick={() => setActiveView('add')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold ${activeView === 'add' ? 'bg-[#00D170] text-[#0B1120]' : 'text-slate-400 hover:text-white'}`}><PlusCircle size={20} /> Add Listing</button>
          </nav>

          <div className="p-4 mt-auto">
             <div className="bg-[#1E293B] rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-4">
                   <div className="h-10 w-10 rounded-full bg-[#00D170] text-[#0B1120] flex items-center justify-center font-black text-lg shrink-0">
                      {userName.charAt(0).toUpperCase()}
                   </div>
                   <div className="overflow-hidden">
                      <p className="font-bold text-white text-sm truncate">{userName}</p>
                      <p className="text-xs text-slate-400 truncate">{userEmail}</p>
                   </div>
                </div>
                <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-slate-300 hover:text-white py-2.5 px-4 rounded-lg bg-slate-800 border border-slate-700 transition-all"><LogOut size={16} /> Logout</button>
             </div>
          </div>
       </aside>
       
       <main className="flex-1 flex flex-col h-screen overflow-y-auto">
          <header className="h-20 border-b border-slate-800 flex items-center justify-between px-10 bg-[#0B1120]/50 backdrop-blur-md sticky top-0 z-10">
             <div className="flex items-center gap-2 text-sm font-medium">
                <span className="text-slate-400">Dashboard</span><span className="text-slate-600">/</span><span className="text-[#00D170] capitalize">{activeView}</span>
             </div>
          </header>

          <div className="p-10 max-w-7xl w-full mx-auto">
             {/* DASHBOARD VIEW */}
             {activeView === 'dashboard' && (
               <div className="animate-in fade-in duration-300">
                  <div className="mb-8"><h2 className="text-3xl font-bold text-white">Seller Overview</h2></div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                     <div className="bg-[#1E293B] p-6 rounded-2xl border border-slate-800">
                       <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Total Listings</p>
                       <h3 className="text-3xl font-black text-white">{isLoadingProps ? '-' : totalListings}</h3>
                     </div>
                     <div className="bg-[#1E293B] p-6 rounded-2xl border border-slate-800">
                       <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Portfolio Value</p>
                       <h3 className="text-3xl font-black text-white">Ksh {isLoadingProps ? '-' : totalValue.toLocaleString()}</h3>
                     </div>
                     <div className="bg-[#1E293B] p-6 rounded-2xl border border-slate-800">
                       <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Pending Verifications</p>
                       <h3 className="text-3xl font-black text-white">{isLoadingProps ? '-' : pendingCount}</h3>
                     </div>
                  </div>
               </div>
             )}
             
             {/* ADD VIEW */}
             {activeView === 'add' && (
               <div className="animate-in fade-in duration-300">
                  <div className="mb-8">
                     <h2 className="text-3xl font-bold text-white tracking-tight">Add New Property Listing</h2>
                     <p className="text-slate-400 mt-2 text-sm">Enter the official details as they appear on the government registry. All deed documents are securely encrypted.</p>
                  </div>

                  {statusMessage.text && (
                    <div className={`p-4 mb-6 rounded-xl font-medium flex items-center gap-3 ${statusMessage.type === 'success' ? 'bg-[#00D170]/10 text-[#00D170] border border-[#00D170]/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                      {statusMessage.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />} {statusMessage.text}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                     
                     {/* Left Column (Property Info) */}
                     <div className="lg:col-span-2 space-y-6">
                        <div className="bg-[#1E293B] rounded-2xl p-8 shadow-xl border border-slate-800">
                           <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6 pb-4 border-b border-slate-700/50">
                              <FileText className="text-[#00D170]" size={20} /> Property Information
                           </h3>
                           
                           <div className="space-y-6">
                              <div>
                                 <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Title Number</label>
                                 <div className="relative">
                                    
                                    <input 
                                       className="w-full bg-[#0F172A] border border-slate-700 text-white rounded-xl pl-12 pr-4 py-3.5 focus:border-[#00D170] focus:ring-1 focus:ring-[#00D170] outline-none transition-all placeholder:text-slate-600 font-medium" 
                                       
                                       required
                                       value={titleNumber}
                                       onChange={(e) => setTitleNumber(e.target.value)}
                                    />
                                 </div>
                              </div>
                              
                              <div>
                                 <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Location / Address</label>
                                 <div className="relative">
                                    
                                    <input 
                                       className="w-full bg-[#0F172A] border border-slate-700 text-white rounded-xl pl-12 pr-4 py-3.5 focus:border-[#00D170] focus:ring-1 focus:ring-[#00D170] outline-none transition-all placeholder:text-slate-600 font-medium" 
                                        
                                       required
                                       value={locationWard}
                                       onChange={(e) => setLocationWard(e.target.value)}
                                    />
                                 </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                 <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Size (Acres)</label>
                                    <div className="relative">
                                       
                                       <input 
                                          className="w-full bg-[#0F172A] border border-slate-700 text-white rounded-xl pl-12 pr-4 py-3.5 focus:border-[#00D170] focus:ring-1 focus:ring-[#00D170] outline-none transition-all placeholder:text-slate-600 font-medium" 
                                           
                                          type="number" step="0.01" required
                                          value={sizeAcres}
                                          onChange={(e) => setSizeAcres(e.target.value)}
                                       />
                                    </div>
                                 </div>
                                 <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Asking Price (Ksh)</label>
                                    <div className="relative">
                                       
                                       <input 
                                          className="w-full bg-[#0F172A] border border-slate-700 text-white rounded-xl pl-12 pr-4 py-3.5 focus:border-[#00D170] focus:ring-1 focus:ring-[#00D170] outline-none transition-all placeholder:text-slate-600 font-medium" 
                                           
                                          type="number" required
                                          value={listingPrice}
                                          onChange={(e) => setListingPrice(e.target.value)}
                                       />
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>

                        <div className="bg-[#1E293B] rounded-2xl p-8 shadow-xl border border-slate-800">
                           <div className="flex justify-between items-center mb-4">
                              <label className="text-sm font-bold text-white tracking-wider">Additional Notes</label>
                              <span className="text-xs text-slate-500 font-medium">Optional</span>
                           </div>
                           <textarea 
                              className="w-full bg-[#0F172A] border border-slate-700 text-white rounded-xl p-4 focus:border-[#00D170] focus:ring-1 focus:ring-[#00D170] outline-none transition-all placeholder:text-slate-600 resize-none h-28 font-medium" 
                              
                              value={additionalNotes}
                              onChange={(e) => setAdditionalNotes(e.target.value)}
                           ></textarea>
                        </div>
                     </div>
                     
                     {/* Right Column (Documents & Submit) */}
                     <div className="space-y-6">
                        <div className="bg-[#1E293B] rounded-2xl p-8 shadow-xl border border-slate-800 h-[380px] flex flex-col">
                           <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                              <FileUp className="text-[#00D170]" size={20} /> Deed Documents
                           </h3>
                           <p className="text-slate-400 text-sm mb-6">Please upload a high-resolution scan of the original property deed. This is required for verification.</p>
                           
                           {/* --- UPDATED FILE UPLOAD INPUT --- */}
                           <label className="flex-1 relative cursor-pointer border-2 border-dashed border-slate-600 bg-[#0F172A] rounded-xl hover:bg-slate-800 hover:border-[#00D170] transition-all flex flex-col items-center justify-center text-center p-6 group overflow-hidden">
                              <input 
                                type="file" 
                                accept=".pdf,image/*" 
                                className="hidden" 
                                onChange={handleFileChange} 
                              />
                              <div className="h-14 w-14 rounded-full bg-[#1E293B] flex items-center justify-center mb-4 group-hover:bg-[#00D170] group-hover:text-[#0B1120] transition-colors text-slate-400 shadow-lg">
                                 <UploadCloud size={28} />
                              </div>
                              {fileName ? (
                                <div className="w-full">
                                    <p className="text-sm font-bold text-[#00D170] break-words truncate px-2">{fileName}</p>
                                    <p className="text-xs text-slate-400 mt-1">File ready to submit</p>
                                </div>
                              ) : (
                                <>
                                  <p className="text-sm font-bold text-white mb-1">Click to upload document</p>
                                  <p className="text-xs text-slate-500">PDF, JPG or PNG (max. 10MB)</p>
                                </>
                              )}
                           </label>
                        </div>
                        
                        <button 
                           type="submit" 
                           disabled={isSubmitting}
                           className="w-full flex items-center justify-center gap-2 bg-[#00D170] hover:bg-[#00e67a] text-[#0B1120] font-black py-4 px-6 rounded-xl shadow-[0_4px_20px_rgba(0,209,112,0.3)] transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 text-base"
                        >
                           {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
                           {isSubmitting ? 'Uploading...' : 'Submit for Verification'}
                        </button>
                        
                        <button 
                           type="button" 
                           className="w-full py-4 px-6 rounded-xl font-bold text-slate-300 bg-transparent border-2 border-slate-700 hover:bg-slate-800 hover:text-white transition-all text-base"
                        >
                           Save as Draft
                        </button>
                     </div>
                  </form>
               </div>
             )}

             {/* LIST VIEW */}
             {activeView === 'list' && (
               <div className="animate-in fade-in duration-300">
                  <div className="mb-8"><h2 className="text-3xl font-bold text-white">My Properties</h2></div>
                  <div className="bg-[#1E293B] rounded-2xl border border-slate-800 overflow-hidden">
                      <table className="w-full text-left">
                        <thead className="bg-[#0F172A]"><tr className="text-xs text-slate-400"><th className="px-6 py-4">Title No</th><th className="px-6 py-4">Price</th><th className="px-6 py-4">Status</th></tr></thead>
                        <tbody className="divide-y divide-slate-800">
                          {isLoadingProps ? (<tr><td colSpan="3" className="p-8 text-center"><Loader2 className="animate-spin mx-auto text-[#00D170]" /></td></tr>) : 
                           myProperties.length === 0 ? (<tr><td colSpan="3" className="p-8 text-center text-slate-500">No properties found.</td></tr>) : 
                           myProperties.map(p => (
                            <tr key={p._id} className="hover:bg-[#0F172A]/50">
                              <td className="px-6 py-4 font-bold">{p.titleNumber}</td>
                              <td className="px-6 py-4">Ksh {p.listingPrice?.toLocaleString()}</td>
                              <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded text-xs font-bold ${
                                  p.status === 'Verified' ? 'text-[#00D170] bg-[#00D170]/10' :
                                  p.status === 'Rejected' ? 'text-red-400 bg-red-500/10' :
                                  'text-yellow-400 bg-yellow-500/10'
                                }`}>
                                  {p.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                  </div>
               </div>
             )}
          </div>
       </main>
    </div>
  );
}