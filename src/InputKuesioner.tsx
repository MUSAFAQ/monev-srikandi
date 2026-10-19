import { useState, useEffect } from 'react';
import { FileText, Save, AlertCircle, Loader2 } from 'lucide-react';

const SOAL_B1 = ["Naskah dinas dibuat langsung melalui fitur Konsep Naskah", "Nomor naskah dinas diberikan melalui sistem", "Naskah dinas keluar diterbitkan menggunakan naskah final", "Naskah dinas yang diterbitkan menggunakan TTE", "Naskah dinas yang dibuat tercatat dalam log", "Surat masuk dari pihak eksternal diterima dan diregistrasi"];
const SOAL_B2 = ["Data/informasi arsip (metadata) diisi secara lengkap", "Klasifikasi arsip dipilih sesuai dengan JRA", "Jenis arsip diisi sesuai dengan kondisi naskah", "Metadata diperiksa sebelum naskah dikirim"];
const SOAL_B3 = ["Arsip elektronik disimpan sesuai klasifikasi", "Setiap naskah dinas diberkaskan sesuai kegiatan", "Daftar arsip aktif diperbarui secara berkala", "Arsip elektronik disimpan pada SRIKANDI tidak di media pribadi"];
const SOAL_B4 = ["Disposisi naskah dilakukan melalui fitur disposisi elektronik", "Naskah didistribusikan sesuai kebutuhan", "Pimpinan menggunakan fitur disposisi", "Disposisi digunakan oleh semua unsur terkait hingga staf", "Tindak lanjut disposisi telah diselesaikan sampai akhir"];
const SOAL_B5 = ["Arsip elektronik dilakukan pencadangan (backup) berkala", "OPD memiliki SOP tentang pemeliharaan arsip", "Terdapat petugas yang bertanggung jawab mengelola arsip", "Arsip elektronik tetap utuh dan dapat dipercaya"];
const SOAL_C = ["Pimpinan memberikan arahan resmi penggunaan aplikasi", "Pimpinan menggunakan fitur disposisi", "Pimpinan memberikan dukungan sarana/prasarana", "Operator telah mengikuti pelatihan", "Operator mendapatkan pendampingan teknis", "Operator memahami tahapan pengelolaan arsip", "Koneksi internet di unit kerja mendukung", "Komputer atau laptop mendukung operasional", "Akun pengguna SRIKANDI aktif"];
const SOAL_E = ["Aplikasi mudah digunakan untuk naskah dinas", "Kolom metadata mudah dipahami dan diisi", "Aplikasi memberikan respons yang cepat", "Aplikasi mendukung keamanan pengelolaan", "Penggunaan aplikasi mempercepat pekerjaan", "Penggunaan aplikasi mewujudkan tertib administrasi"];

