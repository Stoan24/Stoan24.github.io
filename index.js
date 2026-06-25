/* -----------------------------------------
  Have focus outline only for keyboard users 
 ---------------------------------------- */

const handleFirstTab = (e) => {
  if(e.key === 'Tab') {
    document.body.classList.add('user-is-tabbing')

    window.removeEventListener('keydown', handleFirstTab)
    window.addEventListener('mousedown', handleMouseDownOnce)
  }
}

const handleMouseDownOnce = () => {
  document.body.classList.remove('user-is-tabbing')

  window.removeEventListener('mousedown', handleMouseDownOnce)
  window.addEventListener('keydown', handleFirstTab)
}

window.addEventListener('keydown', handleFirstTab)

/* -----------------------------------------
  Back To Top Button Visibility Control
 ---------------------------------------- */
const backToTopButton = document.querySelector(".back-to-top");
let isBackToTopRendered = false;

let alterStyles = (isBackToTopRendered) => {
  if (!backToTopButton) return;
  backToTopButton.style.visibility = isBackToTopRendered ? "visible" : "hidden";
  backToTopButton.style.opacity = isBackToTopRendered ? 1 : 0;
  backToTopButton.style.transform = isBackToTopRendered ? "scale(1)" : "scale(0)";
};

window.addEventListener("scroll", () => {
  if (window.scrollY > 700) {
    if (!isBackToTopRendered) {
      isBackToTopRendered = true;
      alterStyles(isBackToTopRendered);
    }
  } else {
    if (isBackToTopRendered) {
      isBackToTopRendered = false;
      alterStyles(isBackToTopRendered);
    }
  }
});

/* -----------------------------------------
  Header Video Trailer Cycler
 ---------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  const tracks = document.querySelectorAll(".header-track");
  if (tracks.length === 0) return;

  let currentTrackIndex = 0;
  const transitionInterval = 6000;

  setInterval(() => {
    const activeTrack = tracks[currentTrackIndex];
    if (activeTrack) activeTrack.classList.remove("active");

    currentTrackIndex = (currentTrackIndex + 1) % tracks.length;

    const nextTrack = tracks[currentTrackIndex];
    if (nextTrack) nextTrack.classList.add("active");
  }, transitionInterval);
});

/* -----------------------------------------
  JSON Loading
 ---------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  const groupContainer = document.getElementById("group-projects-container");
  const soloContainer = document.getElementById("solo-projects-container");

  if (!groupContainer || !soloContainer) return;

  fetch("./projects.json")
    .then(response => response.json())
    .then(projects => {
      projects.forEach(project => {
        let cardMediaHtml = "";
        if (project.mediaType === "video") {
          cardMediaHtml = `<video alt="${project.title}" width="750" height="500" autoplay muted loop playsinline><source src="${project.mediaSrc}" type="video/mp4">Browser does not support video</video>`;
        } else {
          cardMediaHtml = `<img src="${project.mediaSrc}" class="work__image" alt="${project.title}" />`;
        }

        const logosHtml = project.logos.map(logo => 
          `<img src="${logo.src}" class="work__software-logo" alt="${logo.alt}" title="${logo.title}" />`
        ).join("");

        const linksHtml = project.links.map(link => {
          if (link.isIcon) {
            return `<a href="${link.url}" target="_blank"><img src="${link.src}" class="work__code" title="${link.title}" alt="${link.alt}"></a>`;
          } else {
            return `<a href="${link.url}" target="_blank" class="link__text">${link.text} <span>&rarr;</span></a>`;
          }
      }).join("");

        const projectBox = document.createElement("div");
        projectBox.className = "work__box";
        projectBox.style.cursor = "pointer";
        
        projectBox.setAttribute("data-title", project.title);
        projectBox.setAttribute("data-description", project.description);
        projectBox.setAttribute("data-media-type", project.mediaType);
        projectBox.setAttribute("data-media-src", project.mediaSrc);
        
        if (project.links.length > 0) {
          projectBox.setAttribute("data-link-url", project.links[0].url);
          projectBox.setAttribute("data-link-text", project.links[0].text || "View Project");
        }

        const partialDescription = project.description.length > 140 
          ? project.description.slice(0, 137) + "..." 
          : project.description;

        projectBox.innerHTML = `
          <div class="work__image-box">${cardMediaHtml}</div>
          <div class="work__text">
            <h3>${project.title}</h3>
            <p>${partialDescription}</p> 
            <div class="work__software-logos">${logosHtml}</div>
            <div class="work__links">${linksHtml}</div>
          </div>
        `;

        if (project.type === "group") {
          groupContainer.appendChild(projectBox);
        } else {
          soloContainer.appendChild(projectBox);
        }
      });

      initializeModalSystem();
    })
    .catch(error => console.error("Error building dashboard configurations:", error));
});

/* Helper managing structural data injection inside modal panels */
function initializeModalSystem() {
  const modal = document.getElementById("project-modal");
  const modalBody = modal.querySelector(".modal__body");
  const modalClose = modal.querySelector(".modal__close");
  const projectBoxes = document.querySelectorAll(".work__box");

  if (!modal || !modalBody || !modalClose) return;

  projectBoxes.forEach((box) => {
    box.addEventListener("click", () => {
      const title = box.getAttribute("data-title");
      const description = box.getAttribute("data-description");
      const mediaType = box.getAttribute("data-media-type");
      const mediaSrc = box.getAttribute("data-media-src");
      const linkUrl = box.getAttribute("data-link-url");
      const linkText = box.getAttribute("data-link-text");

      if (!title || !description) return;

      let mediaHtml = "";
      if (mediaType === "video" && mediaSrc) {
        mediaHtml = `<video class="modal__media" autoplay muted loop playsinline controls><source src="${mediaSrc}" type="video/mp4"></video>`;
      } else if (mediaType === "image" && mediaSrc) {
        mediaHtml = `<img class="modal__media" src="${mediaSrc}" alt="${title}" />`;
      }

      let linkHtml = "";
      if (linkUrl) {
        linkHtml = `<a href="${linkUrl}" target="_blank" class="btn btn--pink">${linkText} &rarr;</a>`;
      }

      modalBody.innerHTML = `
        ${mediaHtml}
        <h2>${title}</h2>
        <p>${description}</p>
        ${linkHtml}
      `;

      modal.classList.add("modal--open");
      document.body.style.overflow = "hidden";
    });
  });

  const closeModal = () => {
    modal.classList.remove("modal--open");
    document.body.style.overflow = "initial";
    const video = modalBody.querySelector("video");
    if (video) video.pause();
  };

  modalClose.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
  window.addEventListener("keydown", (e) => { if (e.key === "Escape" && modal.classList.contains("modal--open")) closeModal(); });
}