import { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  ShieldCheck, 
  Edit2, 
  Trash2, 
  KeyRound,
  CheckCircle,
  XCircle,
  X // Ikon silang untuk menutup modal
} from 'lucide-react';

interface UserItem {
  id: number;
  nama: string;
  username: string;
  role: string;
  instansi: string;
  status: string;
}

export default function ManajemenUser() {
  const [userList, setUserList] = useState<UserItem[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // ==========================================
  // 1. STATE BARU UNTUK KONTROL MODAL (POP-UP)
  // ==========================================
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'tambah' | 'edit'>('tambah');
  const [formData, setFormData] = useState({
    id: 0,
    nama: '',
    username: '',
    password: '',
    role: 'OPD',
    instansi: '',
    status: 'Aktif'
  });

  // Fungsi mengambil data dari API
  useEffect(() => {
    fetch('http://localhost:3000/users')
      .then((response) => response.json())
      .then((data) => {
        setUserList(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error mengambil data:', error);
        setIsLoading(false);
      });
  }, []);

  // Fungsi Hapus User
  const handleDelete = async (id: number, nama: string) => {
    const isConfirm = window.confirm(`Apakah Anda yakin ingin menghapus pengguna "${nama}"?`);
    if (isConfirm) {
      try {
        const response = await fetch(`http://localhost:3000/users/${id}`, { method: 'DELETE' });
        if (response.ok) {
          setUserList(userList.filter((user) => user.id !== id));
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  // ==========================================
  // 2. FUNGSI UNTUK MEMBUKA & SUBMIT FORM
  // ==========================================
  
  // Membuka modal
  const handleOpenModal = (mode: 'tambah' | 'edit', user?: UserItem) => {
    setModalMode(mode);
    if (mode === 'edit' && user) {
      // Jika edit, isi form dengan data user yang diklik
      setFormData({ ...user, password: '' }); 
    } else {
      // Jika tambah, kosongkan form
      setFormData({ id: 0, nama: '', username: '', password: '', role: 'OPD', instansi: '', status: 'Aktif' });
    }
    setIsModalOpen(true);
  };

  // Menyimpan data (Create / Update) ke API NestJS
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Mencegah halaman refresh saat disubmit

    const url = modalMode === 'tambah' 
      ? 'http://localhost:3000/users' 
      : `http://localhost:3000/users/${formData.id}`;
      
    const method = modalMode === 'tambah' ? 'POST' : 'PATCH';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const savedUser = await response.json();
        
        if (modalMode === 'tambah') {
          // Tambahkan ke tabel
          setUserList([...userList, savedUser]);
        } else {
          // Perbarui baris tabel yang diedit
          setUserList(userList.map((u) => (u.id === savedUser.id ? savedUser : u)));
        }
        
        setIsModalOpen(false); // Tutup modal setelah sukses
        alert(modalMode === 'tambah' ? 'Berhasil menambah pengguna!' : 'Berhasil menyimpan perubahan!');
      } else {
        alert('Gagal menyimpan data.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan pada sistem.');
    }
  };


  const filteredUsers = userList.filter((u) =>
    u.nama?.toLowerCase().includes(search.toLowerCase()) ||
    u.username?.toLowerCase().includes(search.toLowerCase()) ||
    u.instansi?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Users className="w-7 h-7 text-blue-600" /> Manajemen Pengguna
          </h2>
          <p className="text-sm text-gray-500 mt-1">Kelola akun akses untuk Admin, Pimpinan, dan OPD</p>
        </div>
        
        {/* TOMBOL TAMBAH USER DISAMBUNGKAN KE handleOpenModal */}
        <button 
          onClick={() => handleOpenModal('tambah')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center transition shadow-md shadow-blue-600/20 active:scale-95"
        >
          <UserPlus className="w-4 h-4 mr-2" /> Tambah Pengguna
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-full md:w-80">
            <Search className="absolute inset-y-3 left-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-gray-50 transition"
              placeholder="Cari nama, username, atau OPD..."
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-y border-gray-200">
                <th className="p-4 font-semibold w-12">No</th>
                <th className="p-4 font-semibold">Nama & Username</th>
                <th className="p-4 font-semibold">Instansi / Unit</th>
                <th className="p-4 font-semibold">Role</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {isLoading && <tr><td colSpan={6} className="p-8 text-center text-gray-500">Loading...</td></tr>}
              {!isLoading && filteredUsers.map((item, index) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition">
                  <td className="p-4 text-gray-500">{index + 1}</td>
                  <td className="p-4">
                    <p className="font-semibold text-gray-800">{item.nama}</p>
                    <p className="text-xs text-gray-400 font-mono">@{item.username}</p>
                  </td>
                  <td className="p-4 text-gray-600">{item.instansi || '-'}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${item.role === 'Admin' ? 'bg-purple-100 text-purple-700' : item.role === 'Pimpinan' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                      <ShieldCheck className="w-3 h-3 mr-1" /> {item.role}
                    </span>
                  </td>
                  <td className="p-4">
                    {item.status === 'Aktif' ? (
                      <span className="text-green-600 font-medium flex items-center"><CheckCircle className="w-3.5 h-3.5 mr-1" /> Aktif</span>
                    ) : (
                      <span className="text-red-500 font-medium flex items-center"><XCircle className="w-3.5 h-3.5 mr-1" /> Nonaktif</span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button title="Reset Password" className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-md transition"><KeyRound className="w-4 h-4" /></button>
                      
                      {/* TOMBOL EDIT DISAMBUNGKAN KE handleOpenModal */}
                      <button onClick={() => handleOpenModal('edit', item)} title="Edit User" className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      
                      <button onClick={() => handleDelete(item.id, item.nama)} title="Hapus User" className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================== */}
      {/* 3. KODE DESAIN UNTUK MODAL POP-UP FORM     */}
      {/* ========================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-gray-800 text-lg">
                {modalMode === 'tambah' ? 'Tambah Pengguna Baru' : 'Edit Data Pengguna'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Lengkap</label>
                <input required type="text" value={formData.nama} onChange={(e) => setFormData({...formData, nama: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none" />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
                <input required type="text" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none" />
              </div>

              {/* Password hanya wajib saat menambah user baru */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Password {modalMode === 'edit' && <span className="text-xs text-gray-400 font-normal">(Kosongkan jika tidak diubah)</span>}
                </label>
                <input required={modalMode === 'tambah'} type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Role</label>
                  <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none cursor-pointer">
                    <option value="Admin">Admin</option>
                    <option value="Pimpinan">Pimpinan</option>
                    <option value="OPD">OPD</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none cursor-pointer">
                    <option value="Aktif">Aktif</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Instansi / Unit</label>
                <input type="text" value={formData.instansi} onChange={(e) => setFormData({...formData, instansi: e.target.value})} placeholder="Contoh: Dinas Kesehatan" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none" />
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition">Batal</button>
                <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition">
                  {modalMode === 'tambah' ? 'Simpan Data' : 'Perbarui Data'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}