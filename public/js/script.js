// Import data from data.js
import { data } from "./data.js";

document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const coverPage = document.getElementById("cover-page");
  const mainContent = document.getElementById("main-content");
  const openInvitationBtn = document.getElementById("open-invitation");
  const coverNamaTamuElement = document.getElementById("cover-nama-tamu");
  const namaTamuElement = document.getElementById("nama-tamu");
  const rsvpForm = document.getElementById("rsvp-form");
  const rsvpMessage = document.getElementById("rsvp-message");

  // Populate content from data.js
  populateContent();

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
      // Untuk demo, kita langsung return nama dari ID
      // Dalam implementasi nyata, gunakan fetch API
      console.log(`Fetching guest name for ID: ${id}`);
      return null; // Untuk demo, kita return null
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
        : data.text.guest;

      // Update both cover and main content
      coverNamaTamuElement.textContent = displayText;
      namaTamuElement.textContent = displayText;
    } else {
      coverNamaTamuElement.textContent = data.text.guest;
      namaTamuElement.textContent = data.text.guest;
    }
  }

  // Function to populate content from data.js
  function populateContent() {
    // Populate cover page
    document.querySelectorAll(".formal-title").forEach((el) => {
      el.textContent = data.text.title;
    });

    document.querySelectorAll(".ornamental-initial").forEach((el) => {
      el.textContent = data.text.invitation;
    });

    // Populate graduate info
    const graduateNameElements = document.querySelectorAll(".graduate-name");
    graduateNameElements.forEach((el) => {
      el.textContent = `${data.graduate.name}, ${data.graduate.degree}`;
    });

    document.querySelectorAll(".graduate-major").forEach((el) => {
      el.textContent = `Program Studi: ${data.graduate.major}`;
    });

    document.querySelectorAll(".graduate-university").forEach((el) => {
      el.textContent = data.graduate.university;
    });

    // Populate event details
    document.querySelectorAll(".event-date").forEach((el) => {
      el.textContent = `${data.event.ceremony.day}, ${data.event.ceremony.date} ${data.event.ceremony.month} ${data.event.ceremony.year}`;
    });

    document.querySelectorAll(".event-time").forEach((el) => {
      el.textContent = `${data.event.ceremony.time.start} WIB`;
    });

    document.querySelectorAll(".event-location").forEach((el) => {
      el.innerHTML = `${data.event.location}<br>${data.event.address}`;
    });

    document.querySelectorAll(".event-type").forEach((el) => {
      el.textContent = data.event.type;
    });

    // Populate RSVP form
    document.querySelectorAll(".rsvp-title").forEach((el) => {
      el.textContent = data.text.rsvpTitle;
    });

    // Populate button text
    document.querySelector("#open-invitation span").textContent =
      data.text.openButton;

    // Populate academic icons
    const iconsContainer = document.querySelector(".academic-icons");
    if (iconsContainer) {
      iconsContainer.innerHTML = "";
      data.academicIcons.forEach((icon) => {
        const iconDiv = document.createElement("div");
        iconDiv.className = `text-center ${
          icon.id === 1 ? "scroll-icon" : icon.id === 3 ? "laurel-icon" : ""
        }`;
        iconDiv.setAttribute("data-aos", icon.animation);
        iconDiv.setAttribute("data-aos-delay", icon.delay);

        iconDiv.innerHTML = `
          <i class="fas ${icon.icon} text-3xl text-gold"></i>
          <p class="text-xs text-cream mt-1">${icon.label}</p>
        `;

        iconsContainer.appendChild(iconDiv);
      });
    }
  }

  // Call displayNamaTamu after populating content
  displayNamaTamu();

  // Handle RSVP form
  if (rsvpForm) {
    // Populate select options
    const kehadiranSelect = document.getElementById("kehadiran");
    if (kehadiranSelect) {
      // Clear existing options except the first one
      while (kehadiranSelect.options.length > 1) {
        kehadiranSelect.remove(1);
      }

      // Add options from data
      data.rsvp.options.forEach((option) => {
        const optionEl = document.createElement("option");
        optionEl.value = option.value;
        optionEl.textContent = option.label;
        kehadiranSelect.appendChild(optionEl);
      });
    }

    // Update form labels and placeholders
    document.querySelector('label[for="nama_rsvp"]').textContent =
      data.text.rsvpName;
    document.querySelector('label[for="kehadiran"]').textContent =
      data.text.rsvpAttendance;
    document.querySelector('label[for="ucapan"]').textContent =
      data.text.rsvpMessage;
    document.querySelector("#ucapan").placeholder = data.text.rsvpPlaceholder;
    document.querySelector('button[type="submit"]').textContent =
      data.text.rsvpSubmit;

    rsvpForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(rsvpForm);
      const formDataObj = Object.fromEntries(formData.entries());

      try {
        // Demo: Tampilkan data di console dan berikan respons sukses
        console.log("Form data submitted:", formDataObj);

        // In a real implementation, you would send data to the endpoint
        // const response = await fetch(data.rsvp.endpoint, {
        //   method: 'POST',
        //   body: JSON.stringify(formDataObj),
        //   headers: {
        //     'Content-Type': 'application/json'
        //   }
        // });

        // Simulasi sukses
        rsvpMessage.textContent = data.text.rsvpSuccess;
        rsvpMessage.classList.remove("hidden");
        rsvpMessage.classList.add("text-green-700");
        rsvpForm.reset();
      } catch (error) {
        console.error("Error submitting form:", error);
        rsvpMessage.textContent = data.text.rsvpError;
        rsvpMessage.classList.remove("hidden");
        rsvpMessage.classList.add("text-red-700");
      }
    });
  }
});
