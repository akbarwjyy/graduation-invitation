// Import data dari data.js
import { data } from "./data.js";

// Function untuk mengekstrak tanggal dari URL Google Calendar
function extractDateFromCalendarURL(url) {
  try {
    // Coba ekstrak tanggal dari URL
    // Jika URL tidak valid atau tidak mengandung tanggal, gunakan data dari data.js
    const params = new URLSearchParams(url.split("?")[1]);
    const dates = params.get("dates");

    if (dates && dates.length > 15) {
      // Format Google Calendar: YYYYMMDDTHHMMSSZ/YYYYMMDDTHHMMSSZ
      const startDate = dates.substring(0, 15);
      const year = startDate.substring(0, 4);
      const month = startDate.substring(4, 6);
      const day = startDate.substring(6, 8);
      const hour = startDate.substring(9, 11);
      const minute = startDate.substring(11, 13);

      return new Date(`${year}-${month}-${day}T${hour}:${minute}:00+07:00`);
    }
  } catch (error) {
    console.log("Error extracting date from calendar URL:", error);
  }

  // Fallback ke data dari data.js
  return getEventDateFromData();
}

// Function untuk mendapatkan tanggal acara dari data.js
function getEventDateFromData() {
  const monthNumber = getMonthNumber(data.event.ceremony.month);
  return new Date(
    `${data.event.ceremony.year}-${monthNumber}-${
      data.event.ceremony.date
    }T${data.event.ceremony.time.start.replace(".", ":")}:00+07:00`
  );
}

// Helper untuk mendapatkan nomor bulan dari nama bulan
function getMonthNumber(monthName) {
  const months = {
    Januari: "01",
    Februari: "02",
    Maret: "03",
    April: "04",
    Mei: "05",
    Juni: "06",
    Juli: "07",
    Agustus: "08",
    September: "09",
    Oktober: "10",
    November: "11",
    Desember: "12",
  };
  return months[monthName] || "01";
}

// Function untuk menghitung countdown
function updateCountdown() {
  const countdownElement = document.getElementById("countdown");
  if (!countdownElement) return;

  // Coba ekstrak tanggal dari URL kalender, jika gagal gunakan data dari data.js
  const eventDate = extractDateFromCalendarURL(data.links.calendar);
  const now = new Date();
  const diff = eventDate - now;

  if (diff <= 0) {
    countdownElement.innerHTML =
      '<div class="countdown-ended">Acara telah dimulai!</div>';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  countdownElement.innerHTML = `
    <div class="countdown-container">
      <div class="countdown-item">
        <span class="countdown-number">${days}</span>
        <span class="countdown-label">Hari</span>
      </div>
      <div class="countdown-item">
        <span class="countdown-number">${hours}</span>
        <span class="countdown-label">Jam</span>
      </div>
      <div class="countdown-item">
        <span class="countdown-number">${minutes}</span>
        <span class="countdown-label">Menit</span>
      </div>
      <div class="countdown-item">
        <span class="countdown-number">${seconds}</span>
        <span class="countdown-label">Detik</span>
      </div>
    </div>
  `;
}

// Function untuk menginisialisasi tampilan waktu
function initTimeSection() {
  // Tambahkan section waktu jika belum ada
  let timeSection = document.querySelector(".time");
  if (!timeSection) {
    timeSection = document.createElement("section");
    timeSection.className = "time";
    timeSection.innerHTML = `
      <div class="time-container">
        <div class="time-box"></div>
      </div>
      <div class="type-container">
        <div class="type-box"></div>
      </div>
      <div id="countdown" class="countdown"></div>
      <div class="location-container">
        <p class="address"></p>
        <div class="links-container">
          <a class="map-link" target="_blank"><i class="fas fa-map-marker-alt"></i> Lihat Lokasi</a>
          <a class="calendar-link" target="_blank"><i class="fas fa-calendar-alt"></i> Tambahkan ke Kalender</a>
        </div>
      </div>
    `;

    // Tambahkan ke main content setelah section wisudawan
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      const wisudawanSection = mainContent.querySelector("section");
      if (wisudawanSection) {
        wisudawanSection.after(timeSection);
      } else {
        const mainContentContainer = mainContent.querySelector("div");
        if (mainContentContainer) {
          mainContentContainer.appendChild(timeSection);
        }
      }
    }
  }

  // Mengisi informasi waktu acara
  const timeBox = timeSection.querySelector(".time-box");
  if (timeBox) {
    const dateStr = `${data.event.ceremony.day}, ${data.event.ceremony.date} ${data.event.ceremony.month} ${data.event.ceremony.year}`;
    const timeStr = `${data.event.ceremony.time.start} - ${data.event.ceremony.time.end} WIB`;

    timeBox.innerHTML = `
      <h3>Waktu Acara</h3>
      <p class="date">${dateStr}</p>
      <p class="time">${timeStr}</p>
    `;
  }

  // Mengisi jenis acara
  const typeBox = timeSection.querySelector(".type-box");
  if (typeBox) {
    typeBox.innerHTML = `
      <h3>Jenis Acara</h3>
      <p>${data.event.type}</p>
    `;
  }

  // Mengisi alamat
  const addressElement = timeSection.querySelector(".address");
  if (addressElement) {
    addressElement.innerHTML = `
      <strong>${data.event.location}</strong><br>
      ${data.event.address}
    `;
  }

  // Mengisi link peta
  const mapLink = timeSection.querySelector(".map-link");
  if (mapLink) {
    mapLink.href = data.links.map;
  }

  // Mengisi link kalender
  const calendarLink = timeSection.querySelector(".calendar-link");
  if (calendarLink) {
    calendarLink.href = data.links.calendar;
  }

  // Inisialisasi countdown
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// Jalankan inisialisasi saat DOM sudah siap
document.addEventListener("DOMContentLoaded", initTimeSection);

export { initTimeSection, updateCountdown };
