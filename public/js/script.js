document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const coverPage = document.getElementById("cover-page");
  const mainContent = document.getElementById("main-content");
  const openInvitationBtn = document.getElementById("open-invitation");
  const coverNamaTamuElement = document.getElementById("cover-nama-tamu");
  const namaTamuElement = document.getElementById("nama-tamu");
  const rsvpForm = document.getElementById("rsvp-form");
  const rsvpMessage = document.getElementById("rsvp-message");

  let isOpening = false;

  // Function to open invitation
  const openInvitation = () => {
    if (isOpening) return;
    isOpening = true;

    // Fade out cover
    coverPage.style.transition =
      "opacity 1s ease-in-out, transform 1s ease-out";
    coverPage.style.opacity = "0";
    coverPage.style.transform = "translateY(-100%)";

    // Prepare main content for fade-up animation
    mainContent.style.transform = "translateY(20px)";
    mainContent.style.transition =
      "opacity 1s ease-in-out, transform 1s ease-out";
    mainContent.style.opacity = "1";
    mainContent.style.pointerEvents = "auto";

    // Add fade-up effect
    setTimeout(() => {
      mainContent.style.transform = "translateY(0)";
    }, 100);

    // Remove cover after animation
    setTimeout(() => {
      coverPage.style.display = "none";
    }, 1000);
  };

  // Handle button click
  openInvitationBtn.addEventListener("click", openInvitation);

  // Handle mouse wheel on cover
  coverPage.addEventListener(
    "wheel",
    (event) => {
      if (event.deltaY > 0) {
        // Scrolling down
        openInvitation();
      }
    },
    { passive: true }
  );

  // Handle touch events for mobile
  let touchStartY = 0;

  coverPage.addEventListener(
    "touchstart",
    (event) => {
      touchStartY = event.touches[0].clientY;
    },
    { passive: true }
  );

  coverPage.addEventListener(
    "touchmove",
    (event) => {
      const touchEndY = event.touches[0].clientY;
      const deltaY = touchStartY - touchEndY;

      if (deltaY > 50) {
        // threshold of 50px for swipe up
        openInvitation();
      }
    },
    { passive: true }
  );

  // Fungsi untuk mendapatkan parameter URL
  function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  // Ambil ID dari URL
  const tamuId = getQueryParam("id");

  // Fungsi untuk mengambil nama tamu dari Google Spreadsheet
  async function getNamaTamu(id) {
    if (!id) return null;

    try {
      const response = await fetch(`${GOOGLE_SHEET_API_URL}?id=${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
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

  // Handle RSVP form
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
