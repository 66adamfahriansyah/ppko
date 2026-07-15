function Education() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center space-y-4">
      <div className="w-16 h-16 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto text-2xl">
        <i className="bi bi-journal-bookmark"></i>
      </div>
      <h2 className="text-xl font-bold text-gray-800">Materi Edukasi Pertanian</h2>
      <p className="text-sm text-gray-500 max-w-md mx-auto">
        Kumpulan dokumentasi, panduan perawatan light trap, dan edukasi pertanian organik berbasis IoT PPK Ormawa E-BIO PENS.
      </p>
    </div>
  );
}

export default Education;
