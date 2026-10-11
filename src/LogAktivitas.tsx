import { useState } from 'react';
import { 
  Activity, 
  Search, 
  Clock, 
  UploadCloud, 
  UserPlus, 
  FileText, 
  Settings,
  Filter
} from 'lucide-react';

export default function LogAktivitas() {
  const [search, setSearch] = useState('');

  // Data Dummy Riwayat Aktivitas
  const aktivitasData = [
    { 
      id: 1, 
      user: 'Budi Santoso (Admin)', 
      aksi: 'Mengunggah file rekapitulasi', 
      detail: 'monev_april_2025.xlsx (Berhasil)', 
      waktu: 'Hari ini, 10:32 WIB', 
      ikon: <UploadCloud className="w-4 h-4" />,
      warnaBg: 'bg-blue-100',
      warnaIkon: 'text-blue-600'
    },
    { 
      id: 2, 
      user: 'Drs. H. Pimpinan, M.Si', 
      aksi: 'Mengunduh Laporan Global', 
      detail: 'Format PDF (Periode April 2025)', 
      waktu: 'Hari ini, 09:15 WIB', 
      ikon: <FileText className="w-4 h-4" />,
      warnaBg: 'bg-green-100',
      warnaIkon: 'text-green-600'
    },
    { 
      id: 3, 
      user: 'Budi Santoso (Admin)', 
      aksi: 'Menambahkan pengguna baru', 
      detail: 'Akun: opd_dinkes (Dinas Kesehatan)', 
      waktu: 'Kemarin, 15:45 WIB', 
      ikon: <UserPlus className="w-4 h-4" />,
      warnaBg: 'bg-purple-100',
      warnaIkon: 'text-purple-600'
    },
    { 
      id: 4, 
      user: 'Siti Rahmawati (Dinkes)', 
      aksi: 'Memperbarui profil instansi', 
      detail: 'Mengubah kontak penanggung jawab', 
      waktu: 'Kemarin, 14:20 WIB', 
      ikon: <Settings className="w-4 h-4" />,
      warnaBg: 'bg-amber-100',
      warnaIkon: 'text-amber-600'
    },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Activity className="w-7 h-7 text-blue-600" />
            Log Aktivitas
          </h2>
          <p className="text-sm text-gray-500 mt-1">Pantau seluruh riwayat tindakan pengguna di dalam sistem</p>
        </div>
        <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold flex items-center transition shadow-sm active:scale-95">
          <Filter className="w-4 h-4 mr-2" />
          Filter Log
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        
        {/* PENCARIAN */}
        <div className="mb-8">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-gray-50 focus:bg-white transition"
              placeholder="Cari aktivitas atau nama pengguna..."
            />
          </div>
        </div>

        {/* TIMELINE AKTIVITAS */}
        <div className="pl-4">
          <div className="relative border-l-2 border-gray-100 space-y-8 pb-4">
            
            {aktivitasData.map((item) => (
              <div key={item.id} className="relative pl-8 md:pl-10">
                {/* Ikon Lingkaran di Garis Waktu */}
                <div className={`absolute -left-[17px] top-1 ${item.warnaBg} ${item.warnaIkon} w-8 h-8 rounded-full flex items-center justify-center ring-4 ring-white shadow-sm`}>
                  {item.ikon}
                </div>
                
                {/* Konten Log */}
                <div className="bg-slate-50 border border-gray-100 rounded-xl p-4 hover:shadow-md transition duration-200">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-2">
                    <h4 className="font-bold text-gray-800 text-sm">{item.user}</h4>
                    <span className="flex items-center text-xs font-medium text-gray-500 bg-white px-2.5 py-1 rounded-md border border-gray-200 w-fit">
                      <Clock className="w-3 h-3 mr-1.5" />
                      {item.waktu}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm font-medium">{item.aksi}</p>
                  <p className="text-gray-500 text-sm mt-1">{item.detail}</p>
                </div>
              </div>
            ))}

            {/* Titik Akhir Timeline */}
            <div className="absolute -left-1.5 bottom-0 w-3 h-3 bg-gray-200 rounded-full ring-4 ring-white"></div>
          </div>
        </div>

      </div>
    </div>
  );
}