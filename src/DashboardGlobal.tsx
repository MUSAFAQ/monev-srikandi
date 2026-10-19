import { useState, useEffect } from 'react';
import { Building2, Star, AlertTriangle, ArrowLeft, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DashboardGlobalProps {
  onNavigate: (view: string, id?: any) => void;
  filterPeriode?: string; // Menangkap filter dari atas
}

export default function DashboardGlobal({ onNavigate, filterPeriode = '2026' }: DashboardGlobalProps) {
  const [opdList, setOpdList] = useState<any[]>([]);
  const [penilaianList, setPenilaianList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
  let isMounted = true;
  const MIN_LOADING_MS = 500;
  const startTime = Date.now();

  Promise.all([
    fetch('http://localhost:3000/instansi-opd').then(res => res.json()),
    fetch('http://localhost:3000/hasil-monev').then(res => res.json())
  ])
    .then(([dataOpd, dataMonev]) => {
      if (!isMounted) return;
      setOpdList(Array.isArray(dataOpd) ? dataOpd : (dataOpd?.data || []));
      setPenilaianList(Array.isArray(dataMonev) ? dataMonev : (dataMonev?.data || []));
    })
    .catch((error) => {
      console.error('Gagal mengambil data Dashboard:', error);
    })
    .finally(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(MIN_LOADING_MS - elapsed, 0);
      setTimeout(() => { if (isMounted) setIsLoading(false); }, remaining);
    });

  return () => { isMounted = false; };
}, []);

  // PROSES PENYARINGAN BERDASARKAN PERIODE
  const filteredPenilaian = filterPeriode === 'Semua' 
    ? penilaianList 
    : penilaianList.filter(item => String(item.periode) === String(filterPeriode));

  const totalOPD = opdList.length;
  const totalPenilaian = filteredPenilaian.length;
  
  const rataRataNilai = totalPenilaian > 0 
    ? filteredPenilaian.reduce((sum, item) => sum + Number(item.total_nilai), 0) / totalPenilaian 
    : 0;

  let rataKategori = 'Kurang'; let rataWarna = 'text-red-700 bg-red-100 border-red-200';
  if (rataRataNilai >= 90) { rataKategori = 'Sangat Baik'; rataWarna = 'text-green-700 bg-green-100 border-green-200'; }
  else if (rataRataNilai >= 80) { rataKategori = 'Baik'; rataWarna = 'text-blue-700 bg-blue-100 border-blue-200'; }
  else if (rataRataNilai >= 70) { rataKategori = 'Cukup'; rataWarna = 'text-amber-700 bg-amber-100 border-amber-200'; }

  const opdKritis = filteredPenilaian.filter(item => item.kategori === 'Kurang').length;

  const dataGabungan = filteredPenilaian.map(nilai => {
    const opd = opdList.find(o => Number(o.id) === Number(nilai.instansi_id));
    return {
      ...nilai,
      opd_id_asli: opd ? opd.id : nilai.instansi_id, 
      nama_instansi: opd ? opd.nama_instansi : 'Instansi Tidak Diketahui',
      nama_lengkap: opd ? opd.nama_instansi : '-'
    };
  });

  const dataPeringkat = [...dataGabungan].sort((a, b) => b.total_nilai - a.total_nilai).slice(0, 5).map(item => ({ nama: item.nama_instansi, nilai: item.total_nilai }));
  const dataKategori = [
    { name: 'Sangat Baik', value: filteredPenilaian.filter(i => i.kategori === 'Sangat Baik').length, color: '#22c55e' }, 
    { name: 'Baik', value: filteredPenilaian.filter(i => i.kategori === 'Baik').length, color: '#3b82f6' },        
    { name: 'Cukup', value: filteredPenilaian.filter(i => i.kategori === 'Cukup').length, color: '#eab308' },      
    { name: 'Kurang', value: filteredPenilaian.filter(i => i.kategori === 'Kurang').length, color: '#ef4444' }, 
  ].filter(item => item.value > 0); 

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500">
        <Activity className="w-8 h-8 animate-spin text-blue-500 mb-4" />
        <p className="font-medium animate-pulse">Menyiapkan Dashboard Global...</p>
      </div>
    );
  }

  return (
    <div className="animasi-naik pb-20">
      <div className="flex items-center mb-8 border-b border-gray-200 pb-4">
        <button onClick={() => onNavigate('portal')} className="p-2 mr-4 bg-white border border-gray-300 hover:bg-gray-100 text-gray-600 rounded-lg transition shadow-sm">
          <ArrowLeft className="w-5 h-5" />
        </button>
      <div>
          <h2 className="text-2xl font-bold text-gray-800">Dashboard Monitoring & Evaluasi SRIKANDI</h2>
          <p className="text-sm text-gray-500 mt-1">
            Ringkasan hasil monitoring dan evaluasi SRIKANDI 
            <span className="font-bold text-blue-600 ml-1">
              ({filterPeriode === 'Semua' ? 'Keseluruhan Periode' : `Tahun ${filterPeriode}`})
            </span>
          </p>
      </div>
    </div>

      {/* 3 SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-start border-l-4 border-l-blue-500"><div className="p-3 bg-blue-50 text-blue-600 rounded-full mr-4"><Building2 className="w-6 h-6" /></div><div><p className="text-sm font-medium text-gray-500">Total Instansi (OPD)</p><h3 className="text-3xl font-bold text-gray-800 mt-1">{totalOPD}</h3><p className="text-xs text-gray-400 mt-1">{totalPenilaian} mengisi evaluasi</p></div></div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-start border-l-4 border-l-green-500"><div className="p-3 bg-green-50 text-green-600 rounded-full mr-4"><Star className="w-6 h-6" /></div><div className="flex-1"><p className="text-sm font-medium text-gray-500">Rata-rata Nilai</p><div className="flex items-center mt-1"><h3 className="text-3xl font-bold text-gray-800 mr-3">{rataRataNilai.toFixed(1)}</h3><span className={`px-2 py-1 text-xs font-semibold rounded-md border ${rataWarna}`}>{rataKategori}</span></div><p className="text-xs text-gray-400 mt-1">Berdasarkan data {filterPeriode === 'Semua' ? 'semua tahun' : filterPeriode}</p></div></div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-start border-l-4 border-l-red-500"><div className="p-3 bg-red-50 text-red-600 rounded-full mr-4"><AlertTriangle className="w-6 h-6" /></div><div className="flex-1"><p className="text-sm font-medium text-gray-500">OPD Kritis</p><div className="flex items-center mt-1"><h3 className="text-3xl font-bold text-gray-800 mr-3">{opdKritis}</h3><span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-md border border-red-200">Kurang</span></div><p className="text-xs text-gray-400 mt-1">Butuh pembinaan</p></div></div>
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"><h3 className="text-base font-bold text-gray-800 mb-6 flex items-center"><span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>Peringkat Terbaik (Top 5)</h3><div className="h-64 w-full">{dataPeringkat.length > 0 ? (<ResponsiveContainer width="100%" height="100%"><BarChart data={dataPeringkat} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}><XAxis dataKey="nama" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} interval={0} /><RechartsTooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} /><Bar dataKey="nilai" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={45} /></BarChart></ResponsiveContainer>) : (<div className="flex h-full items-center justify-center text-gray-400 text-sm">Belum ada data pada periode ini</div>)}</div></div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"><h3 className="text-base font-bold text-gray-800 mb-2 flex items-center"><span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>Kategori Kesiapan</h3><div className="flex items-center h-64"><div className="w-1/2 h-full relative">{dataKategori.length > 0 ? (<><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={dataKategori} innerRadius={65} outerRadius={85} paddingAngle={3} dataKey="value">{dataKategori.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}</Pie><RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} /></PieChart></ResponsiveContainer><div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"><span className="text-3xl font-bold text-gray-800">{totalPenilaian}</span><span className="text-xs text-gray-500 font-medium">OPD Dievaluasi</span></div></>) : (<div className="flex h-full items-center justify-center text-gray-400 text-sm">Kosong</div>)}</div><div className="w-1/2 pl-4 flex flex-col justify-center space-y-4">{dataKategori.map((item, index) => (<div key={index} className="flex items-center justify-between"><div className="flex items-center"><span className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: item.color }}></span><span className="text-sm text-gray-600">{item.name}</span></div><span className="text-sm font-semibold text-gray-800">{item.value}</span></div>))}</div></div></div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center"><Building2 className="w-4 h-4 text-blue-500 mr-2" />Daftar Rekapitulasi OPD</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-50/50 text-slate-500 text-sm border-b border-gray-100">
                <th className="p-4 font-semibold w-16">No</th><th className="p-4 font-semibold">Nama Instansi</th><th className="p-4 font-semibold text-center">Nilai Total</th><th className="p-4 font-semibold text-center">Status</th><th className="p-4 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {dataGabungan.length === 0 && (<tr><td colSpan={5} className="p-8 text-center text-gray-500">Tidak ada data untuk periode {filterPeriode}.</td></tr>)}
              {dataGabungan.map((item, index) => (
                <tr key={item.id} className="border-b border-gray-50 hover:bg-slate-50/50 transition">
                  <td className="p-4 text-gray-500">{index + 1}</td>
                  <td className="p-4 font-medium text-gray-800">{item.nama_lengkap}</td>
                  <td className="p-4 text-gray-600 font-bold text-center">{item.total_nilai}</td>
                  <td className="p-4 text-center"><span className={`px-3 py-1 rounded-md text-xs font-semibold ${item.kategori === 'Sangat Baik' ? 'bg-green-100 text-green-700' : item.kategori === 'Baik' ? 'bg-blue-100 text-blue-700' : item.kategori === 'Cukup' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>{item.kategori}</span></td>
                  <td className="p-4 text-center">
                    <button onClick={() => onNavigate('detail', item.opd_id_asli)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-xs font-medium transition shadow-sm">Lihat Detail</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}