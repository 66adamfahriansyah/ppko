import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { login, register } from '../services/authService';

function LoginRegister() {
  const { loginUser } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [identity, setIdentity] = useState(''); // email or username for login
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const data = await register(username, email, password);

      setSuccess('Registrasi berhasil! Silakan login.');
      setIsLogin(true);
      // Reset fields
      setUsername('');
      setEmail('');
      setPassword('');
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
      loginUser(data.user);
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
          <div className="w-14 h-14 bg-[#0b5924] rounded-2xl flex items-center justify-center mx-auto shadow-md shadow-emerald-950/20 mb-3 text-white text-2xl">
            <i className="bi bi-tree-fill"></i>
          </div>
          <h2 className="text-2xl font-black text-emerald-900 tracking-tight">E-BIO PENS</h2>
          <p className="text-xs text-gray-500 font-medium mt-1">Sistem Monitoring & Kontrol Sawah Demplot</p>
        </div>

        {/* Form Selection Tabs */}
        <div className="flex bg-gray-50 p-1 rounded-2xl border border-gray-100 mb-6 text-xs font-bold">
          <button 
            onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }}
            className={`flex-1 py-3 rounded-xl transition-all ${isLogin ? 'bg-[#0b5924] text-white shadow-sm' : 'text-gray-500 hover:text-[#0b5924]'}`}
          >
            Masuk
          </button>
          <button 
            onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }}
            className={`flex-1 py-3 rounded-xl transition-all ${!isLogin ? 'bg-[#0b5924] text-white shadow-sm' : 'text-gray-500 hover:text-[#0b5924]'}`}
          >
            Daftar
          </button>
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
                  placeholder="admin@ebio.com"
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
                  type="password" 
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50/50 border border-gray-150 rounded-xl py-3 pl-10 pr-4 text-xs outline-none focus:border-[#0b5924] focus:bg-white transition-all font-medium"
                />
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
                  <i className="bi bi-person-fill"></i>
                </span>
                <input 
                  type="text" 
                  required
                  placeholder="username_baru"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-gray-50/50 border border-gray-150 rounded-xl py-3 pl-10 pr-4 text-xs outline-none focus:border-[#0b5924] focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Email</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                  <i className="bi bi-envelope-fill"></i>
                </span>
                <input 
                  type="email" 
                  required
                  placeholder="user@ebio.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  type="password" 
                  required
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50/50 border border-gray-150 rounded-xl py-3 pl-10 pr-4 text-xs outline-none focus:border-[#0b5924] focus:bg-white transition-all font-medium"
                />
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
      </div>
    </div>
  );
}

export default LoginRegister;
