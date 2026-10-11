import { useState } from 'react';
import { LayoutDashboard, UploadCloud, LogOut, ChevronDown, FileText, Users, Activity, Building2, Calendar } from 'lucide-react';

// Mengimpor semua halaman konten
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
  
  // STATE BARU: Menyimpan filter tahun periode (Default: 2026)
  const [globalPeriode, setGlobalPeriode] = useState('2026');
  
  const handleNavigate = (view: string, id?: any) => {
    setActiveView(view);
    if (id !== undefined) setDetailId(id);
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans print:block print:h-auto print:bg-white">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#1e293b] text-white flex flex-col shadow-xl z-10 print:hidden">
        <div className="p-6 border-b border-slate-700/50 flex items-center space-x-3">
          <div className="w-10 h-12 bg-blue-500 rounded flex items-center justify-center font-bold text-xs">
            LOGO
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-wider">MONEV SRIKANDI</h1>
            <p className="text-xs text-slate-400 mt-0.5">Pemkab Tuban</p>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 mt-2">
          <a href="#" onClick={(e) => { e.preventDefault(); handleNavigate('global'); }} className={`flex items-center px-4 py-3 rounded-lg font-medium text-sm transition ${activeView === 'global' || activeView === 'detail' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}><LayoutDashboard className="w-5 h-5 mr-3" /> Dashboard Global</a>
          <a href="#" onClick={(e) => { e.preventDefault(); handleNavigate('import'); }} className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition ${activeView === 'import' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}><UploadCloud className="w-5 h-5 mr-3" /> Import Data</a>
          <a href="#" onClick={(e) => { e.preventDefault(); handleNavigate('kuesioner'); }} className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition ${activeView === 'kuesioner' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}><FileText className="w-5 h-5 mr-3" /> Kuesioner Digital</a>
          <a href="#" onClick={(e) => { e.preventDefault(); handleNavigate('export'); }} className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition ${activeView === 'export' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}><FileText className="w-5 h-5 mr-3" /> Laporan & Export</a>
          <a href="#" onClick={(e) => { e.preventDefault(); handleNavigate('users'); }} className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition ${activeView === 'users' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}><Users className="w-5 h-5 mr-3" /> Manajemen User</a>
          <a href="#" onClick={(e) => { e.preventDefault(); handleNavigate('opd'); }} className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition ${activeView === 'opd' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}><Building2 className="w-5 h-5 mr-3" /> Data Instansi OPD</a>
          <a href="#" onClick={(e) => { e.preventDefault(); handleNavigate('log'); }} className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition ${activeView === 'log' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}><Activity className="w-5 h-5 mr-3" /> Log Aktivitas</a>
        </nav>

        <div className="p-4 border-t border-slate-700/50">
          <button onClick={() => window.location.reload()} className="flex items-center w-full px-4 py-3 text-slate-400 hover:bg-red-500/10 hover:text-red-400 rounded-lg text-sm font-medium transition">
            <LogOut className="w-5 h-5 mr-3" /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-hidden print:block print:overflow-visible">
        
        {/* TOPBAR */}
        <header className="bg-white h-16 shadow-sm border-b border-gray-200 flex items-center justify-between px-8 z-0 print:hidden">
          <div className="flex items-center text-gray-500 hover:text-gray-700 cursor-pointer">
             <LayoutDashboard className="w-5 h-5" />
          </div>
          <div className="flex items-center space-x-4">
            
            {/* INI DIA DROPDOWN FILTER PERIODE NYA */}
            <div className="flex items-center border border-gray-300 rounded-md px-3 py-1.5 bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
              <Calendar className="w-4 h-4 text-gray-500 mr-2" />
              <select 
                value={globalPeriode} 
                onChange={(e) => setGlobalPeriode(e.target.value)}
                className="text-sm font-bold text-gray-700 bg-transparent outline-none cursor-pointer appearance-none pr-4"
              >
                <option value="Semua">Semua Periode</option>
                <option value="2025">Tahun 2025</option>
                <option value="2026">Tahun 2026</option>
                <option value="2027">Tahun 2027</option>
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 -ml-4 pointer-events-none" />
            </div>

            <div className="flex items-center space-x-3 border-l pl-4 border-gray-200">
              <img src="https://ui-avatars.com/api/?name=Pimpinan&background=0D8ABC&color=fff" alt="User" className="w-8 h-8 rounded-full" />
              <span className="text-sm font-semibold text-gray-700">Halo, Pimpinan</span>
            </div>
          </div>
        </header>

        {/* KONTEN DINAMIS DENGAN PROP FILTER PERIODE */}
        <div className="flex-1 overflow-auto p-8 print:block print:overflow-visible print:p-0">
            {activeView === 'detail' ? <DetailOPD onBack={() => setActiveView('global')} targetId={detailId} />
            : activeView === 'import' ? <ImportData />  
            : activeView === 'kuesioner' ? <InputKuesioner />
            : activeView === 'export' ? <ExportLaporan filterPeriode={globalPeriode} />               
            : activeView === 'users' ? <ManajemenUser />
            : activeView === 'opd' ? <ManajemenOPD />
            : activeView === 'log' ? <LogAktivitas />
            : <DashboardGlobal onNavigate={handleNavigate} filterPeriode={globalPeriode} />}
        </div>
      </main>
    </div>
  );
}