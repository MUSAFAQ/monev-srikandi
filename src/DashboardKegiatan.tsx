import { useState, useEffect } from 'react';
import { Activity, PieChart as PieIcon, TrendingUp, ArrowLeft } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';

interface DashboardKegiatanProps {
  namaKegiatan: string;
  onBack: () => void; // <-- Tambahan Prop untuk tombol kembali
}

export default function DashboardKegiatan({ namaKegiatan, onBack }: DashboardKegiatanProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, [namaKegiatan]);

  const dummyDataBar = [{ nama: 'Tahap 1', nilai: 65 }, { nama: 'Tahap 2', nilai: 40 }, { nama: 'Tahap 3', nilai: 85 }, { nama: 'Tahap 4', nilai: 30 }];
  const dummyDataLine = [{ bulan: 'Jan', progres: 10 }, { bulan: 'Feb', progres: 25 }, { bulan: 'Mar', progres: 45 }, { bulan: 'Apr', progres: 75 }];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500">
        <Activity className="w-8 h-8 animate-spin text-blue-500 mb-4" />
        <p className="font-medium animate-pulse">Menyiapkan Dashboard {namaKegiatan}...</p>
      </div>
    );
  }

  return (
    <div className="animasi-naik pb-20">
      {/* HEADER DENGAN TOMBOL KEMBALI */}
      <div className="flex items-center mb-8 border-b border-gray-200 pb-4">
        <button onClick={onBack} className="p-2 mr-4 bg-white border border-gray-300 hover:bg-gray-100 text-gray-600 rounded-lg transition shadow-sm">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Dashboard: {namaKegiatan}
          </h2>
          <p className="text-sm text-gray-500 mt-1">Ringkasan statistik dan grafik (Data Persiapan).</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center"><div className="p-4 bg-blue-50 text-blue-600 rounded-full mr-4"><TrendingUp className="w-6 h-6" /></div><div><p className="text-sm text-gray-500 font-medium">Total Progres</p><h3 className="text-2xl font-bold text-gray-800">75%</h3></div></div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center"><div className="p-4 bg-green-50 text-green-600 rounded-full mr-4"><Activity className="w-6 h-6" /></div><div><p className="text-sm text-gray-500 font-medium">Target Selesai</p><h3 className="text-2xl font-bold text-gray-800">12 Unit</h3></div></div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center"><div className="p-4 bg-purple-50 text-purple-600 rounded-full mr-4"><PieIcon className="w-6 h-6" /></div><div><p className="text-sm text-gray-500 font-medium">Status Anggaran</p><h3 className="text-2xl font-bold text-gray-800">Aman</h3></div></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"><h3 className="text-base font-bold text-gray-800 mb-4 border-b pb-2">Statistik Capaian</h3><div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={dummyDataBar}><XAxis dataKey="nama" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} /><Tooltip cursor={{ fill: '#f1f5f9' }} /><Bar dataKey="nilai" fill="#3b82f6" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div></div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"><h3 className="text-base font-bold text-gray-800 mb-4 border-b pb-2">Tren Progres Bulanan</h3><div className="h-64"><ResponsiveContainer width="100%" height="100%"><LineChart data={dummyDataLine}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" /><XAxis dataKey="bulan" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} /><Tooltip /><Line type="monotone" dataKey="progres" stroke="#10b981" strokeWidth={3} dot={{ r: 5, fill: '#10b981' }} /></LineChart></ResponsiveContainer></div></div>
      </div>
    </div>
  );
}