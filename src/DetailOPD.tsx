import { useState, useEffect } from 'react';
import { ArrowLeft, Building2, Award, FileText, Activity } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

interface DetailOPDProps {
  onBack: () => void;
  targetId?: any; 
}

export default function DetailOPD({ onBack, targetId }: DetailOPDProps) {
  const [opdList, setOpdList] = useState<any[]>([]);
  const [penilaianList, setPenilaianList] = useState<any[]>([]);
  const [selectedOpdId, setSelectedOpdId] = useState<number | string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:3000/instansi-opd').then(res => res.json()),
      fetch('http://localhost:3000/hasil-monev').then(res => res.json())
    ])
    .then(([dataOpd, dataMonev]) => {
      const opdValid = Array.isArray(dataOpd) ? dataOpd : [];
      setOpdList(opdValid);
      setPenilaianList(Array.isArray(dataMonev) ? dataMonev : []);
      
      // Jika halaman dibuka via tombol "Lihat Detail" (membawa targetId)
      if (targetId) {
        setSelectedOpdId(targetId);
      } 
      // Jika halaman dibuka manual dan belum ada OPD yang dipilih, set default
      else if (opdValid.length > 0 && selectedOpdId === '') {
        setSelectedOpdId(opdValid[0].id);
      }
      setIsLoading(false);
    })
    .catch(error => {
      console.error(error);
      setIsLoading(false);
    });
  }, [targetId]); // <-- Menambahkan Dependency agar merespons saat ID berubah

  const selectedData = penilaianList.find((item) => String(item.instansi_id) === String(selectedOpdId));
  const selectedOpdInfo = opdList.find((item) => String(item.id) === String(selectedOpdId));

  const radarData = selectedData ? [
    { aspek: 'B1. Penciptaan', nilai: selectedData.b1_penciptaan },
    { aspek: 'B2. Metadata', nilai: selectedData.b2_metadata },
    { aspek: 'B3. Penyimpanan', nilai: selectedData.b3_penyimpanan },
    { aspek: 'B4. Distribusi', nilai: selectedData.b4_distribusi },
    { aspek: 'B5. Pemeliharaan', nilai: selectedData.b5_pemeliharaan },
    { aspek: 'C. Pendukung', nilai: selectedData.c_faktor_pendukung },
    { aspek: 'E. Kualitas App', nilai: selectedData.e_kualitas_aplikasi },
  ] : [];

  if (isLoading) return <div className="p-8 text-center text-gray-500">Memuat detail evaluasi...</div>;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-gray-200 pb-4">
        <div className="flex items-center">
          <button onClick={onBack} className="p-2 mr-4 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition"><ArrowLeft className="w-5 h-5" /></button>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><Activity className="w-7 h-7 text-blue-600" /> Rapor Detail Instansi</h2>
            <p className="text-sm text-gray-500 mt-1">Analisis mendalam hasil evaluasi SRIKANDI per OPD</p>
          </div>
        </div>

        <div className="w-full md:w-auto">
          <select 
            value={selectedOpdId} 
            onChange={(e) => setSelectedOpdId(e.target.value)}
            className="w-full md:w-72 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-blue-600 outline-none bg-white shadow-sm"
          >
            <option value="" disabled>-- Pilih Instansi --</option>
            {opdList.map((opd) => (
              <option key={opd.id} value={opd.id}>{opd.nama_instansi || opd.nama || 'Instansi'}</option>
            ))}
          </select>
        </div>
      </div>

      {!selectedData ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center flex flex-col items-center">
          <FileText className="w-16 h-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-bold text-gray-700">Belum Ada Evaluasi</h3>
          <p className="text-gray-500 mt-2 text-sm">Instansi ini belum mengisi Kuesioner Digital Monev SRIKANDI.</p>
        </div>
      ) : (
        <>
          <div className="bg-gradient-to-br from-blue-900 to-blue-700 rounded-2xl shadow-lg p-8 mb-8 text-white flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-6 md:mb-0 w-full md:w-2/3">
              <div className="p-4 bg-white/20 rounded-2xl mr-6 backdrop-blur-sm"><Building2 className="w-10 h-10 text-white" /></div>
              <div>
                <p className="text-blue-200 font-medium text-sm mb-1">Nama Instansi / OPD</p>
                <h3 className="text-2xl md:text-3xl font-bold">{selectedOpdInfo?.nama_instansi || 'Instansi Terdaftar'}</h3>
                <p className="text-blue-200 text-sm mt-2 flex items-center">Periode Evaluasi: <span className="font-bold text-white ml-1">{selectedData.periode || '2026'}</span></p>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 text-center w-full md:w-1/3 shadow-xl transform hover:scale-105 transition">
              <p className="text-gray-500 text-sm font-bold mb-1">NILAI AKHIR</p>
              <h1 className="text-5xl font-extrabold text-blue-600 mb-2">{selectedData.total_nilai}</h1>
              <span className={`inline-block px-4 py-1.5 rounded-lg text-sm font-bold uppercase tracking-wider ${selectedData.kategori === 'Sangat Baik' ? 'bg-green-100 text-green-700' : selectedData.kategori === 'Baik' ? 'bg-blue-100 text-blue-700' : selectedData.kategori === 'Cukup' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>{selectedData.kategori}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
              <h3 className="text-base font-bold text-gray-800 mb-2 flex items-center"><Award className="w-5 h-5 text-blue-500 mr-2" /> Peta Kekuatan Aspek</h3>
              <p className="text-xs text-gray-500 mb-6">Visualisasi area yang sudah optimal dan yang perlu perbaikan</p>
              
              <div className="flex-1 min-h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="aspek" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <Radar name="Skor Aspek" dataKey="nilai" stroke="#3b82f6" strokeWidth={2} fill="#3b82f6" fillOpacity={0.4} />
                    <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-base font-bold text-gray-800 mb-4 border-b border-gray-100 pb-4">Rincian Skor Indikator (Skala 0-100)</h3>
              <div className="space-y-4">
                {radarData.map((item, idx) => (
                  <div key={idx} className="flex flex-col">
                    <div className="flex justify-between items-center mb-1"><span className="text-sm font-semibold text-gray-700">{item.aspek}</span><span className={`text-sm font-bold ${item.nilai < 60 ? 'text-red-600' : 'text-blue-600'}`}>{item.nilai.toFixed(1)}</span></div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5"><div className={`h-2.5 rounded-full ${item.nilai >= 90 ? 'bg-green-500' : item.nilai >= 70 ? 'bg-blue-500' : item.nilai >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${item.nilai}%` }}></div></div>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100 text-sm text-blue-800"><strong>💡 Analisis Sistem:</strong> Aspek dengan nilai di bawah 60 (berwarna merah) memerlukan intervensi dan Bimbingan Teknis (Bimtek) prioritas.</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}