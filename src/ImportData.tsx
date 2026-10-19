import { useState, useEffect } from 'react';
import { UploadCloud, FileSpreadsheet, CheckCircle, AlertTriangle, Save, X, Calculator, Loader2 } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function ImportData() {
  const [opdList, setOpdList] = useState<any[]>([]);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{ success: number; failed: number } | null>(null);
  
  // STATE BARU: Menambahkan status Loading agar seragam dengan halaman lain
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/instansi-opd')
      .then(res => res.json())
      .then(data => {
        setOpdList(Array.isArray(data) ? data : data?.data || []);
        // Memberikan jeda waktu 0.3 detik agar transisi animasi terlihat mulus
        setTimeout(() => setIsLoading(false), 50);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  // FUNGSI MEMBACA EXCEL & KALKULASI OTOMATIS
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);
      
      const formattedData = data.map((row: any) => {
        const matchedOpd = opdList.find(opd => 
          (opd.nama_instansi || '').toLowerCase().includes((row['Nama Instansi'] || '').toLowerCase())
        );

        const rawB1 = parseFloat(row['Poin B1 (Maks 30)']) || 0;
        const rawB2 = parseFloat(row['Poin B2 (Maks 20)']) || 0;
        const rawB3 = parseFloat(row['Poin B3 (Maks 20)']) || 0;
        const rawB4 = parseFloat(row['Poin B4 (Maks 25)']) || 0;
        const rawB5 = parseFloat(row['Poin B5 (Maks 20)']) || 0;
        const rawC  = parseFloat(row['Poin C (Maks 9)'])  || 0;
        const rawE  = parseFloat(row['Poin E (Maks 30)']) || 0;

        const b1_score = (rawB1 / 30) * 100;
        const b2_score = (rawB2 / 20) * 100;
        const b3_score = (rawB3 / 20) * 100;
        const b4_score = (rawB4 / 25) * 100;
        const b5_score = (rawB5 / 20) * 100;
        const c_score  = (rawC / 9) * 100;
        const e_score  = (rawE / 30) * 100;

        const total = (b1_score + b2_score + b3_score + b4_score + b5_score + c_score + e_score) / 7;

        let kategori = 'Kurang';
        if (total >= 90) kategori = 'Sangat Baik';
        else if (total >= 80) kategori = 'Baik';
        else if (total >= 70) kategori = 'Cukup';

        return {
          instansi_id: row['ID Instansi'] || (matchedOpd ? matchedOpd.id : null),
          nama_instansi: row['Nama Instansi'] || (matchedOpd ? matchedOpd.nama_instansi : 'Tidak Diketahui'),
          periode: row['Periode'] || '2026',
          b1_penciptaan: parseFloat(b1_score.toFixed(2)),
          b2_metadata: parseFloat(b2_score.toFixed(2)),
          b3_penyimpanan: parseFloat(b3_score.toFixed(2)),
          b4_distribusi: parseFloat(b4_score.toFixed(2)),
          b5_pemeliharaan: parseFloat(b5_score.toFixed(2)),
          c_faktor_pendukung: parseFloat(c_score.toFixed(2)),
          e_kualitas_aplikasi: parseFloat(e_score.toFixed(2)),
          total_nilai: parseFloat(total.toFixed(2)),
          kategori: kategori,
          isValid: (row['ID Instansi'] || matchedOpd) ? true : false
        };
      });

      setPreviewData(formattedData);
      setUploadStatus(null);
    };
    reader.readAsBinaryString(file);
    e.target.value = ''; 
  };

  const handleSimpanData = async () => {
    setIsUploading(true);
    let successCount = 0;
    let failCount = 0;

    for (const item of previewData) {
      if (!item.isValid) { failCount++; continue; }

      try {
        const payload = {
          instansi_id: Number(item.instansi_id),
          periode: String(item.periode),
          b1_penciptaan: item.b1_penciptaan,
          b2_metadata: item.b2_metadata,
          b3_penyimpanan: item.b3_penyimpanan,
          b4_distribusi: item.b4_distribusi,
          b5_pemeliharaan: item.b5_pemeliharaan,
          c_faktor_pendukung: item.c_faktor_pendukung,
          e_kualitas_aplikasi: item.e_kualitas_aplikasi,
          total_nilai: item.total_nilai,
          kategori: item.kategori
        };

        const response = await fetch('http://localhost:3000/hasil-monev', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (response.ok) successCount++;
        else failCount++;
      } catch (error) {
        failCount++;
      }
    }

    setUploadStatus({ success: successCount, failed: failCount });
    setIsUploading(false);
  };

  const downloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([{ 'ID Instansi': '', 'Nama Instansi': 'Kecamatan Rengel', 'Periode': 2026, 'Poin B1 (Maks 30)': 25, 'Poin B2 (Maks 20)': 18, 'Poin B3 (Maks 20)': 15, 'Poin B4 (Maks 25)': 20, 'Poin B5 (Maks 20)': 18, 'Poin C (Maks 9)': 7, 'Poin E (Maks 30)': 28 }]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template_Monev");
    XLSX.writeFile(wb, "Template_Import_Mentah.xlsx");
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500">Memuat data impport</div>;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <UploadCloud className="w-7 h-7 text-blue-600" /> Import Data Massal
        </h2>
        <p className="text-sm text-gray-500 mt-1">Unggah nilai mentah kuesioner. Sistem akan mengkalkulasi persentase dan nilai akhir secara otomatis.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 border-2 border-dashed border-blue-300 bg-blue-50/50 rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-all hover:bg-blue-50">
          <FileSpreadsheet className="w-12 h-12 text-blue-500 mb-4" />
          <h3 className="text-lg font-bold text-gray-800 mb-2">Tarik & Letakkan File Excel di sini</h3>
          
          <label className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold cursor-pointer shadow-md transition-all mt-4">
            Pilih File Excel
            <input type="file" accept=".xlsx, .xls" className="hidden" onChange={handleFileUpload} />
          </label>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-3 border-b border-gray-100 pb-2">Aturan Kalkulasi Otomatis</h3>
          <ul className="text-sm text-gray-600 space-y-3 mb-6">
            <li className="flex items-start"><Calculator className="w-4 h-4 text-blue-500 mr-2 mt-0.5 shrink-0"/> Cukup masukkan total poin mentah dari kuesioner ke Excel.</li>
            <li className="flex items-start"><Calculator className="w-4 h-4 text-blue-500 mr-2 mt-0.5 shrink-0"/> Sistem akan mengubahnya menjadi skala 100 secara otomatis.</li>
            <li className="flex items-start"><Calculator className="w-4 h-4 text-blue-500 mr-2 mt-0.5 shrink-0"/> Nilai akhir & predikat (Baik, Cukup, dll) langsung tergenerate di tabel pratinjau.</li>
          </ul>
          <button onClick={downloadTemplate} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-lg text-sm font-semibold transition-all">
            Unduh Template Mentah
          </button>
        </div>
      </div>

      {uploadStatus && (
        <div className={`mb-8 p-4 rounded-xl flex items-center border ${uploadStatus.failed === 0 ? 'bg-green-50 border-green-200 text-green-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
          {uploadStatus.failed === 0 ? <CheckCircle className="w-6 h-6 mr-3" /> : <AlertTriangle className="w-6 h-6 mr-3" />}
          <div>
            <h4 className="font-bold">Proses Import Selesai!</h4>
            <p className="text-sm mt-0.5">Berhasil: {uploadStatus.success} data | Gagal / Dilewati: {uploadStatus.failed} data.</p>
          </div>
        </div>
      )}

      {previewData.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Hasil Kalkulasi Otomatis ({previewData.length} baris)</h3>
              <p className="text-sm text-gray-500">Sistem telah menghitung nilai akhir berdasarkan poin mentah Excel.</p>
            </div>
            <div className="flex space-x-3">
              <button onClick={() => setPreviewData([])} className="px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg text-sm font-bold flex items-center transition">
                <X className="w-4 h-4 mr-2" /> Batal
              </button>
              <button onClick={handleSimpanData} disabled={isUploading} className="px-5 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-bold flex items-center shadow-md transition disabled:opacity-50">
                {isUploading ? 'Menyimpan...' : <><Save className="w-4 h-4 mr-2" /> Simpan ke Database</>}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-gray-200">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-sm border-b border-gray-200">
                  <th className="p-3 font-semibold">Validasi</th>
                  <th className="p-3 font-semibold">Nama Instansi</th>
                  <th className="p-3 font-semibold text-center">Periode</th>
                  <th className="p-3 font-semibold text-center bg-blue-50">Nilai Akhir (Kalkulasi)</th>
                  <th className="p-3 font-semibold text-center bg-blue-50">Predikat</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {previewData.map((row, idx) => (
                  <tr key={idx} className={`border-b border-gray-100 ${!row.isValid ? 'bg-red-50' : 'hover:bg-slate-50'}`}>
                    <td className="p-3 text-center">
                      {row.isValid ? <CheckCircle className="w-5 h-5 text-green-500 mx-auto" /> : <AlertTriangle className="w-5 h-5 text-red-500 mx-auto" title="Instansi tidak terdaftar" />}
                    </td>
                    <td className={`p-3 font-medium ${!row.isValid ? 'text-red-600' : 'text-gray-800'}`}>{row.nama_instansi}</td>
                    <td className="p-3 text-center text-gray-600">{row.periode}</td>
                    <td className="p-3 text-center font-bold text-blue-600">{row.total_nilai}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          row.kategori === 'Sangat Baik' ? 'bg-green-100 text-green-700' :
                          row.kategori === 'Baik' ? 'bg-blue-100 text-blue-700' :
                          row.kategori === 'Cukup' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                      }`}>{row.kategori}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}