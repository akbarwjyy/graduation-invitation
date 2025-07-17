// Data untuk undangan wisuda
export const data = {
  graduate: {
    id: 1,
    name: "Akbar Wijaya",
    degree: "S.Kom",
    university: "Universitas Teknologi Digital Indonesia",
    image: "./public/images/graduate.jpg",
  },

  // Logo universitas
  universityLogo: "./public/assets/img/logo-utdi.png",

  event: {
    ceremony: {
      year: "2025",
      month: "Juli",
      date: "27",
      day: "Sabtu",
      time: {
        start: "08.00",
        end: "Selesai",
      },
    },
    location: "Auditorium Utama",
    address:
      "Universitas Teknologi Digital Indonesia, Jl. Teknologi No. 10, Yogyakarta",
    type: "Upacara Wisuda & Syukuran",
  },

  links: {
    calendar:
      "https://calendar.google.com/calendar/event?action=TEMPLATE&dates=20250727T010000Z/20250727T050000Z&text=Wisuda%20Akbar%20Wijaya&location=Universitas%20Teknologi%20Digital%20Indonesia&details=Acara%20Wisuda%20Akbar%20Wijaya%2C%20S.Kom",
    map: "https://maps.app.goo.gl/RxbMyNQz5GSUc1yZ8",
  },

  gallery: [
    { id: 1, image: "./public/images/gallery/1.jpg" },
    { id: 2, image: "./public/images/gallery/2.jpg" },
    { id: 3, image: "./public/images/gallery/3.jpg" },
  ],

  // Konfigurasi untuk form RSVP
  rsvp: {
    endpoint: "https://script.google.com/macros/s/your-script-id/exec",
    options: [
      { value: "hadir", label: "Akan Hadir" },
      { value: "tidak hadir", label: "Tidak Dapat Hadir" },
    ],
  },

  // Teks untuk halaman cover dan main content
  text: {
    title: "Undangan Wisuda",
    invitation: "Dengan hormat, kami mengundang",
    guest: "Kepada Yth. Tamu Undangan",
    openButton: "Buka Undangan",
    rsvpTitle: "Konfirmasi Kehadiran",
    rsvpName: "Nama Lengkap:",
    rsvpAttendance: "Kehadiran:",
    rsvpMessage: "Ucapan/Doa:",
    rsvpSubmit: "Kirim Konfirmasi",
    rsvpPlaceholder: "Berikan ucapan selamat atau doa terbaik Anda...",
    rsvpSuccess: "Terima kasih, konfirmasi kehadiran Anda telah terkirim!",
    rsvpError: "Terjadi kesalahan saat mengirim konfirmasi. Silakan coba lagi.",
  },

  // Konfigurasi untuk icon akademik
  academicIcons: [
    {
      id: 1,
      icon: "fa-scroll",
      label: "IJAZAH",
      animation: "fade-right",
      delay: 450,
    },
    {
      id: 2,
      icon: "fa-graduation-cap",
      label: "WISUDA",
      animation: "fade-up",
      delay: 500,
    },
    {
      id: 3,
      icon: "fa-award",
      label: "PRESTASI",
      animation: "fade-left",
      delay: 550,
    },
  ],
};
