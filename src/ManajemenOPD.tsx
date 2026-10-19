import { useState, useEffect } from 'react';
import { 
  Building2, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X 
} from 'lucide-react';

interface OPDItem {
  id: number;
  nama_instansi: string;
  singkatan: string;
  nama_kepala: string;
  kontak: string;
}

export default function ManajemenOPD() {
  const [opdList, setOpdList] = useState<OPDItem[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // State Modal Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'tambah' | 'edit'>('tambah');
  const [formData, setFormData] = useState({
    id: 0,
    nama_instansi: '',
    singkatan: '',
    nama_kepala: '',
    kontak: ''
  });

  // 1. Ambil data dari API NestJS
  useEffect(() => {
    fetch('http://localhost:3000/instansi-opd')
      .then((response) => response.json())
      .then((data) => {
        setOpdList(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching OPD:', error);
        setIsLoading(false);
      });
  }, []);

  // 2. Fungsi Buka Modal
  const handleOpenModal = (mode: 'tambah' | 'edit', opd?: OPDItem) => {
    setModalMode(mode);
    if (mode === 'edit' && opd) {
      setFormData(opd);
    } else {
      setFormData({ id: 0, nama_instansi: '', singkatan: '', nama_kepala: '', kontak: '' });
    }
    setIsModalOpen(true);
  };

  // 3. Fungsi Simpan (Tambah / Edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = modalMode === 'tambah' 
      ? 'http://localhost:3000/instansi-opd' 
      : `http://localhost:3000/instansi-opd/${formData.id}`;
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
          setOpdList([...opdList, savedData]);
        } else {
          setOpdList(opdList.map((item) => (item.id === savedData.id ? savedData : item)));
        }
        setIsModalOpen(false);
        alert('Data Instansi berhasil disimpan!');
      }
    } catch (error) {
      console.error('Error saving OPD:', error);
      alert('Terjadi kesalahan saat menyimpan data.');
    }
  };

  // 4. Fungsi Hapus
  const handleDelete = async (id: number, nama: string) => {
    const isConfirm = window.confirm(`Hapus instansi "${nama}" dari sistem?`);
    if (isConfirm) {
      try {
        const response = await fetch(`http://localhost:3000/instansi-opd/${id}`, { method: 'DELETE' });
        if (response.ok) {
          setOpdList(opdList.filter((item) => item.id !== id));
        }
      } catch (error) {
        console.error('Error deleting OPD:', error);
      }
    }
  };

  const filteredOPD = opdList.filter((u) =>
    u.nama_instansi?.toLowerCase().includes(search.toLowerCase()) ||
    u.singkatan?.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) return <div className="p-8 text-center text-gray-500">Menyiapkan halaman...</div>;

  return (
  <div className="animate-in fade-in duration-500 relative">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Building2 className="w-7 h-7 text-blue-600" /> Data Instansi OPD
          </h2>
          <p className="text-sm text-gray-500 mt-1">Kelola daftar instansi dan organisasi perangkat daerah</p>
        </div>
        <button onClick={() => handleOpenModal('tambah')} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center transition shadow-md active:scale-95">
          <Plus className="w-4 h-4 mr-2" /> Tambah Instansi
        </button>
      </div>

      {/* TABEL DATA */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="mb-6 relative w-full md:w-80">
          <Search className="absolute inset-y-3 left-3 h-4 w-4 text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama instansi atau singkatan..." className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none bg-gray-50" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-y border-gray-200">
                <th className="p-4 font-semibold w-12">No</th>
                <th className="p-4 font-semibold">Nama Instansi</th>
                <th className="p-4 font-semibold">Nama Kepala</th>
                <th className="p-4 font-semibold">Kontak</th>
                <th className="p-4 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {isLoading && <tr><td colSpan={5} className="p-8 text-center text-gray-500">Loading data instansi...</td></tr>}
              {!isLoading && filteredOPD.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-gray-500">Belum ada data instansi.</td></tr>}
              
              {!isLoading && filteredOPD.map((item, index) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition">
                  <td className="p-4 text-gray-500">{index + 1}</td>
                  <td className="p-4">
                    <p className="font-semibold text-gray-800">{item.nama_instansi}</p>
                    <p className="text-xs text-gray-400">{item.singkatan}</p>
                  </td>
                  <td className="p-4 text-gray-600">{item.nama_kepala || '-'}</td>
                  <td className="p-4 text-gray-600">{item.kontak || '-'}</td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button onClick={() => handleOpenModal('edit', item)} className="p-1.5 text-gray-500 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 rounded-md transition"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(item.id, item.nama_instansi)} className="p-1.5 text-gray-500 hover:text-red-600 bg-gray-50 hover:bg-red-50 rounded-md transition"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-gray-800 text-lg">{modalMode === 'tambah' ? 'Tambah Instansi Baru' : 'Edit Instansi'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Instansi Lengkap</label>
                <input required type="text" value={formData.nama_instansi} onChange={(e) => setFormData({...formData, nama_instansi: e.target.value})} placeholder="Dinas Komunikasi dan Informatika" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Singkatan / Nama Pendek</label>
                <input type="text" value={formData.singkatan} onChange={(e) => setFormData({...formData, singkatan: e.target.value})} placeholder="Diskominfo" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Kepala (Opsional)</label>
                <input type="text" value={formData.nama_kepala} onChange={(e) => setFormData({...formData, nama_kepala: e.target.value})} placeholder="Nama Pimpinan Instansi" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Kontak / Telp (Opsional)</label>
                <input type="text" value={formData.kontak} onChange={(e) => setFormData({...formData, kontak: e.target.value})} placeholder="0356-XXXX" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none" />
              </div>
              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg">Batal</button>
                <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md">Simpan Data</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}