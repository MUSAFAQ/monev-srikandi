import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, UploadCloud, LogOut, ChevronDown, FileText, 
  Users, Activity, Building2, Calendar, Menu, X 
} from 'lucide-react'; // <-- Menambahkan ikon Menu dan X untuk Mobile

import DashboardGlobal from './DashboardGlobal';
import DetailOPD from './DetailOPD'; 
import ImportData from './ImportData';
import ExportLaporan from './ExportLaporan';
import ManajemenUser from './ManajemenUser';
import LogAktivitas from './LogAktivitas';
import ManajemenOPD from './ManajemenOPD';
import InputKuesioner from './InputKuesioner';

export default function App() {
  const [activeView, setActiveView] = useState('global');
  const [detailId, setDetailId] = useState<any>(null);
  const [globalPeriode, setGlobalPeriode] = useState('2026');
  const [userRole, setUserRole] = useState('admin'); 
  
  // STATE BARU: Untuk mengontrol buka/tutup Sidebar di HP
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const handleNavigate = (view: string, id?: any) => {
    setActiveView(view);
    if (id !== undefined) setDetailId(id);
    // Tutup menu otomatis setelah link diklik di HP
    setIsMobileMenuOpen(false); 
  };

  useEffect(() => {
    if (userRole === 'pimpinan') {
      const restrictedViews = ['import', 'kuesioner', 'users', 'opd', 'log'];
      if (restrictedViews.includes(activeView)) {
        setActiveView('global');
      }
    }
  }, [userRole, activeView]);

  return (
    <div className="flex h-screen bg-slate-50 font-sans print:block print:h-auto print:bg-white overflow-hidden">
      
      {/* 1. KAIN GAIB (OVERLAY) UNTUK MOBILE */}
      {/* Jika menu HP terbuka, tampilkan latar belakang gelap. Jika diklik, menu tertutup. */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* 2. SIDEBAR (MENU KIRI) */}
      {/* Diubah menjadi 'fixed' di HP (bisa melayang masuk/keluar) dan 'relative' di Laptop */}
      <aside className={`
        fixed md:relative top-0 left-0 h-full w-64 bg-[#1e293b] text-white flex flex-col shadow-xl z-50 print:hidden
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-12 bg-blue-500 rounded flex items-center justify-center font-bold text-xs">LOGO</div>
            <div>
              <h1 className="text-sm font-bold tracking-wider">MONEV SRIKANDI</h1>
              <p className="text-xs text-slate-400 mt-0.5">Pemkab Tuban</p>
            </div>
          </div>
          {/* Tombol Silang (X) untuk menutup menu di HP */}
          <button 
            className="md:hidden text-slate-400 hover:text-white bg-slate-800 p-1 rounded-md"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* PENGATURAN HAK AKSES MENU */}
        <nav className="flex-1 p-4 space-y-2 mt-2 overflow-y-auto custom-scrollbar">
          <a href="#" onClick={(e) => { e.preventDefault(); handleNavigate('global'); }} className={`flex items-center px-4 py-3 rounded-lg font-medium text-sm transition ${activeView === 'global' || activeView === 'detail' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <LayoutDashboard className="w-5 h-5 mr-3" /> Dashboard Global
          </a>

          {userRole === 'admin' && (
            <>
              <a href="#" onClick={(e) => { e.preventDefault(); handleNavigate('import'); }} className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition ${activeView === 'import' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <UploadCloud className="w-5 h-5 mr-3" /> Import Data
              </a>
              <a href="#" onClick={(e) => { e.preventDefault(); handleNavigate('kuesioner'); }} className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition ${activeView === 'kuesioner' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <FileText className="w-5 h-5 mr-3" /> Kuesioner Digital
              </a>
            </>
          )}

          <a href="#" onClick={(e) => { e.preventDefault(); handleNavigate('export'); }} className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition ${activeView === 'export' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <FileText className="w-5 h-5 mr-3" /> Laporan & Export
          </a>

          {userRole === 'admin' && (
            <div className="pt-4 mt-4 border-t border-slate-700/50 space-y-2">
              <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Pengaturan Sistem</p>
              <a href="#" onClick={(e) => { e.preventDefault(); handleNavigate('users'); }} className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition ${activeView === 'users' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <Users className="w-5 h-5 mr-3" /> Manajemen User
              </a>
              <a href="#" onClick={(e) => { e.preventDefault(); handleNavigate('opd'); }} className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition ${activeView === 'opd' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <Building2 className="w-5 h-5 mr-3" /> Data Instansi OPD
              </a>
              <a href="#" onClick={(e) => { e.preventDefault(); handleNavigate('log'); }} className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition ${activeView === 'log' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <Activity className="w-5 h-5 mr-3" /> Log Aktivitas
              </a>
            </div>
          )}
        </nav>

        <div className="p-4 border-t border-slate-700/50">
          <button onClick={() => window.location.reload()} className="flex items-center w-full px-4 py-3 text-slate-400 hover:bg-red-500/10 hover:text-red-400 rounded-lg text-sm font-medium transition">
            <LogOut className="w-5 h-5 mr-3" /> Logout
          </button>
        </div>
      </aside>

      {/* 3. MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden print:block print:overflow-visible">
        
        {/* TOPBAR RESPONSIVE */}
        <header className="bg-white h-16 shadow-sm border-b border-gray-200 flex items-center justify-between px-4 md:px-8 z-10 print:hidden shrink-0">
          <div className="flex items-center text-gray-500">
            {/* Tombol Hamburger (Hanya muncul di HP) */}
            <button 
              className="md:hidden mr-3 p-2 rounded-md hover:bg-gray-100 transition active:scale-95 text-blue-600"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <LayoutDashboard className="w-5 h-5 hidden md:block hover:text-gray-700 cursor-pointer" />
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-4">
            
            {/* Filter Periode (Diperkecil di HP) */}
            <div className="flex items-center border border-gray-300 rounded-md px-2 py-1 md:px-3 md:py-1.5 bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
              <Calendar className="w-4 h-4 text-gray-500 mr-1 md:mr-2" />
              <select 
                value={globalPeriode} 
                onChange={(e) => setGlobalPeriode(e.target.value)}
                className="text-xs md:text-sm font-bold text-gray-700 bg-transparent outline-none cursor-pointer appearance-none pr-3 md:pr-4"
              >
                <option value="Semua">Semua</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
              </select>
              <ChevronDown className="w-3 h-3 md:w-4 md:h-4 text-gray-400 -ml-3 md:-ml-4 pointer-events-none" />
            </div>

            {/* Profile & Switcher (Teks "Halo Pengguna" disembunyikan di HP) */}
            <div className="flex items-center space-x-2 md:space-x-3 border-l pl-2 md:pl-4 border-gray-200">
              <img src={`https://ui-avatars.com/api/?name=${userRole === 'admin' ? 'Admin' : 'Pimpinan'}&background=0D8ABC&color=fff`} alt="User" className="w-7 h-7 md:w-8 md:h-8 rounded-full" />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-700 hidden sm:block">Halo, Pengguna</span>
                <select 
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value)}
                  className="text-[10px] md:text-xs font-bold text-blue-600 bg-transparent outline-none cursor-pointer"
                >
                  <option value="admin">👑 Admin</option>
                  <option value="pimpinan">👔 Pimpinan</option>
                </select>
              </div>
            </div>

          </div>
        </header>

        {/* AREA KONTEN (Ditambahkan overflow-y-auto agar bisa di-scroll di HP) */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 print:block print:overflow-visible print:p-0 bg-slate-50 relative">
            {activeView === 'detail' ? <DetailOPD onBack={() => setActiveView('global')} targetId={detailId} />
            : activeView === 'import' && userRole === 'admin' ? <ImportData />  
            : activeView === 'kuesioner' && userRole === 'admin' ? <InputKuesioner />
            : activeView === 'export' ? <ExportLaporan filterPeriode={globalPeriode} />               
            : activeView === 'users' && userRole === 'admin' ? <ManajemenUser />
            : activeView === 'opd' && userRole === 'admin' ? <ManajemenOPD />
            : activeView === 'log' && userRole === 'admin' ? <LogAktivitas />
            : <DashboardGlobal onNavigate={handleNavigate} filterPeriode={globalPeriode} />}
        </div>
      </main>
    </div>
  );
}