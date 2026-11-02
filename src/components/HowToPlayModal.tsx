import React from 'react';
import { X, HelpCircle, Image, Hash, Type, Sparkles, Scale, Clock, Lightbulb, ShieldCheck } from 'lucide-react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-amber-900/50 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-600/40 flex items-center justify-center text-amber-400">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-cinzel text-lg font-bold text-slate-100">
              Panduan Bermain Mystery Room
            </h3>
            <p className="text-xs text-slate-400">
              Pelajari mekanisme permainan, tipe teka-teki, dan sistem kalkulasi skor detektif.
            </p>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 pr-2 space-y-5 text-xs text-slate-300">
          {/* Section 1: Objective */}
          <div>
            <h4 className="font-semibold text-amber-400 text-sm mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Tujuan Permainan</span>
            </h4>
            <p className="leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800">
              Setiap ruangan menyimpan rahasia terkunci. Kamu harus menggunakan logika, ketelitian, dan berpikir kritis untuk mengamati barang bukti, memecahkan teka-teki, dan melarikan diri sebelum batas waktu habis. Berhasil menyelesaikan ruangan akan membuka level selanjutnya.
            </p>
          </div>

          {/* Section 2: 5 Puzzle Categories */}
          <div>
            <h4 className="font-semibold text-amber-400 text-sm mb-2">
              5 Jenis Teka-Teki Asah Otak
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-lg">
                <div className="flex items-center gap-2 font-semibold text-amber-300 mb-1">
                  <Image className="w-4 h-4 text-amber-400" />
                  <span>1. Teka-Teki Gambar &amp; Pola</span>
                </div>
                <p className="text-slate-400 leading-normal">
                  Amati detail visual di ruangan, gunakan senter sinar UV untuk menemukan tinta fosfor tak kasat mata, dan hubungkan pola rasi bintang.
                </p>
              </div>

              <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-lg">
                <div className="flex items-center gap-2 font-semibold text-amber-300 mb-1">
                  <Hash className="w-4 h-4 text-amber-400" />
                  <span>2. Teka-Teki Angka &amp; Deret</span>
                </div>
                <p className="text-slate-400 leading-normal">
                  Pecahkan logika bilangan matematika, deret Fibonacci, kombinasi dial brankas mekanis, dan perputaran roda gigi waktu.
                </p>
              </div>

              <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-lg">
                <div className="flex items-center gap-2 font-semibold text-amber-300 mb-1">
                  <Type className="w-4 h-4 text-amber-400" />
                  <span>3. Teka-Teki Kata &amp; Sandi</span>
                </div>
                <p className="text-slate-400 leading-normal">
                  Selesaikan teka-teki sajak kuno, anagram acak, silinder gembok Cryptex, dan kriptografi sandi geser Caesar.
                </p>
              </div>

              <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-lg">
                <div className="flex items-center gap-2 font-semibold text-amber-300 mb-1">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>4. Teka-Teki Simbol Kuno</span>
                </div>
                <p className="text-slate-400 leading-normal">
                  Cocokkan glif alkimia (Api, Air, Emas, Perak) dan rune kuno sesuai formula manuskrip laboratorium transmutasi.
                </p>
              </div>

              <div className="col-span-1 md:col-span-2 bg-slate-950/60 border border-slate-800 p-3 rounded-lg">
                <div className="flex items-center gap-2 font-semibold text-amber-300 mb-1">
                  <Scale className="w-4 h-4 text-amber-400" />
                  <span>5. Kasus Misteri &amp; Deduksi Kriminal</span>
                </div>
                <p className="text-slate-400 leading-normal">
                  Uji alibi 4 tersangka, bandingkan bukti forensik dan jejak waktu, temukan inkonsistensi keterangan saksi, lalu tetapkan terdakwa yang bersalah.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Scoring and Hints */}
          <div>
            <h4 className="font-semibold text-amber-400 text-sm mb-2 flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>Batas Waktu, Skor &amp; Petunjuk</span>
            </h4>
            <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-lg space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <p>
                  <strong>Skor Ruangan:</strong> Dihitung dari Skor Dasar (1.000 - 3.000 pts) ditambah bonus sisa detik waktu. Jawaban yang salah memberikan waktu penalti ringan tanpa mematikan permainan.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <p>
                  <strong>Sistem Petunjuk 3 Tingkat:</strong> Tingkat 1 (Arah Logika, -100 pts), Tingkat 2 (Elemen Kunci, -250 pts), dan Tingkat 3 (Solusi Lengkap, -500 pts).
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <p>
                  <strong>Peringkat Bintang:</strong> Menyelesaikan cepat tanpa petunjuk memberikan 3 Bintang emas penuh!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-medium rounded-lg text-xs transition-colors cursor-pointer"
          >
            Mengerti, Siap Investigasi
          </button>
        </div>
      </div>
    </div>
  );
};