export default function InputKuesioner() {
  const [opdList, setOpdList] = useState<any[]>([]);
  const [existingData, setExistingData] = useState<any[]>([]); 
  const [instansiId, setInstansiId] = useState<string>('0');
  const [periode, setPeriode] = useState('2026');

  const [ansB1, setAnsB1] = useState<number[]>(Array(6).fill(0));
  const [ansB2, setAnsB2] = useState<number[]>(Array(4).fill(0));
  const [ansB3, setAnsB3] = useState<number[]>(Array(4).fill(0));
  const [ansB4, setAnsB4] = useState<number[]>(Array(5).fill(0));
  const [ansB5, setAnsB5] = useState<number[]>(Array(4).fill(0));
  const [ansC, setAnsC] = useState<number[]>(Array(9).fill(-1)); 
  const [ansE, setAnsE] = useState<number[]>(Array(6).fill(0));

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // <-- STATE LOADING SUDAH DITAMBAHKAN

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:3000/instansi-opd').then(res => res.json()),
      fetch('http://localhost:3000/hasil-monev').then(res => res.json())
    ])
    .then(([dataOpd, dataMonev]) => {
      if (Array.isArray(dataOpd)) setOpdList(dataOpd);
      if (Array.isArray(dataMonev)) setExistingData(dataMonev);
      // Memberikan jeda 0.3 detik agar transisi halaman terlihat anggun
      setTimeout(() => setIsLoading(false), 50);
    })
    .catch(err => {
      console.error(err);
      setIsLoading(false);
    });
  }, []);

  const updateAns = (setFunc: React.Dispatch<React.SetStateAction<number[]>>, index: number, val: number) => {
    setFunc(prev => { const newArr = [...prev]; newArr[index] = val; return newArr; });
  };

  const calculateScores = () => {
    const b1_score = (ansB1.reduce((a, b) => a + b, 0) / 30) * 100;
    const b2_score = (ansB2.reduce((a, b) => a + b, 0) / 20) * 100;
    const b3_score = (ansB3.reduce((a, b) => a + b, 0) / 20) * 100;
    const b4_score = (ansB4.reduce((a, b) => a + b, 0) / 25) * 100;
    const b5_score = (ansB5.reduce((a, b) => a + b, 0) / 20) * 100;
    const c_score = (ansC.filter(v => v === 1).length / 9) * 100;
    const e_score = (ansE.reduce((a, b) => a + b, 0) / 30) * 100;

    const total = (b1_score + b2_score + b3_score + b4_score + b5_score + c_score + e_score) / 7;
    let kategori = 'Kurang';
    if (total >= 90) kategori = 'Sangat Baik';
    else if (total >= 80) kategori = 'Baik';
    else if (total >= 70) kategori = 'Cukup';

    return { b1_score, b2_score, b3_score, b4_score, b5_score, c_score, e_score, total, kategori };
  };

  const handleSubmit = async () => {
    // 1. Cek apakah Instansi sudah dipilih
    if (instansiId === '0' || !instansiId) {
      return alert('PENTING: Silakan pilih Instansi / OPD terlebih dahulu!');
    }

    // 2. PENJAGA GERBANG VERSI BARU (Fitur Edit)
    const existingRecord = existingData.find(item => String(item.instansi_id) === String(instansiId));
    
    if (existingRecord) {
      const confirmEdit = window.confirm(
        'Instansi ini sudah memiliki nilai di sistem.\n\nApakah Anda yakin ingin MENGHITUNG ULANG dan MENIMPA nilai sebelumnya dengan isian kuesioner yang baru ini?'
      );
      if (!confirmEdit) return; 
    }

    setIsSubmitting(true);
    const scores = calculateScores();

    const payload = {
      instansi_id: Number(instansiId),
      periode: periode,
      b1_penciptaan: parseFloat(scores.b1_score.toFixed(2)) || 0,
      b2_metadata: parseFloat(scores.b2_score.toFixed(2)) || 0,
      b3_penyimpanan: parseFloat(scores.b3_score.toFixed(2)) || 0,
      b4_distribusi: parseFloat(scores.b4_score.toFixed(2)) || 0,
      b5_pemeliharaan: parseFloat(scores.b5_score.toFixed(2)) || 0,
      c_faktor_pendukung: parseFloat(scores.c_score.toFixed(2)) || 0,
      e_kualitas_aplikasi: parseFloat(scores.e_score.toFixed(2)) || 0,
      total_nilai: parseFloat(scores.total.toFixed(2)) || 0,
      kategori: scores.kategori || 'Kurang'
    };

    try {
      const url = existingRecord 
        ? `http://localhost:3000/hasil-monev/${existingRecord.id}` 
        : 'http://localhost:3000/hasil-monev';
      
      const method = existingRecord ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert(
          existingRecord 
          ? `UPDATE SUKSES! Nilai berhasil diperbarui.\nNilai Akhir Baru: ${payload.total_nilai} (${payload.kategori})` 
          : `SUKSES! Data baru berhasil ditambahkan.\nNilai Akhir: ${payload.total_nilai} (${payload.kategori})`
        );
        
        const updatedData = await fetch('http://localhost:3000/hasil-monev').then(res => res.json());
        setExistingData(Array.isArray(updatedData) ? updatedData : (updatedData?.data || []));

        // Reset form ke awal
        setAnsB1(Array(6).fill(0)); setAnsB2(Array(4).fill(0)); setAnsB3(Array(4).fill(0));
        setAnsB4(Array(5).fill(0)); setAnsB5(Array(4).fill(0)); setAnsE(Array(6).fill(0)); setAnsC(Array(9).fill(-1));
      } else {
        alert('Gagal memproses data di server.');
      }
    } catch (error) {
      alert('Koneksi Terputus dari Server!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderSkala = (soalArray: string[], ansArray: number[], setAnsFunc: any, sectionTitle: string) => (
    <div className="mb-8">
      <h3 className="font-bold text-lg text-blue-800 mb-4 bg-blue-50 p-3 rounded-lg">{sectionTitle}</h3>
      <div className="space-y-4">
        {soalArray.map((soal, i) => (
          <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-3 hover:bg-gray-50 border-b border-gray-100 rounded">
            <p className="text-sm text-gray-700 md:w-2/3 mb-3 md:mb-0 pr-4">{i + 1}. {soal}</p>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map(val => (
                <button key={val} onClick={() => updateAns(setAnsFunc, i, val)} className={`w-10 h-10 rounded-full text-sm font-bold transition-all ${ansArray[i] === val ? 'bg-blue-600 text-white shadow-md scale-110' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>{val}</button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // === TAMPILAN LOADING YANG RAPI ===
  if (isLoading) return <div className="p-8 text-center text-gray-500">Memuat data kuisioner...</div>;


  // === KELAS TAILWIND (ANIMASI NAIK & FADE-IN) ===
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><FileText className="w-7 h-7 text-blue-600" /> Digitalisasi Kuesioner OPD</h2>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 bg-slate-50 p-6 rounded-xl border border-gray-200">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Instansi / OPD Responden</label>
            <select value={instansiId} onChange={(e) => setInstansiId(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none">
              <option value="0">-- Pilih Instansi --</option>
              {opdList.map((opd, idx) => (
                <option key={idx} value={opd.id}>{opd.nama_instansi || opd.nama || 'Instansi'}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Tahun Periode Monitoring</label>
            <input type="text" value={periode} onChange={(e) => setPeriode(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none" />
          </div>
        </div>

        <div className="mb-6 flex items-center p-4 bg-amber-50 text-amber-800 rounded-lg text-sm">
          <AlertCircle className="w-5 h-5 mr-2" />
          Petunjuk: Skala 1 = Sangat Tidak Setuju. Skala 5 = Sangat Setuju.
        </div>

        {renderSkala(SOAL_B1, ansB1, setAnsB1, "BAGIAN B.1 - Penciptaan")}
        {renderSkala(SOAL_B2, ansB2, setAnsB2, "BAGIAN B.2 - Metadata")}
        {renderSkala(SOAL_B3, ansB3, setAnsB3, "BAGIAN B.3 - Penyimpanan")}
        {renderSkala(SOAL_B4, ansB4, setAnsB4, "BAGIAN B.4 - Distribusi")}
        {renderSkala(SOAL_B5, ansB5, setAnsB5, "BAGIAN B.5 - Pemeliharaan")}

        <div className="mb-8">
          <h3 className="font-bold text-lg text-blue-800 mb-4 bg-blue-50 p-3 rounded-lg">BAGIAN C - Faktor Pendukung</h3>
          <div className="space-y-4">
            {SOAL_C.map((soal, i) => (
              <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-3 hover:bg-gray-50 border-b border-gray-100 rounded">
                <p className="text-sm text-gray-700 md:w-3/4 mb-3 md:mb-0 pr-4">{i + 1}. {soal}</p>
                <div className="flex space-x-3">
                  <button onClick={() => updateAns(setAnsC, i, 1)} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${ansC[i] === 1 ? 'bg-green-500 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Ya</button>
                  <button onClick={() => updateAns(setAnsC, i, 0)} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${ansC[i] === 0 ? 'bg-red-500 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Tidak</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {renderSkala(SOAL_E, ansE, setAnsE, "BAGIAN E - Kualitas Aplikasi")}

        <div className="mt-12 pt-6 border-t border-gray-200 flex justify-end">
          <button onClick={handleSubmit} disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-bold flex items-center shadow-lg transition-all active:scale-95 disabled:opacity-50">
            {isSubmitting ? 'Memproses...' : <><Save className="w-6 h-6 mr-3" /> Simpan & Kalkulasi Nilai Akhir</>}
          </button>
        </div>
      </div>
    </div>
  );
}