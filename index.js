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

const backToTopButton = document.querySelector(".back-to-top");
let isBackToTopRendered = false;

let alterStyles = (isBackToTopRendered) => {
  backToTopButton.style.visibility = isBackToTopRendered ? "visible" : "hidden";
  backToTopButton.style.opacity = isBackToTopRendered ? 1 : 0;
  backToTopButton.style.transform = isBackToTopRendered
    ? "scale(1)"
    : "scale(0)";
};

window.addEventListener("scroll", () => {
  if (window.scrollY > 700) {
    isBackToTopRendered = true;
    alterStyles(isBackToTopRendered);
  } else {
    isBackToTopRendered = false;
    alterStyles(isBackToTopRendered);
  }
});

/* -----------------------------------------
  Project Modal Interaction System 
 ---------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("project-modal");
  const modalBody = modal.querySelector(".modal__body");
  const modalClose = modal.querySelector(".modal__close");
  const projectBoxes = document.querySelectorAll(".work__box");

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
      if (linkUrl && linkText) {
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
  
  
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });


  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("modal--open")) {
      closeModal();
    }
  });
});