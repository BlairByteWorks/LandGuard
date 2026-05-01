import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Landmark, LayoutDashboard, ClipboardList, Settings, 
  Hourglass, ClipboardCheck, Clock, FileText, Eye, CheckCircle, Loader2, LogOut, X, AlertTriangle, XCircle 
} from 'lucide-react';

export default function RegistrarVerificationPage() {
  const navigate = useNavigate();

  const storedName = localStorage.getItem('userName');
  const userName = (storedName && storedName !== 'undefined' && storedName !== 'null' && storedName.trim() !== '') ? storedName : 'Registrar Admin';
  
  const [activeTab, setActiveTab] = useState('pending');
  const [pendingProperties, setPendingProperties] = useState([]);
  const [verifiedProperties, setVerifiedProperties] = useState([]);
  const [rejectedProperties, setRejectedProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [rejectLoadingId, setRejectLoadingId] = useState(null);
  
  const [selectedDeed, setSelectedDeed] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch all data once on initial load
  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        const [pendingRes, verifiedRes, rejectedRes] = await Promise.all([
          axios.get('https://landguard-backend-ar7b.onrender.com/api/properties/pending'),
          axios.get('https://landguard-backend-ar7b.onrender.com/api/properties/verified'),
          axios.get('https://landguard-backend-ar7b.onrender.com/api/properties/rejected')
        ]);

        setPendingProperties(pendingRes.data);
        setVerifiedProperties(verifiedRes.data);
        setRejectedProperties(rejectedRes.data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAllData();
  }, []); 

  const handleVerify = async (propertyId) => {
    setActionLoadingId(propertyId);
    try {
      const response = await axios.put(`https://landguard-backend-ar7b.onrender.com/api/properties/verify/${propertyId}`);
      
      const verifiedProp = pendingProperties.find(p => p._id === propertyId);
      if (verifiedProp) {
        setPendingProperties(prevProps => prevProps.filter(p => p._id !== propertyId));
        setVerifiedProperties(prevProps => [{...verifiedProp, status: 'Verified'}, ...prevProps]);
      }
      
      alert("Property Successfully Verified!");
    } catch (error) {
      console.error("Error verifying property:", error);
      alert("Failed to verify property.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (propertyId) => {
    const confirmReject = window.confirm("Are you sure you want to reject this property? This action will decline the listing.");
    if (!confirmReject) return;

    setRejectLoadingId(propertyId);
    try {
      const response = await axios.put(`https://landguard-backend-ar7b.onrender.com/api/properties/reject/${propertyId}`);
      
      const rejectedProp = pendingProperties.find(p => p._id === propertyId);
      if (rejectedProp) {
        setPendingProperties(prevProps => prevProps.filter(p => p._id !== propertyId));
        setRejectedProperties(prevProps => [{...rejectedProp, status: 'Rejected'}, ...prevProps]);
      }

      alert("Property Successfully Rejected.");
    } catch (error) {
      console.error("Error rejecting property:", error);
      alert("Failed to reject property.");
    } finally {
      setRejectLoadingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.clear(); 
    navigate('/login');
  };

  const viewDeed = (documentData) => {
    if (!documentData) {
      alert("No document was uploaded for this property.");
      return;
    }
    setSelectedDeed(documentData);
    setIsModalOpen(true);
  };

  const currentProperties = activeTab === 'pending' ? pendingProperties : 
                            activeTab === 'verified' ? verifiedProperties : 
                            rejectedProperties;

  return (
    <div className="bg-[#f8f7f5] text-slate-900 flex min-h-screen overflow-hidden font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-[#002147] flex flex-col justify-between shrink-0 h-screen fixed left-0 top-0 z-50 shadow-xl">
        <div>
          <div className="p-6 flex items-center gap-3">
            <div className="h-10 w-10 rounded bg-[#f0a800] flex items-center justify-center shrink-0">
              <Landmark className="text-[#002147]" size={24} />
            </div>
            <div>
              <h1 className="text-white text-lg font-bold leading-tight">Registrar</h1>
              <p className="text-slate-400 text-xs">Admin Console</p>
            </div>
          </div>
          
          <nav className="flex flex-col gap-2 px-3 mt-4">
            <Link to="/" className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-300 hover:bg-white/5 hover:text-white transition-colors group">
              <LayoutDashboard className="text-slate-400 group-hover:text-white" size={20} />
              <span className="text-sm font-medium">Main Site</span>
            </Link>
            
            <div 
              onClick={() => setActiveTab('pending')}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg relative group cursor-pointer transition-colors ${activeTab === 'pending' ? 'bg-[#f0a800]/20 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
            >
              {activeTab === 'pending' && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#f0a800] rounded-r"></div>}
              <ClipboardList className={activeTab === 'pending' ? 'text-[#f0a800]' : 'text-slate-400 group-hover:text-white'} size={20} />
              <span className={`text-sm ${activeTab === 'pending' ? 'font-bold' : 'font-medium'}`}>Pending Verifications</span>
            </div>

            <div 
              onClick={() => setActiveTab('verified')}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg relative group cursor-pointer transition-colors ${activeTab === 'verified' ? 'bg-[#f0a800]/20 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
            >
              {activeTab === 'verified' && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#f0a800] rounded-r"></div>}
              <CheckCircle className={activeTab === 'verified' ? 'text-[#f0a800]' : 'text-slate-400 group-hover:text-white'} size={20} />
              <span className={`text-sm ${activeTab === 'verified' ? 'font-bold' : 'font-medium'}`}>Verified Properties</span>
            </div>

            <div 
              onClick={() => setActiveTab('rejected')}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg relative group cursor-pointer transition-colors ${activeTab === 'rejected' ? 'bg-[#f0a800]/20 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
            >
              {activeTab === 'rejected' && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#f0a800] rounded-r"></div>}
              <XCircle className={activeTab === 'rejected' ? 'text-red-500' : 'text-slate-400 group-hover:text-white'} size={20} />
              <span className={`text-sm ${activeTab === 'rejected' ? 'font-bold' : 'font-medium'}`}>Rejected Properties</span>
            </div>

          </nav>
        </div>

        <div className="p-4 border-t border-white/10">
            <button onClick={handleLogout} className="flex w-full items-center gap-3 text-slate-400 hover:text-white transition-colors py-3 px-4 rounded-lg hover:bg-white/10">
                <LogOut size={20} />
                <span className="font-medium">Log Out</span>
            </button>
        </div>
      </aside>

      <main className="flex-1 ml-64 min-h-screen bg-[#f8f7f5] p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                {activeTab === 'pending' ? 'Pending Title Verifications' : 
                 activeTab === 'verified' ? 'Verified Properties' : 'Rejected Properties'}
              </h2>
              <p className="text-slate-500 mt-1">
                {activeTab === 'pending' ? 'Review and approve incoming land title submissions.' : 
                 activeTab === 'verified' ? 'A complete log of all approved and verified land titles.' : 
                 'A log of property submissions that were declined.'}
              </p>
            </div>
            
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200">
              <span className="font-bold text-[#002147]">{userName}</span>
              <div className="h-10 w-10 rounded-full bg-[#f0a800] flex items-center justify-center text-[#002147] font-black text-lg">
                 {userName.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-1">
              <div className="flex justify-between items-start">
                <p className="text-slate-500 text-sm font-medium">
                  {activeTab === 'pending' ? 'Total Pending in Queue' : 
                   activeTab === 'verified' ? 'Total Verified Titles' : 'Total Rejected Titles'}
                </p>
                {activeTab === 'pending' ? (
                  <Hourglass className="text-[#f0a800] bg-[#f0a800]/10 p-1 rounded" size={24} />
                ) : activeTab === 'verified' ? (
                  <CheckCircle className="text-green-500 bg-green-500/10 p-1 rounded" size={24} />
                ) : (
                  <XCircle className="text-red-500 bg-red-500/10 p-1 rounded" size={24} />
                )}
              </div>
              <p className="text-3xl font-black text-slate-900">{currentProperties.length}</p>
            </div>
            
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-1">
              <div className="flex justify-between items-start">
                <p className="text-slate-500 text-sm font-medium">Reviewed Today</p>
                <ClipboardCheck className="text-blue-500 bg-blue-500/10 p-1 rounded" size={24} />
              </div>
              <p className="text-3xl font-black text-slate-900">0</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-1">
              <div className="flex justify-between items-start">
                <p className="text-slate-500 text-sm font-medium">Avg Processing Time</p>
                <Clock className="text-purple-500 bg-purple-500/10 p-1 rounded" size={24} />
              </div>
              <p className="text-3xl font-black text-slate-900">2.5 hrs</p>
            </div>
          </div>

          {/* Property Data Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Property Details</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Size & Price</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Listed By (Seller)</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date Submitted</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {isLoading ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                        <Loader2 className="animate-spin mx-auto mb-2 text-[#002147]" size={32} />
                        Loading properties...
                      </td>
                    </tr>
                  ) : currentProperties.length === 0 ? (
                    <tr>
                      {activeTab === 'pending' ? (
                        <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                          <CheckCircle className="mx-auto mb-3 text-green-500" size={40} />
                          <p className="font-bold text-lg text-slate-800">All Caught Up!</p>
                          <p className="text-sm">There are no pending properties to verify.</p>
                        </td>
                      ) : activeTab === 'verified' ? (
                        <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                          <FileText className="mx-auto mb-3 text-slate-400" size={40} />
                          <p className="font-bold text-lg text-slate-800">No Verified Properties</p>
                          <p className="text-sm">Properties will appear here once they are approved.</p>
                        </td>
                      ) : (
                        <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                          <FileText className="mx-auto mb-3 text-slate-400" size={40} />
                          <p className="font-bold text-lg text-slate-800">No Rejected Properties</p>
                          <p className="text-sm">Properties will appear here if they are declined.</p>
                        </td>
                      )}
                    </tr>
                  ) : (
                    currentProperties.map((property) => (
                      <tr key={property._id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className={`h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-lg ${
                              activeTab === 'verified' ? 'bg-green-50 text-green-600 border border-green-100' : 
                              activeTab === 'rejected' ? 'bg-red-50 text-red-600 border border-red-100' :
                              'bg-[#002147]/5 text-[#002147] border border-[#002147]/10'
                            }`}>
                              {activeTab === 'verified' ? <CheckCircle size={20} /> : 
                               activeTab === 'rejected' ? <XCircle size={20} /> : <FileText size={20} />}
                            </div>
                            <div>
                              <div className="text-sm font-bold text-slate-900">{property.titleNumber}</div>
                              <div className="text-xs text-slate-500">{property.locationWard || property.location}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-slate-700">{property.sizeAcres} Acres</div>
                          <div className="text-xs text-slate-500">Ksh {property.listingPrice?.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-[#002147]">
                            {property.currentOwnerID?.name || 'Unknown Seller'}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            {property.currentOwnerID?.email || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-slate-700">
                            {new Date(property.createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-slate-500">
                            {new Date(property.createdAt).toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs font-bold rounded-full ${
                            property.status === 'Verified' 
                              ? 'bg-green-100 text-green-800 border border-green-200' 
                              : property.status === 'Rejected'
                              ? 'bg-red-100 text-red-800 border border-red-200'
                              : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                          }`}>
                            {property.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            
                            <button 
                              onClick={() => viewDeed(property.deedDocument)}
                              className="group flex items-center gap-1.5 px-3 py-2 rounded border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:border-blue-300 transition-colors shadow-sm"
                            >
                              <Eye size={16} />
                              <span className="font-bold">View Deed</span>
                            </button>
                            
                            {activeTab === 'pending' && (
                              <>
                                
                                <button 
                                  onClick={() => handleReject(property._id)}
                                  disabled={rejectLoadingId === property._id || actionLoadingId === property._id}
                                  className="group flex items-center gap-1.5 px-3 py-2 rounded bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 shadow-sm transition-colors disabled:opacity-50 font-bold"
                                >
                                  {rejectLoadingId === property._id ? <Loader2 size={16} className="animate-spin" /> : <XCircle size={16} />}
                                  Reject
                                </button>

                                {/* Verify Button */}
                                <button 
                                  onClick={() => handleVerify(property._id)}
                                  disabled={actionLoadingId === property._id || rejectLoadingId === property._id}
                                  className="group flex items-center gap-1.5 px-3 py-2 rounded bg-green-600 text-white hover:bg-green-700 shadow-sm transition-colors disabled:opacity-50 font-bold"
                                >
                                  {actionLoadingId === property._id ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                                  Verify
                                </button>
                              </>
                            )}

                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

     
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 text-blue-700 p-2 rounded-lg">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#002147] leading-none">Document Viewer</h3>
                  <p className="text-xs text-slate-500 mt-1">Official Title Deed Record</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 bg-slate-100 p-6 overflow-hidden flex items-center justify-center">
               {selectedDeed ? (
                 <iframe 
                    src={selectedDeed} 
                    className="w-full h-full rounded border border-slate-300 shadow-inner bg-white"
                    title="Title Deed Document"
                 ></iframe>
               ) : (
                 <div className="text-center text-slate-400 flex flex-col items-center">
                    <AlertTriangle size={48} className="mb-4 opacity-50" />
                    <p className="font-bold text-lg text-slate-600">No Document Found</p>
                    <p className="text-sm">The seller did not attach a document to this listing.</p>
                 </div>
               )}
            </div>

            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end">
               <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg transition-colors"
               >
                 Close Viewer
               </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}