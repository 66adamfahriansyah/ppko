import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUnverifiedUsers, verifyUser } from '../services/authService';

function Settings() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [unverifiedUsers, setUnverifiedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchUnverified = async () => {
    if (!isAdmin) return;
    try {
      setLoading(true);
      const data = await getUnverifiedUsers();
      setUnverifiedUsers(data);
    } catch (err) {
      setError(err.message || 'Gagal memuat daftar verifikasi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnverified();
  }, [isAdmin]);

  const handleVerify = async (userId) => {
    setError('');
    setSuccess('');
    try {
      await verifyUser(userId);
      setSuccess('Akun berhasil diverifikasi!');
      // Remove verified user from state list
      setUnverifiedUsers(prev => prev.filter(u => u.id !== userId));
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Gagal memverifikasi akun');
    }
  };

  return (
    <div className="space-y-6">
      {/* Settings Info Banner */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-150 text-center space-y-4">
        <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto text-xl">
          <i className="bi bi-gear-wide-connected"></i>
        </div>
        <h2 className="text-base font-extrabold text-gray-800">Pengaturan Sistem E-BIO</h2>
        <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
          Konfigurasi integrasi API IoT Firebase, sinkronisasi ambang batas sensor pompa, kalibrasi sensor NPK, serta verifikasi keanggotaan toko petani bawang desa Sajen.
        </p>
      </div>

      {/* Admin User Verification Panel */}
      {isAdmin && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-150 space-y-4">
          <div className="flex items-center gap-2 text-emerald-950 font-bold border-b border-gray-100 pb-4">
            <i className="bi bi-shield-check text-emerald-700 text-lg"></i>
            <div>
              <h3 className="text-sm font-extrabold">Verifikasi Akun Toko Anggota Poktan</h3>
              <p className="text-[10px] text-gray-500 font-normal mt-0.5">Daftar petani yang baru mendaftar dan membutuhkan persetujuan agar produk mereka dapat tayang.</p>
            </div>
          </div>

          {/* Messages */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center gap-2">
              <i className="bi bi-exclamation-triangle-fill"></i> {error}
            </div>
          )}
          {success && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
              <i className="bi bi-check-circle-fill"></i> {success}
            </div>
          )}

          {loading ? (
            <div className="py-8 flex justify-center">
              <div className="w-6 h-6 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : unverifiedUsers.length === 0 ? (
            <div className="py-8 text-center space-y-2">
              <div className="text-2xl text-gray-300"><i className="bi bi-emoji-smile"></i></div>
              <p className="text-xs text-gray-400 font-medium">Semua toko anggota telah diverifikasi. Tidak ada antrean baru.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-medium text-gray-600">
                <thead>
                  <tr className="bg-gray-50 text-gray-400 font-extrabold text-[10px] uppercase tracking-wider border-b border-gray-100">
                    <th className="py-3 px-4">Nama Lengkap</th>
                    <th className="py-3 px-4">Username</th>
                    <th className="py-3 px-4">Nomor WhatsApp</th>
                    <th className="py-3 px-4">Kelompok Tani (Poktan)</th>
                    <th className="py-3 px-4">Alamat</th>
                    <th className="py-3 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {unverifiedUsers.map((userItem) => (
                    <tr key={userItem.id} className="hover:bg-gray-50/50 transition">
                      <td className="py-4 px-4 font-bold text-gray-800">{userItem.nama_lengkap}</td>
                      <td className="py-4 px-4 font-semibold text-gray-500">@{userItem.username}</td>
                      <td className="py-4 px-4 font-bold text-emerald-800">
                        <a href={`https://wa.me/${userItem.no_telp}`} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                          <i className="bi bi-whatsapp"></i> {userItem.no_telp}
                        </a>
                      </td>
                      <td className="py-4 px-4 font-medium">{userItem.asal_poktan}</td>
                      <td className="py-4 px-4 text-gray-500 max-w-xs truncate" title={userItem.alamat}>{userItem.alamat}</td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => handleVerify(userItem.id)}
                          className="bg-[#0b5924] hover:bg-[#073c18] text-white py-1.5 px-3 rounded-lg text-[10px] font-bold transition shadow-sm cursor-pointer"
                        >
                          Verifikasi Akun
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Settings;
