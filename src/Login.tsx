import { useState } from 'react';
import { User, Lock, Eye, EyeOff } from 'lucide-react';

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex font-sans">
      
      {/* SISI KIRI - Branding (Hanya muncul di layar PC/Laptop) */}
      <div className="hidden lg:flex w-1/2 bg-[#1e293b] relative items-center justify-center overflow-hidden">
        {/* Efek latar belakang gelap transparan untuk tempat gambar gedung nanti */}
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="relative z-10 text-center text-white px-12 flex flex-col items-center">
          <div className="w-24 h-28 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md shadow-lg border border-white/20 mb-6">
            <span className="font-bold text-xl">LOGO</span>
          </div>
          <h1 className="text-4xl font-bold mb-3 tracking-wide">MONEV SRIKANDI</h1>
          <h2 className="text-xl font-medium mb-8 text-slate-300">Pemkab Tuban</h2>
          <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
            Sistem Monitoring dan Evaluasi SRIKANDI Kabupaten Tuban
          </p>
        </div>
      </div>

      {/* SISI KANAN - Formulir Login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-slate-50 p-8">
        <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
          
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Masuk ke Akun Anda</h2>
            <p className="text-sm text-gray-500">Silakan login untuk melanjutkan</p>
          </div>

          <form className="space-y-6" onSubmit={(e) => {
            e.preventDefault();
            onLogin(); // Menjalankan fungsi pindah halaman saat tombol ditekan
          }}>
            
            {/* Input Username */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 ml-1">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-gray-50 focus:bg-white transition"
                  placeholder="Masukkan username"
                  required
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="block w-full pl-11 pr-12 py-3.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-gray-50 focus:bg-white transition"
                  placeholder="Masukkan password"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-700 transition"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Tombol Login */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-3.5 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 mt-4 active:scale-[0.98]"
            >
              Login
            </button>
          </form>

          <div className="mt-8 text-left">
            <a href="#" className="text-sm text-blue-600 hover:underline font-semibold">
              Lupa password?
            </a>
          </div>
          
        </div>
      </div>
      
    </div>
  );
}