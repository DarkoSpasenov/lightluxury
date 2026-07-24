/* ============================================================
   LIGHT LUXURY — SLIDER.JS
   Composant carrousel léger, réutilisable, sans dépendance.
   ------------------------------------------------------------
   Structure HTML attendue :
   <div class="slider">
     <div class="slider-viewport">
       <div class="slider-track">
         <div class="slider-slide">...</div>
         <div class="slider-slide">...</div>
       </div>
     </div>
   </div>
   Les flèches et les points de navigation sont générés
   automatiquement par ce script.
   ============================================================ */

const SliderModule = (() => {
  const AUTOPLAY_MS = 4000;
  const RESUME_DELAY_MS = 3000;
  const DRAG_THRESHOLD = 40; // px

  const instances = [];

  function getVisibleCount() {
    const w = window.innerWidth;
    if (w <= 576) return 1;
    if (w <= 992) return 2;
    return 3;
  }

  function mount(rootEl) {
    if (!rootEl) return null;

    if (rootEl._sliderInstance) {
      rootEl._sliderInstance.destroy();
    }

    const viewport = rootEl.querySelector(".slider-viewport");
    const track = rootEl.querySelector(".slider-track");
    if (!viewport || !track) return null;

    // Nettoyage d'un éventuel montage précédent (flèches/points)
    rootEl.querySelectorAll(":scope > .slider-arrow, :scope > .slider-dots").forEach((el) => el.remove());

    const originalSlides = Array.from(track.children).filter((el) => !el.hasAttribute("data-clone"));
    const totalSlides = originalSlides.length;
    if (totalSlides === 0) return null;

    let visibleCount = getVisibleCount();

    // Cas simple : pas assez de photos pour justifier un carrousel
    if (totalSlides <= visibleCount) {
      track.innerHTML = "";
      originalSlides.forEach((s) => {
        s.style.flex = `0 0 ${100 / totalSlides}%`;
        s.style.maxWidth = `${100 / totalSlides}%`;
        track.appendChild(s);
      });
      track.style.transform = "translateX(0)";
      const instance = {
        destroy() {
          track.style.transform = "";
        },
        refreshSize() {}
      };
      rootEl._sliderInstance = instance;
      return instance;
    }

    // Clonage pour boucle infinie
    const headClones = originalSlides.slice(-visibleCount).map((s) => {
      const c = s.cloneNode(true);
      c.setAttribute("data-clone", "true");
      c.setAttribute("aria-hidden", "true");
      c.removeAttribute("id");
      c.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
      return c;
    });
    const tailClones = originalSlides.slice(0, visibleCount).map((s) => {
      const c = s.cloneNode(true);
      c.setAttribute("data-clone", "true");
      c.setAttribute("aria-hidden", "true");
      c.removeAttribute("id");
      c.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
      return c;
    });

    track.innerHTML = "";
    [...headClones, ...originalSlides, ...tailClones].forEach((s) => track.appendChild(s));
    let allSlides = Array.from(track.children);

    let currentIndex = visibleCount; // première vraie slide
    let autoplayTimer = null;
    let resumeTimer = null;
    let isDragging = false;
    let dragStartX = null;
    let dragStartY = 0;
    let dragDelta = 0;
    let dragPointerId = null;
    let baseTranslatePercent = 0;

    function applySizes() {
      visibleCount = getVisibleCount();
      allSlides.forEach((s) => {
        s.style.flex = `0 0 ${100 / visibleCount}%`;
        s.style.maxWidth = `${100 / visibleCount}%`;
      });
      goTo(currentIndex, false);
    }

    function slideWidthPercent() {
      return 100 / visibleCount;
    }

    function goTo(index, animate = true) {
      track.style.transition = animate ? "transform 520ms cubic-bezier(.16,1,.3,1)" : "none";
      const translate = -(index * slideWidthPercent());
      baseTranslatePercent = translate;
      track.style.transform = `translateX(${translate}%)`;
      currentIndex = index;
      updateDots();
    }

    function next() {
      goTo(currentIndex + 1);
    }
    function prev() {
      goTo(currentIndex - 1);
    }

    function handleTransitionEnd() {
      if (currentIndex >= visibleCount + totalSlides) {
        currentIndex -= totalSlides;
        goTo(currentIndex, false);
      } else if (currentIndex < visibleCount) {
        currentIndex += totalSlides;
        goTo(currentIndex, false);
      }
    }
    track.addEventListener("transitionend", handleTransitionEnd);

    /* ---------- Points de navigation ---------- */
    const dotsEl = document.createElement("div");
    dotsEl.className = "slider-dots";
    dotsEl.setAttribute("role", "tablist");
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", `Aller à la photo ${i + 1}`);
      dot.addEventListener("click", () => {
        goTo(visibleCount + i);
        restartAutoplay();
      });
      dotsEl.appendChild(dot);
    }
    rootEl.appendChild(dotsEl);

    function updateDots() {
      const realIndex = ((currentIndex - visibleCount) % totalSlides + totalSlides) % totalSlides;
      Array.from(dotsEl.children).forEach((d, i) => d.classList.toggle("is-active", i === realIndex));
    }

    /* ---------- Flèches ---------- */
    const prevBtn = document.createElement("button");
    prevBtn.type = "button";
    prevBtn.className = "slider-arrow slider-prev";
    prevBtn.setAttribute("aria-label", "Photo précédente");
    prevBtn.innerHTML = "‹";
    prevBtn.addEventListener("click", () => { prev(); restartAutoplay(); });

    const nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.className = "slider-arrow slider-next";
    nextBtn.setAttribute("aria-label", "Photo suivante");
    nextBtn.innerHTML = "›";
    nextBtn.addEventListener("click", () => { next(); restartAutoplay(); });

    rootEl.appendChild(prevBtn);
    rootEl.appendChild(nextBtn);

    /* ---------- Autoplay ---------- */
    function startAutoplay() {
      stopAutoplay();
      autoplayTimer = setInterval(() => {
        if (!isDragging) next();
      }, AUTOPLAY_MS);
    }
    function stopAutoplay() {
      if (autoplayTimer) clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
    function restartAutoplay() {
      clearTimeout(resumeTimer);
      stopAutoplay();
      resumeTimer = setTimeout(startAutoplay, RESUME_DELAY_MS);
    }

    rootEl.addEventListener("mouseenter", stopAutoplay);
    rootEl.addEventListener("mouseleave", startAutoplay);

    /* ---------- Glissement souris / tactile (Pointer Events) ---------- */
    /* Distingue une intention de glissement d'un simple clic : tant que le
       déplacement ne dépasse pas un petit seuil, on ne capture rien et on
       laisse le clic natif atteindre normalement les liens/boutons des slides. */
    const DRAG_INTENT_PX = 8;
    let dragIntentDetected = false;

    function onPointerDown(e) {
      isDragging = false;
      dragIntentDetected = false;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      dragDelta = 0;
      dragPointerId = e.pointerId;
    }
    function onPointerMove(e) {
      if (dragStartX === null) return;
      const totalDeltaX = e.clientX - dragStartX;
      const totalDeltaY = e.clientY - dragStartY;

      if (!dragIntentDetected) {
        if (Math.abs(totalDeltaX) < DRAG_INTENT_PX && Math.abs(totalDeltaY) < DRAG_INTENT_PX) {
          return; // pas encore assez de mouvement pour trancher
        }
        if (Math.abs(totalDeltaY) > Math.abs(totalDeltaX)) {
          // Mouvement plutôt vertical (scroll de page) : on n'intercepte pas.
          dragStartX = null;
          return;
        }
        // Intention de glissement horizontal confirmée : on prend la main.
        dragIntentDetected = true;
        isDragging = true;
        track.classList.add("is-dragging");
        track.style.transition = "none";
        stopAutoplay();
        if (track.setPointerCapture && dragPointerId != null) {
          try { track.setPointerCapture(dragPointerId); } catch (err) {}
        }
      }

      dragDelta = totalDeltaX;
      e.preventDefault();
      const deltaPercent = (dragDelta / viewport.offsetWidth) * 100;
      track.style.transform = `translateX(${baseTranslatePercent + deltaPercent}%)`;
    }
    function onPointerUp() {
      dragStartX = null;
      if (!isDragging) return; // simple clic : on laisse le navigateur gérer le click natif
      isDragging = false;
      track.classList.remove("is-dragging");
      if (Math.abs(dragDelta) > DRAG_THRESHOLD) {
        if (dragDelta < 0) next(); else prev();
      } else {
        goTo(currentIndex);
      }
      restartAutoplay();
    }

    track.addEventListener("pointerdown", onPointerDown);
    track.addEventListener("pointermove", onPointerMove);
    track.addEventListener("pointerup", onPointerUp);
    track.addEventListener("pointerleave", () => { if (isDragging) onPointerUp(); });
    track.addEventListener("pointercancel", () => { if (isDragging) onPointerUp(); });

    /* ---------- Init ---------- */
    applySizes();
    startAutoplay();

    const instance = {
      destroy() {
        stopAutoplay();
        clearTimeout(resumeTimer);
        track.removeEventListener("transitionend", handleTransitionEnd);
        const idx = instances.indexOf(instance);
        if (idx > -1) instances.splice(idx, 1);
      },
      refreshSize: applySizes
    };
    rootEl._sliderInstance = instance;
    instances.push(instance);
    return instance;
  }

  function autoInit() {
    document.querySelectorAll(".slider").forEach((el) => mount(el));
  }

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      instances.forEach((i) => i.refreshSize && i.refreshSize());
    }, 150);
  });

  document.addEventListener("DOMContentLoaded", autoInit);

  return { mount, autoInit, getVisibleCount };
})();
