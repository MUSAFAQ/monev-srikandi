import { useState, useEffect } from 'react';
import { FileText, Printer, FileSpreadsheet, Building2, CheckCircle, AlertTriangle } from 'lucide-react';

interface ExportProps {
  filterPeriode?: string;
}

export default function ExportLaporan({ filterPeriode = '2026' }: ExportProps) {
  const [dataGabungan, setDataGabungan] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:3000/instansi-opd').then(res => res.json()),
      fetch('http://localhost:3000/hasil-monev').then(res => res.json())
    ])
    .then(([dataOpd, dataMonev]) => {
      const listOpd = Array.isArray(dataOpd) ? dataOpd : (dataOpd?.data || []);
      const listMonev = Array.isArray(dataMonev) ? dataMonev : (dataMonev?.data || []);
      
      // FILTER SESUAI PERIODE
      const filteredMonev = filterPeriode === 'Semua' 
        ? listMonev 
        : listMonev.filter(item => String(item.periode) === String(filterPeriode));

      const gabungan = filteredMonev.map(nilai => {
        const idDariNilai = nilai.instansi_id || nilai.instansiId || nilai.opd_id || nilai.id_opd;
        const opd = listOpd.find(o => String(o.id || o.id_opd || o.opd_id) === String(idDariNilai));
        const namaDinas = opd ? (opd.nama_instansi || opd.nama_opd || opd.nama || 'Instansi Terdaftar') : 'Instansi Tidak Diketahui';
        return { ...nilai, nama_instansi: namaDinas };
      });

      const dataTerurut = gabungan.sort((a, b) => b.total_nilai - a.total_nilai);
      setDataGabungan(dataTerurut);
      setIsLoading(false);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    });
  }, [filterPeriode]); // Menambah filterPeriode agar otomatis render ulang jika tahun diganti

  const handleExportExcel = () => {
    if (dataGabungan.length === 0) return alert('Tidak ada data untuk diexport pada periode ini!');
    const headers = ['Peringkat', 'Nama Instansi/OPD', 'Periode', 'Nilai Akhir', 'Kategori Kesiapan'];
    const rows = dataGabungan.map((item, index) => [
      index + 1, `"${item.nama_instansi}"`, item.periode || '2026', item.total_nilai, item.kategori
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    
    // Nama file dinamis sesuai periode
    const namaFile = filterPeriode === 'Semua' ? 'Keseluruhan' : filterPeriode;
    link.setAttribute("download", `Laporan_Monev_SRIKANDI_${namaFile}.csv`);
    
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  const handlePrintPDF = () => {
    const namaFile = filterPeriode === 'Semua' ? 'Semua_Periode' : filterPeriode;
    const originalTitle = document.title;
    document.title = `Laporan_Monev_SRIKANDI_${namaFile}`;
    
    window.print();
    document.title = originalTitle;
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500">Menyiapkan dokumen laporan...</div>;

  return (
    <div className="animate-in fade-in duration-500 pb-20 bg-slate-50 min-h-screen">
      <style>
        {`
          @media print {
            body * { visibility: hidden; }
            #area-laporan, #area-laporan * { visibility: visible; }
            #area-laporan { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 0; }
            @page { size: A4 portrait; margin: 1.5cm; }
          }
        `}
      </style>

      <div className="mb-8 print:hidden">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><FileText className="w-7 h-7 text-blue-600" /> Cetak & Export Laporan</h2>
        <p className="text-sm text-gray-500 mt-1">Unduh rekapitulasi nilai akhir OPD untuk periode terpilih.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 print:hidden">
        <div onClick={handleExportExcel} className="bg-white rounded-xl shadow-sm border border-emerald-100 p-6 flex items-center cursor-pointer hover:shadow-md hover:border-emerald-300 transition-all group">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-full mr-5 group-hover:scale-110 transition-transform"><FileSpreadsheet className="w-8 h-8" /></div>
          <div><h3 className="text-lg font-bold text-gray-800 group-hover:text-emerald-700">Export ke Excel (.csv)</h3><p className="text-sm text-gray-500 mt-1">Unduh data periode {filterPeriode} untuk diolah di Microsoft Excel.</p></div>
        </div>
        <div onClick={handlePrintPDF} className="bg-white rounded-xl shadow-sm border border-red-100 p-6 flex items-center cursor-pointer hover:shadow-md hover:border-red-300 transition-all group">
          <div className="p-4 bg-red-50 text-red-600 rounded-full mr-5 group-hover:scale-110 transition-transform"><Printer className="w-8 h-8" /></div>
          <div><h3 className="text-lg font-bold text-gray-800 group-hover:text-red-700">Cetak sebagai PDF</h3><p className="text-sm text-gray-500 mt-1">Gunakan fitur cetak browser untuk menyimpan laporan fisik yang rapi.</p></div>
        </div>
      </div>
      
      <div id="area-laporan" className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 print:border-none print:shadow-none print:p-0">
        
        <div className="text-center mb-8 border-b-2 border-gray-800 pb-6">
          <h1 className="text-2xl font-extrabold text-gray-900 uppercase tracking-wider">Laporan Hasil Monitoring & Evaluasi</h1>
          <h2 className="text-xl font-bold text-gray-700 mt-1">Penerapan Aplikasi SRIKANDI</h2>
          <p className="text-gray-500 mt-2 font-medium">
            Pemerintah Kabupaten Tuban - {filterPeriode === 'Semua' ? 'Keseluruhan Periode' : `Tahun Periode ${filterPeriode}`}
          </p>
        </div>

        <div className="flex justify-between items-center mb-6 bg-slate-50 p-4 rounded-lg print:bg-transparent print:p-0">
          <div className="flex items-center"><Building2 className="w-5 h-5 text-gray-400 mr-2" /><span className="font-semibold text-gray-700">Total Instansi Dievaluasi: {dataGabungan.length} OPD</span></div>
          <div className="text-sm text-gray-500">Dicetak pada: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
        </div>

        <div className="w-full">
          <table className="w-full text-left border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-gray-800 text-sm">
                <th className="p-3 border border-gray-300 font-bold w-16 text-center">Peringkat</th>
                <th className="p-3 border border-gray-300 font-bold">Nama Instansi / OPD</th>
                <th className="p-3 border border-gray-300 font-bold text-center w-24">Periode</th>
                <th className="p-3 border border-gray-300 font-bold text-center w-24">Nilai Akhir</th>
                <th className="p-3 border border-gray-300 font-bold text-center w-32">Kategori</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {dataGabungan.length === 0 ? (
                <tr><td colSpan={5} className="p-6 text-center italic text-gray-500">Belum ada data evaluasi pada periode ini.</td></tr>
              ) : (
                dataGabungan.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 border border-gray-300 text-center font-bold text-gray-500">{index + 1}</td>
                    <td className="p-3 border border-gray-300 font-semibold">{item.nama_instansi}</td>
                    <td className="p-3 border border-gray-300 text-center">{item.periode || '2026'}</td>
                    <td className="p-3 border border-gray-300 text-center font-extrabold text-blue-600">{item.total_nilai}</td>
                    <td className="p-3 border border-gray-300 text-center">
                      <div className="flex items-center justify-center">
                        {item.kategori === 'Kurang' ? <AlertTriangle className="w-4 h-4 text-red-500 mr-1.5 print:hidden" /> : <CheckCircle className="w-4 h-4 text-green-500 mr-1.5 print:hidden" />}
                        <span className={`font-bold ${
                          item.kategori === 'Sangat Baik' ? 'text-green-700' :
                          item.kategori === 'Baik' ? 'text-blue-700' :
                          item.kategori === 'Cukup' ? 'text-amber-600' : 'text-red-600'
                        }`}>
                          {item.kategori}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-16 flex justify-end">
          <div className="text-center w-64">
            <p className="text-sm text-gray-600 mb-16">Tuban, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}<br/>Mengetahui,</p>
            <div className="border-b border-gray-800 mb-1 font-bold text-gray-800">Pimpinan / Kepala Dinas</div>
            <p className="text-xs text-gray-500">NIP. ........................................</p>
          </div>
        </div>

      </div>
    </div>
  );
}