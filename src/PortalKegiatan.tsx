import { LayoutDashboard, ShieldCheck, Network, FolderKanban, ChevronRight } from 'lucide-react';

interface PortalProps {
  onNavigate: (view: string) => void;
}

export default function PortalKegiatan({ onNavigate }: PortalProps) {
  // Data Persiapan Macam-macam Kegiatan
  const daftarKegiatan = [
    {
      id: 'kegiatan-srikandi',
      nama: 'Monitoring & Evaluasi SRIKANDI',
      deskripsi: 'Evaluasi penerapan aplikasi kearsipan dinamis di seluruh OPD Tuban.',
      progres: 100, // Anggap sudah 100% karena datanya sudah ada
      warna: 'blue',
      ikon: <LayoutDashboard className="w-8 h-8 text-blue-500" />
    },
    {
      id: 'kegiatan-spbe',
      nama: 'Evaluasi SPBE Daerah',
      deskripsi: 'Penilaian Sistem Pemerintahan Berbasis Elektronik (SPBE) antar dinas.',
      progres: 75,
      warna: 'green',
      ikon: <ShieldCheck className="w-8 h-8 text-green-500" />
    },
    {
      id: 'kegiatan-jaringan',
      nama: 'Audit Infrastruktur Jaringan',
      deskripsi: 'Pengecekan kelayakan server dan jaringan intranet pemerintah.',
      progres: 40,
      warna: 'amber',
      ikon: <Network className="w-8 h-8 text-amber-500" />
    },
    {
      id: 'kegiatan-aplikasi',
      nama: 'Integrasi Aplikasi Daerah',
      deskripsi: 'Penggabungan layanan publik ke dalam satu portal kabupaten terpadu.',
      progres: 15,
      warna: 'purple',
      ikon: <FolderKanban className="w-8 h-8 text-purple-500" />
    }
  ];

  // Fungsi untuk mendapatkan class warna secara dinamis
  const getColorClasses = (warna: string, progres: number) => {
    if (warna === 'blue') return { bg: 'bg-blue-50', border: 'border-blue-100', bar: 'bg-blue-500', text: 'text-blue-700' };
    if (warna === 'green') return { bg: 'bg-green-50', border: 'border-green-100', bar: 'bg-green-500', text: 'text-green-700' };
    if (warna === 'amber') return { bg: 'bg-amber-50', border: 'border-amber-100', bar: 'bg-amber-500', text: 'text-amber-700' };
    return { bg: 'bg-purple-50', border: 'border-purple-100', bar: 'bg-purple-500', text: 'text-purple-700' };
  };

  return (
    <div className="animasi-naik pb-20">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Portal Divisi Pengembangan</h2>
        <p className="text-sm text-gray-500 mt-1">Pilih kegiatan di bawah ini untuk melihat detail grafik dan statistik.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
        {daftarKegiatan.map((kegiatan) => {
          const colors = getColorClasses(kegiatan.warna, kegiatan.progres);
          
          return (
            <div 
              key={kegiatan.id}
              onClick={() => onNavigate(kegiatan.id)}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-4 rounded-xl ${colors.bg} ${colors.border} border`}>
                  {kegiatan.ikon}
                </div>
                <div className="bg-gray-50 p-2 rounded-full group-hover:bg-blue-600 group-hover:text-white text-gray-400 transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-700 transition-colors">{kegiatan.nama}</h3>
                <p className="text-sm text-gray-500 mt-1 h-10">{kegiatan.deskripsi}</p>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-gray-600">Progres Kegiatan</span>
                  <span className={`text-sm font-bold ${colors.text}`}>{kegiatan.progres}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div className={`h-2.5 rounded-full ${colors.bar}`} style={{ width: `${kegiatan.progres}%` }}></div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}