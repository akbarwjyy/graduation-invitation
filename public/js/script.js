document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const coverPage = document.getElementById("cover-page");
  const mainContent = document.getElementById("main-content");
  const openInvitationBtn = document.getElementById("open-invitation");
  const coverNamaTamuElement = document.getElementById("cover-nama-tamu");
  const namaTamuElement = document.getElementById("nama-tamu");
  const rsvpForm = document.getElementById("rsvp-form");
  const rsvpMessage = document.getElementById("rsvp-message");

  // Handle opening invitation
  openInvitationBtn.addEventListener("click", () => {
    // Fade out cover
    coverPage.style.transition = "opacity 1s ease-in-out";
    coverPage.style.opacity = "0";

    // Show main content with fade-in
    mainContent.style.transition = "opacity 1s ease-in-out";
    mainContent.style.opacity = "1";
    mainContent.style.pointerEvents = "auto";

    // Remove cover after animation
    setTimeout(() => {
      coverPage.style.display = "none";
    }, 1000);
  });

  // Fungsi untuk mendapatkan parameter URL
  function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  // Ambil ID dari URL
  const tamuId = getQueryParam("id");

  // --- Konfigurasi Google Spreadsheet API ---
  // Anda bisa menggunakan Sheet.best, Google Apps Script, atau service lainnya.
  // Contoh menggunakan Google Apps Script sebagai API endpoint.
  // Ganti URL_GOOGLE_APPS_SCRIPT_API_ANDA dengan URL API yang sudah Anda deploy.
  const GOOGLE_SHEET_API_URL = "URL_GOOGLE_APPS_SCRIPT_API_ANDA"; // Contoh: https://script.google.com/macros/s/AKfycbz_XXXXXXXXXXXXXXX/exec

  // Fungsi untuk mengambil nama tamu dari Google Spreadsheet
  async function getNamaTamu(id) {
    if (!id) return null;

    try {
      const response = await fetch(`${GOOGLE_SHEET_API_URL}?id=${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Asumsikan respons API adalah objek { nama: "Nama Tamu" }
      // Atau sesuaikan dengan struktur respons API Anda
      return data.nama || null;
    } catch (error) {
      console.error("Error fetching guest name:", error);
      return null;
    }
  }

  // Panggil fungsi untuk menampilkan nama tamu
  async function displayNamaTamu() {
    if (tamuId) {
      const namaTamu = await getNamaTamu(tamuId);
      const displayText = namaTamu
        ? `Kepada Yth. ${namaTamu}`
        : "Kepada Yth. Tamu Undangan";

      // Update both cover and main content
      coverNamaTamuElement.textContent = displayText;
      namaTamuElement.textContent = displayText;
    } else {
      const defaultText = "Kepada Yth. Tamu Undangan";
      coverNamaTamuElement.textContent = defaultText;
      namaTamuElement.textContent = defaultText;
    }
  }

  displayNamaTamu();

  // --- Fungsi untuk mengirim RSVP (Bonus Opsional) ---
  // Ganti URL_RSVP_ENDPOINT_ANDA dengan endpoint API untuk RSVP
  const RSVP_ENDPOINT_URL = "URL_RSVP_ENDPOINT_ANDA"; // Contoh: https://script.google.com/macros/s/AKfycbz_YYYYYYYYYYYYYYY/exec

  if (rsvpForm) {
    rsvpForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(rsvpForm);
      const data = Object.fromEntries(formData.entries());

      try {
        const response = await fetch(RSVP_ENDPOINT_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("RSVP submitted successfully:", result);
        rsvpMessage.textContent =
          "Terima kasih, konfirmasi kehadiran Anda telah terkirim!";
        rsvpMessage.classList.remove("hidden");
        rsvpMessage.classList.add("text-green-700");
        rsvpForm.reset();
      } catch (error) {
        console.error("Error submitting RSVP:", error);
        rsvpMessage.textContent =
          "Terjadi kesalahan saat mengirim konfirmasi. Silakan coba lagi.";
        rsvpMessage.classList.remove("hidden");
        rsvpMessage.classList.add("text-red-700");
      }
    });
  }
});
