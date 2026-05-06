(function () {
  const photos = Array.isArray(window.GALLERY_PHOTOS) ? window.GALLERY_PHOTOS : [];
  const grid = document.querySelector("#gallery-grid");
  const emptyState = document.querySelector("#empty-state");
  const filters = document.querySelector("#filters");
  const count = document.querySelector("#gallery-count");
  const lightbox = document.querySelector("#lightbox");
  const lightboxImage = document.querySelector("#lightbox-image");
  const lightboxTitle = document.querySelector("#lightbox-title");
  const lightboxMeta = document.querySelector("#lightbox-meta");
  const closeButton = document.querySelector("#lightbox-close");
  const prevButton = document.querySelector("#lightbox-prev");
  const nextButton = document.querySelector("#lightbox-next");

  let activeTag = "all";
  let visiblePhotos = [];
  let activeIndex = 0;

  const tags = [...new Set(photos.flatMap((photo) => photo.tags || []))].sort((a, b) => a.localeCompare(b, "ru"));

  function meta(photo) {
    return [photo.location, photo.date].filter(Boolean).join(" · ");
  }

  function renderFilters() {
    filters.innerHTML = "";
    const filterItems = [{ label: "Все", value: "all" }, ...tags.map((tag) => ({ label: tag, value: tag }))];

    filterItems.forEach((item) => {
      const button = document.createElement("button");
      button.className = "filter-button";
      button.type = "button";
      button.textContent = item.label;
      button.dataset.tag = item.value;
      button.setAttribute("aria-pressed", item.value === activeTag ? "true" : "false");
      button.classList.toggle("is-active", item.value === activeTag);
      button.addEventListener("click", () => {
        activeTag = item.value;
        render();
      });
      filters.appendChild(button);
    });
  }

  function renderCards() {
    grid.innerHTML = "";
    visiblePhotos = activeTag === "all" ? photos : photos.filter((photo) => (photo.tags || []).includes(activeTag));

    visiblePhotos.forEach((photo, index) => {
      const button = document.createElement("button");
      button.className = "photo-card";
      button.type = "button";
      button.addEventListener("click", () => openLightbox(index));

      const image = document.createElement("img");
      image.src = photo.src;
      image.alt = photo.alt || photo.title || "Фотография из галереи";
      image.loading = "lazy";

      const caption = document.createElement("span");
      caption.className = "photo-caption";

      const title = document.createElement("strong");
      title.textContent = photo.title || "Без названия";

      const details = document.createElement("span");
      details.textContent = meta(photo);

      caption.append(title, details);
      button.append(image, caption);
      grid.appendChild(button);
    });

    const total = visiblePhotos.length;
    emptyState.classList.toggle("is-hidden", total > 0);
    count.textContent = total === 0
      ? "Фотографии скоро появятся."
      : `${total} ${plural(total, "фотография", "фотографии", "фотографий")}`;
  }

  function plural(number, one, few, many) {
    const mod10 = number % 10;
    const mod100 = number % 100;
    if (mod10 === 1 && mod100 !== 11) return one;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
    return many;
  }

  function openLightbox(index) {
    activeIndex = index;
    updateLightbox();
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    closeButton.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function moveLightbox(direction) {
    if (!visiblePhotos.length) return;
    activeIndex = (activeIndex + direction + visiblePhotos.length) % visiblePhotos.length;
    updateLightbox();
  }

  function updateLightbox() {
    const photo = visiblePhotos[activeIndex];
    if (!photo) return;
    lightboxImage.src = photo.src;
    lightboxImage.alt = photo.alt || photo.title || "Фотография из галереи";
    lightboxTitle.textContent = photo.title || "Без названия";
    lightboxMeta.textContent = meta(photo);
  }

  function render() {
    renderFilters();
    renderCards();
  }

  closeButton.addEventListener("click", closeLightbox);
  prevButton.addEventListener("click", () => moveLightbox(-1));
  nextButton.addEventListener("click", () => moveLightbox(1));
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  window.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("is-open")) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") moveLightbox(-1);
    if (event.key === "ArrowRight") moveLightbox(1);
  });

  render();
})();
