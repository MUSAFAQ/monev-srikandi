import { useState, useEffect } from 'react';
import { 
  ClipboardCheck, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X,
  Calculator
} from 'lucide-react';

// Struktur Data
interface OPDItem {
  id: number;
  nama_instansi: string;
}

interface PenilaianItem {
  id: number;
  instansi_id: number;
  periode: string;
  b1_kebijakan: number;
  b2_pembinaan: number;
  b3_infrastruktur: number;
  b4_aplikasi: number;
  b5_audit: number;
  total_nilai: number;
  kategori: string;
}

export default function ManajemenPenilaian() {
  const [penilaianList, setPenilaianList] = useState<PenilaianItem[]>([]);
  const [opdList, setOpdList] = useState<OPDItem[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // State Modal Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'tambah' | 'edit'>('tambah');
  const [formData, setFormData] = useState<PenilaianItem>({
    id: 0,
    instansi_id: 0,
    periode: 'Tahun 2026',
    b1_kebijakan: 0,
    b2_pembinaan: 0,
    b3_infrastruktur: 0,
    b4_aplikasi: 0,
    b5_audit: 0,
    total_nilai: 0,
    kategori: 'Kurang'
  });

  // 1. Mengambil Data OPD dan Data Penilaian Sekaligus
  useEffect(() => {
    Promise.all([
      fetch('http://localhost:3000/instansi-opd').then(res => res.json()),
      fetch('http://localhost:3000/hasil-monev').then(res => res.json())
    ])
    .then(([dataOpd, dataMonev]) => {
      setOpdList(dataOpd);
      setPenilaianList(dataMonev);
      setIsLoading(false);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    });
  }, []);

  // 2. Logika Menghitung Total & Kategori Otomatis
  const handleInputChange = (field: keyof PenilaianItem, value: any) => {
    const updatedForm = { ...formData, [field]: field.startsWith('b') ? Number(value) : value };

    // Kalkulasi Otomatis Rata-rata
    if (field.startsWith('b')) {
      const rataRata = (
        Number(updatedForm.b1_kebijakan) + 
        Number(updatedForm.b2_pembinaan) + 
        Number(updatedForm.b3_infrastruktur) + 
        Number(updatedForm.b4_aplikasi) + 
        Number(updatedForm.b5_audit)
      ) / 5;

      updatedForm.total_nilai = parseFloat(rataRata.toFixed(2));

      if (rataRata >= 90) updatedForm.kategori = 'Sangat Baik';
      else if (rataRata >= 80) updatedForm.kategori = 'Baik';
      else if (rataRata >= 70) updatedForm.kategori = 'Cukup';
      else updatedForm.kategori = 'Kurang';
    }

    setFormData(updatedForm);
  };

  // 3. Fungsi Buka Modal
  const handleOpenModal = (mode: 'tambah' | 'edit', data?: PenilaianItem) => {
    setModalMode(mode);
    if (mode === 'edit' && data) {
      setFormData(data);
    } else {
      setFormData({
        id: 0, instansi_id: opdList.length > 0 ? opdList[0].id : 0, 
        periode: 'Tahun 2026', b1_kebijakan: 0, b2_pembinaan: 0, b3_infrastruktur: 0, 
        b4_aplikasi: 0, b5_audit: 0, total_nilai: 0, kategori: 'Kurang'
      });
    }
    setIsModalOpen(true);
  };

  // 4. Fungsi Simpan (Create / Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.instansi_id === 0) return alert('Silakan pilih Instansi OPD terlebih dahulu!');

    const url = modalMode === 'tambah' ? 'http://localhost:3000/hasil-monev' : `http://localhost:3000/hasil-monev/${formData.id}`;
    const method = modalMode === 'tambah' ? 'POST' : 'PATCH';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const savedData = await response.json();
        if (modalMode === 'tambah') {
          setPenilaianList([...penilaianList, savedData]);
        } else {
          setPenilaianList(penilaianList.map((item) => (item.id === savedData.id ? savedData : item)));
        }
        setIsModalOpen(false);
        alert('Data Penilaian berhasil disimpan!');
      }
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  // 5. Fungsi Hapus
  const handleDelete = async (id: number) => {
    if (window.confirm('Hapus data penilaian ini?')) {
      try {
        const response = await fetch(`http://localhost:3000/hasil-monev/${id}`, { method: 'DELETE' });
        if (response.ok) setPenilaianList(penilaianList.filter((item) => item.id !== id));
      } catch (error) {
        console.error('Error deleting:', error);
      }
    }
  };

  // Mendapatkan nama instansi berdasarkan ID
  const getNamaInstansi = (id: number) => {
    const opd = opdList.find(o => o.id === id);
    return opd ? opd.nama_instansi : 'Instansi Tidak Diketahui';
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <ClipboardCheck className="w-7 h-7 text-blue-600" /> Hasil Penilaian Monev
          </h2>
          <p className="text-sm text-gray-500 mt-1">Kelola skor indikator penilaian SRIKANDI per Instansi</p>
        </div>
        <button onClick={() => handleOpenModal('tambah')} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center transition shadow-md active:scale-95">
          <Plus className="w-4 h-4 mr-2" /> Input Nilai Baru
        </button>
      </div>

      {/* TABEL DATA */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-y border-gray-200">
                <th className="p-4 font-semibold w-12">No</th>
                <th className="p-4 font-semibold">Nama Instansi</th>
                <th className="p-4 font-semibold text-center">Periode</th>
                <th className="p-4 font-semibold text-center">Nilai Akhir</th>
                <th className="p-4 font-semibold text-center">Kategori</th>
                <th className="p-4 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {isLoading && <tr><td colSpan={6} className="p-8 text-center text-gray-500">Loading data penilaian...</td></tr>}
              {!isLoading && penilaianList.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-gray-500">Belum ada data penilaian yang diinput.</td></tr>}
              
              {!isLoading && penilaianList.map((item, index) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition">
                  <td className="p-4 text-gray-500">{index + 1}</td>
                  <td className="p-4 font-semibold text-gray-800">{getNamaInstansi(item.instansi_id)}</td>
                  <td className="p-4 text-center text-gray-600">{item.periode}</td>
                  <td className="p-4 text-center font-bold text-blue-600 text-base">{item.total_nilai}</td>
                  <td className="p-4 text-center">
                    <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-semibold ${
                      item.kategori === 'Sangat Baik' ? 'bg-green-100 text-green-700' :
                      item.kategori === 'Baik' ? 'bg-blue-100 text-blue-700' :
                      item.kategori === 'Cukup' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {item.kategori}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button onClick={() => handleOpenModal('edit', item)} className="p-1.5 text-gray-500 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 rounded-md transition"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 text-gray-500 hover:text-red-600 bg-gray-50 hover:bg-red-50 rounded-md transition"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL FORM PENILAIAN */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                <Calculator className="w-5 h-5 text-blue-600" />
                {modalMode === 'tambah' ? 'Input Penilaian Baru' : 'Edit Data Penilaian'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Pilih Instansi / OPD</label>
                  <select 
                    value={formData.instansi_id} 
                    onChange={(e) => handleInputChange('instansi_id', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none cursor-pointer"
                  >
                    {opdList.length === 0 && <option value={0}>Belum ada data Instansi</option>}
                    {opdList.map(opd => (
                      <option key={opd.id} value={opd.id}>{opd.nama_instansi}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Periode Penilaian</label>
                  <input type="text" value={formData.periode} onChange={(e) => handleInputChange('periode', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none" />
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-gray-100 mb-6">
                <h4 className="text-sm font-bold text-gray-700 mb-4 border-b pb-2">Skor Indikator (Skala 0 - 100)</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">B1. Kebijakan</label>
                    <input type="number" min="0" max="100" value={formData.b1_kebijakan} onChange={(e) => handleInputChange('b1_kebijakan', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-600 outline-none font-bold text-blue-600" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">B2. Pembinaan</label>
                    <input type="number" min="0" max="100" value={formData.b2_pembinaan} onChange={(e) => handleInputChange('b2_pembinaan', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-600 outline-none font-bold text-blue-600" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">B3. Infrastruktur</label>
                    <input type="number" min="0" max="100" value={formData.b3_infrastruktur} onChange={(e) => handleInputChange('b3_infrastruktur', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-600 outline-none font-bold text-blue-600" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">B4. Aplikasi</label>
                    <input type="number" min="0" max="100" value={formData.b4_aplikasi} onChange={(e) => handleInputChange('b4_aplikasi', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-600 outline-none font-bold text-blue-600" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">B5. Audit</label>
                    <input type="number" min="0" max="100" value={formData.b5_audit} onChange={(e) => handleInputChange('b5_audit', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-600 outline-none font-bold text-blue-600" />
                  </div>
                </div>
              </div>

              {/* Tampilan Hasil Kalkulasi Otomatis */}
              <div className="flex items-center justify-between bg-blue-50 border border-blue-100 p-4 rounded-lg mb-6">
                <div>
                  <p className="text-sm font-semibold text-blue-800">Total Nilai Akhir</p>
                  <p className="text-xs text-blue-600">Dihitung otomatis (rata-rata 5 indikator)</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-3xl font-bold text-blue-700">{formData.total_nilai}</p>
                  </div>
                  <div className="h-10 w-px bg-blue-200"></div>
                  <span className={`px-3 py-1 rounded-md text-sm font-bold ${
                    formData.kategori === 'Sangat Baik' ? 'bg-green-500 text-white' :
                    formData.kategori === 'Baik' ? 'bg-blue-500 text-white' :
                    formData.kategori === 'Cukup' ? 'bg-amber-500 text-white' :
                    'bg-red-500 text-white'
                  }`}>
                    {formData.kategori}
                  </span>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg">Batal</button>
                <button type="submit" className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md">Simpan Penilaian</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}