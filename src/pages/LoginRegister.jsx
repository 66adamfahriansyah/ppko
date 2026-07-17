import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { login, register } from '../services/authService';
import { useNavigate, useLocation } from 'react-router-dom';

function LoginRegister({ mode = 'login' }) {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isLogin = mode === 'login';
  const fromMonitoring = location.state?.from === 'monitoring';


  const [username, setUsername] = useState('');
  const [namaLengkap, setNamaLengkap] = useState('');
  const [noTelp, setNoTelp] = useState('');
  const [asalPoktan, setAsalPoktan] = useState('');
  const [alamat, setAlamat] = useState('');
  const [jenisKelamin, setJenisKelamin] = useState('Laki-Laki');
  const [password, setPassword] = useState('');
  const [identity, setIdentity] = useState(''); // email or username for login
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const data = await register(username, namaLengkap, noTelp, asalPoktan, alamat, jenisKelamin, password);

      setSuccess('Registrasi berhasil! Mengalihkan ke halaman masuk...');
      // Reset fields
      setUsername('');
      setNamaLengkap('');
      setNoTelp('');
      setAsalPoktan('');
      setAlamat('');
      setJenisKelamin('Laki-Laki');
      setPassword('');



      // Auto-redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const data = await login(identity, password);

      setSuccess('Login berhasil!');
      loginUser(data.user, data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f6f3] p-4 font-sans relative overflow-hidden">
      {/* Background Decorative Circles */}
      <div className="absolute w-96 h-96 rounded-full bg-emerald-50 -top-20 -left-20 blur-3xl opacity-60"></div>
      <div className="absolute w-96 h-96 rounded-full bg-emerald-100 -bottom-20 -right-20 blur-3xl opacity-60"></div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-emerald-50 p-8 z-10 relative backdrop-blur-sm bg-white/95">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mx-auto mb-3">
            <img src="/logo.png" alt="Logo" className="w-48 h-12 object-contain" />
          </div>
          <h2 className="text-2xl font-black text-emerald-900 tracking-tight"></h2>
          <p className="text-xs text-gray-500 font-medium mt-1">Sistem Monitoring & Kontrol Light Trap Berbasis IoT</p>
        </div>

        {/* Title Header */}
        <div className="text-center mb-6">
          <h3 className="text-lg font-extrabold text-emerald-950">
            {isLogin ? 'Masuk ke Akun Anda' : 'Daftar Akun Baru'}
          </h3>
        </div>


        {/* Feedback Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center gap-2 animate-pulse">
            <i className="bi bi-exclamation-triangle-fill"></i>
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
            <i className="bi bi-check-circle-fill"></i>
            {success}
          </div>
        )}

        {/* Forms */}
        {isLogin ? (
          /* LOGIN FORM */
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Username / Email</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                  <i className="bi bi-person-fill"></i>
                </span>
                <input
                  type="text"
                  required
                  placeholder="Masukkan Username atau Email"
                  value={identity}
                  onChange={(e) => setIdentity(e.target.value)}
                  className="w-full bg-gray-50/50 border border-gray-150 rounded-xl py-3 pl-10 pr-4 text-xs outline-none focus:border-[#0b5924] focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                  <i className="bi bi-lock-fill"></i>
                </span>
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50/50 border border-gray-150 rounded-xl py-3 pl-10 pr-10 text-xs outline-none focus:border-[#0b5924] focus:bg-white transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(prev => !prev)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-emerald-700 focus:outline-none cursor-pointer"
                >
                  <i className={`bi ${showLoginPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
                </button>
              </div>
            </div>


            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0b5924] hover:bg-[#073c18] text-white py-3.5 rounded-xl text-xs font-bold transition shadow-md shadow-emerald-950/15 flex justify-center items-center gap-2 mt-6 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>Masuk Aplikasi <i className="bi bi-arrow-right-short text-lg leading-none"></i></>
              )}
            </button>
          </form>
        ) : (
          /* REGISTER FORM */
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Username</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                  <i className="bi bi-person-badge-fill"></i>
                </span>
                <input
                  type="text"
                  required
                  placeholder="Username Anda"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-gray-50/50 border border-gray-150 rounded-xl py-3 pl-10 pr-4 text-xs outline-none focus:border-[#0b5924] focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Nama Lengkap</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                  <i className="bi bi-person-fill"></i>
                </span>
                <input
                  type="text"
                  required
                  placeholder="Nama Lengkap Anda"
                  value={namaLengkap}
                  onChange={(e) => setNamaLengkap(e.target.value)}
                  className="w-full bg-gray-50/50 border border-gray-150 rounded-xl py-3 pl-10 pr-4 text-xs outline-none focus:border-[#0b5924] focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Nomor Telefon (WhatsApp)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                  <i className="bi bi-whatsapp"></i>
                </span>
                <input
                  type="tel"
                  required
                  placeholder="628123456789"
                  value={noTelp}
                  onChange={(e) => setNoTelp(e.target.value)}
                  className="w-full bg-gray-50/50 border border-gray-150 rounded-xl py-3 pl-10 pr-4 text-xs outline-none focus:border-[#0b5924] focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Asal Poktan (Kelompok Tani)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                  <i className="bi bi-geo-alt-fill"></i>
                </span>
                <input
                  type="text"
                  required
                  placeholder="Poktan Tani Sajen"
                  value={asalPoktan}
                  onChange={(e) => setAsalPoktan(e.target.value)}
                  className="w-full bg-gray-50/50 border border-gray-150 rounded-xl py-3 pl-10 pr-4 text-xs outline-none focus:border-[#0b5924] focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Alamat Lengkap</label>
              <div className="relative">
                <span className="absolute top-3.5 left-0 pl-3.5 text-gray-400">
                  <i className="bi bi-geo-fill"></i>
                </span>
                <textarea
                  required
                  placeholder="Alamat Lengkap Rumah / Lahan Anda"
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                  rows="2"
                  className="w-full bg-gray-50/50 border border-gray-150 rounded-xl py-3 pl-10 pr-4 text-xs outline-none focus:border-[#0b5924] focus:bg-white transition-all font-medium resize-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Jenis Kelamin</label>
              <div className="flex gap-4">
                <label className={`flex-1 flex items-center justify-center gap-2 border rounded-xl py-3 px-4 text-xs font-semibold cursor-pointer transition-all ${jenisKelamin === 'Laki-Laki' ? 'border-[#0b5924] bg-emerald-50/30 text-emerald-800' : 'border-gray-150 bg-gray-50/30 text-gray-600 hover:border-emerald-600'}`}>
                  <input
                    type="radio"
                    name="jenisKelamin"
                    value="Laki-Laki"
                    checked={jenisKelamin === 'Laki-Laki'}
                    onChange={(e) => setJenisKelamin(e.target.value)}
                    className="accent-[#0b5924] w-4 h-4 cursor-pointer"
                  />
                  <span>Laki-Laki</span>
                </label>
                <label className={`flex-1 flex items-center justify-center gap-2 border rounded-xl py-3 px-4 text-xs font-semibold cursor-pointer transition-all ${jenisKelamin === 'Perempuan' ? 'border-[#0b5924] bg-emerald-50/30 text-emerald-800' : 'border-gray-150 bg-gray-50/30 text-gray-600 hover:border-emerald-600'}`}>
                  <input
                    type="radio"
                    name="jenisKelamin"
                    value="Perempuan"
                    checked={jenisKelamin === 'Perempuan'}
                    onChange={(e) => setJenisKelamin(e.target.value)}
                    className="accent-[#0b5924] w-4 h-4 cursor-pointer"
                  />
                  <span>Perempuan</span>
                </label>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                  <i className="bi bi-lock-fill"></i>
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50/50 border border-gray-150 rounded-xl py-3 pl-10 pr-10 text-xs outline-none focus:border-[#0b5924] focus:bg-white transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-emerald-700 focus:outline-none cursor-pointer"
                >
                  <i className={`bi ${showPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0b5924] hover:bg-[#073c18] text-white py-3.5 rounded-xl text-xs font-bold transition shadow-md shadow-emerald-950/15 flex justify-center items-center gap-2 mt-6 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>Daftar Akun Baru <i className="bi bi-person-plus-fill text-sm"></i></>
              )}
            </button>
          </form>


        )}

        {/* Redirect toggle links */}
        {!fromMonitoring && (
          <div className="text-center mt-6 text-xs text-gray-500 font-medium border-t border-gray-100 pt-4">
            {isLogin ? (
              <>
                Belum memiliki akun?{' '}
                <button
                  onClick={() => { setError(''); setSuccess(''); navigate('/register'); }}
                  className="text-emerald-700 hover:text-emerald-800 font-bold underline cursor-pointer"
                >
                  Daftar di sini
                </button>
              </>
            ) : (
              <>
                Sudah memiliki akun?{' '}
                <button
                  onClick={() => { setError(''); setSuccess(''); navigate('/login'); }}
                  className="text-emerald-700 hover:text-emerald-800 font-bold underline cursor-pointer"
                >
                  Masuk di sini
                </button>
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default LoginRegister;

