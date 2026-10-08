(() => {
  const projects = [
    {
      id: "southampton",
      name: "Southampton",
      title: "A quiet coastal residence, photographed in its natural light.",
      description: "Explore the architecture, interiors, and the relationship between home and landscape.",
      image: "https://images.squarespace-cdn.com/content/v1/5bd8fca47c9327bef923664d/1551234967423-XV7S3YECQQKLGY9NT0VP/_MG_6039.jpg?format=1500w",
      alt: "Southampton residence photographed in natural light",
      href: "southampton.html",
    },
    {
      id: "daniels-devlin-house",
      name: "Daniels/Devlin House",
      title: "A considered study of modern form and material.",
      description: "Explore this architectural story through its geometry, textures, and calm interior spaces.",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=85",
      alt: "Modern residence framed by its garden",
      href: "daniels-devlin-house.html",
    },
    {
      id: "walnut-creek-cottage",
      name: "Walnut Creek Cottage",
      title: "A welcoming home shaped by warmth and detail.",
      description: "Explore a softer view of residential architecture, interiors, and garden connection.",
      image: "images/walnut-creek/walnut-creek-exterior.jpg",
      alt: "Contemporary cottage and garden",
      href: "walnut-creek-cottage.html",
    },
    {
      id: "aidells-oakes-healdsburg-house",
      name: "Aidells/Oakes Healdsburg House",
      title: "A home rooted in the character of wine country.",
      description: "Explore architecture in conversation with its surrounding landscape.",
      image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=85",
      alt: "California residence surrounded by landscape",
      href: "aidells-oakes-healdsburg-house.html",
    },
    {
      id: "atherton-poolhouse",
      name: "Atherton Poolhouse",
      title: "Outdoor living framed by light, texture, and form.",
      description: "Explore a relaxed architectural portrait of indoor-outdoor California living.",
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=85",
      alt: "Modern home with an indoor-outdoor living space",
      href: "atherton-poolhouse.html",
    },
    {
      id: "art-and-architecture",
      name: "Art & Architecture",
      title: "An editorial dialogue between art and the built environment.",
      description: "Explore form, volume, and the details that give a space its character.",
      image: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1400&q=85",
      alt: "Sculptural architectural forms",
      href: "art-and-architecture.html",
    },
    {
      id: "photography-of-artwork",
      name: "Photography of Artwork",
      title: "Artwork photographed with care for its material and setting.",
      description: "Explore a selection focused on color, texture, and thoughtful presentation.",
      image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1400&q=85",
      alt: "Colorful artwork in a gallery",
      href: "photography-of-artwork.html",
    },
  ];

  const pageName = window.location.pathname.split("/").pop() || "index.html";
  const initialIndex = Math.max(0, projects.findIndex((project) => project.href === pageName));
  const isHome = pageName === "index.html" || pageName === "";

  const hero = document.querySelector(".portfolio-hero, .project-hero, .page-hero");
  if (!hero) return;

  const section = document.createElement("section");
  section.className = "squeeze-section";
  section.setAttribute("aria-label", "Featured architectural portfolio");

  const carousel = document.createElement("div");
  carousel.className = "squeeze-carousel";
  carousel.setAttribute("role", "region");
  carousel.setAttribute("aria-roledescription", "carousel");
  carousel.setAttribute("aria-label", "Selected architectural projects");
  carousel.innerHTML = `
    <div class="squeeze-heading">
      <div>
        <p class="eyebrow">A portfolio of places</p>
        <h2>Architecture, seen<br>with feeling.</h2>
      </div>
      <div class="squeeze-controls" aria-label="Portfolio controls">
        <button class="squeeze-arrow" type="button" data-direction="-1" aria-label="Previous project">
          <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M12.75 3.75 6.5 10l6.25 6.25M7 10h10" /></svg>
        </button>
        <button class="squeeze-arrow" type="button" data-direction="1" aria-label="Next project">
          <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m7.25 3.75 6.25 6.25-6.25 6.25M13 10H3" /></svg>
        </button>
      </div>
    </div>
    <div class="squeeze-panels" role="tablist" aria-label="Choose a project"></div>
    <div class="squeeze-caption" id="squeeze-project-caption" role="tabpanel" aria-live="polite">
      <p class="squeeze-caption-copy"></p>
      <a class="squeeze-action" href="#">Explore project <span aria-hidden="true">↗</span></a>
    </div>
    <div class="squeeze-pagination" aria-hidden="true"><span class="squeeze-current">01</span><span class="squeeze-pagination-line"></span><span>07</span></div>
  `;
  section.append(carousel);
  const insertionPoint = isHome
    ? document.querySelector("#studio-introduction") || hero
    : hero;
  insertionPoint.insertAdjacentElement("afterend", section);

  const track = carousel.querySelector(".squeeze-panels");
  const copy = carousel.querySelector(".squeeze-caption-copy");
  const action = carousel.querySelector(".squeeze-action");
  const caption = carousel.querySelector(".squeeze-caption");
  const current = carousel.querySelector(".squeeze-current");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let activeIndex = initialIndex;
  let hoverIndex = -1;
  let touchStart = null;

  const setWidths = () => {
    const mobile = window.matchMedia("(max-width: 640px)").matches;
    const gap = mobile ? 8 : 16;
    const slatGap = mobile ? 5 : 8;
    const slat = mobile ? 5 : 8;
    const room = `calc(100cqi - var(--sq-hero) - 3 * ${slatGap}px - 3 * ${gap}px - 3 * ${slat}px)`;
    const shares = [-0.06, 0.61, 0.3, 0.15];
    const squeezed = [-0.12, 0.59, 0.28, 0.13];
    const stretched = [0, 0.71, 0.4, 0.25];

    carousel.style.setProperty("--sq-gap", `${gap}px`);
    carousel.style.setProperty("--sq-slat-gap", `${slatGap}px`);
    carousel.style.setProperty("--sq-slat", `${slat}px`);
    carousel.style.setProperty("--sq-h", mobile ? "clamp(105px, calc((100cqi - 54px) * 0.61 / 1.777), 200px)" : "clamp(180px, 32cqi, 340px)");
    carousel.style.setProperty("--sq-hero", "calc(var(--sq-h) * 16 / 9)");
    carousel.style.setProperty("--sq-room", room);

    const widths = shares.map((share, index) => {
      if (hoverIndex < 1 || hoverIndex > 3 || reducedMotion.matches) {
        return index === 0
          ? `calc(var(--sq-hero) + var(--sq-room) * ${share})`
          : `calc(var(--sq-room) * ${share})`;
      }
      const activeShare = hoverIndex === index ? stretched[index] : squeezed[index];
      return index === 0
        ? `calc(var(--sq-hero) + var(--sq-room) * ${activeShare})`
        : `calc(var(--sq-room) * ${activeShare})`;
    });

    carousel.style.setProperty(
      "--sq-columns",
      `${widths.join(" ")} repeat(3, var(--sq-slat))`,
    );
  };

  const paint = () => {
    const ordered = projects.map((_, offset) => projects[(activeIndex + offset) % projects.length]);
    track.replaceChildren();

    ordered.forEach((project, place) => {
      const selected = place === 0;
      const tab = document.createElement("button");
      tab.className = "squeeze-panel";
      tab.type = "button";
      tab.setAttribute("role", "tab");
      tab.setAttribute("aria-selected", String(selected));
      tab.setAttribute("aria-label", `${project.name}${selected ? ", selected" : ", select project"}`);
      tab.setAttribute("tabindex", selected ? "0" : "-1");
      tab.dataset.index = String(projects.indexOf(project));
      tab.dataset.column = String(Math.min(place, 4));
      tab.style.setProperty("--sq-place", String(place));
      tab.setAttribute("aria-controls", "squeeze-project-caption");

      const image = document.createElement("img");
      image.src = project.image;
      image.alt = project.alt;
      image.loading = place > 2 ? "lazy" : "eager";
      image.decoding = "async";
      image.draggable = false;

      const shade = document.createElement("span");
      shade.className = "squeeze-panel-shade";
      shade.setAttribute("aria-hidden", "true");

      const label = document.createElement("span");
      label.className = "squeeze-panel-label";
      label.textContent = project.name;

      tab.append(image, shade, label);
      tab.addEventListener("click", () => {
        const index = Number(tab.dataset.index);
        if (index !== activeIndex) select(index);
        else window.location.href = project.href;
      });
      tab.addEventListener("pointerenter", () => {
        hoverIndex = place;
        setWidths();
      });
      tab.addEventListener("pointerleave", () => {
        hoverIndex = -1;
        setWidths();
      });
      tab.addEventListener("focus", () => {
        hoverIndex = place;
        setWidths();
      });
      track.append(tab);
    });

    track.querySelectorAll(".squeeze-panel").forEach((tab) => {
      tab.addEventListener("keydown", (event) => {
        if (event.key === "ArrowRight") {
          event.preventDefault();
          select((activeIndex + 1) % projects.length, true);
        } else if (event.key === "ArrowLeft") {
          event.preventDefault();
          select((activeIndex - 1 + projects.length) % projects.length, true);
        } else if (event.key === "Home") {
          event.preventDefault();
          select(0, true);
        } else if (event.key === "End") {
          event.preventDefault();
          select(projects.length - 1, true);
        }
      });
    });

    const project = projects[activeIndex];
    copy.replaceChildren();
    const title = document.createElement("strong");
    title.textContent = project.title;
    const description = document.createElement("span");
    description.textContent = ` ${project.description}`;
    copy.append(title, description);
    action.href = project.href;
    action.setAttribute("aria-label", `Explore ${project.name}`);
    current.textContent = String(activeIndex + 1).padStart(2, "0");
    track.setAttribute("aria-activedescendant", `squeeze-panel-${activeIndex}`);
    track.querySelector(`[data-index="${activeIndex}"]`)?.setAttribute("id", `squeeze-panel-${activeIndex}`);
    caption.setAttribute("aria-labelledby", `squeeze-panel-${activeIndex}`);
    setWidths();
  };

  const select = (index, focusPanel = false) => {
    activeIndex = (index + projects.length) % projects.length;
    hoverIndex = -1;
    paint();
    if (focusPanel) {
      track.querySelector(`[data-index="${activeIndex}"]`)?.focus();
    }
  };

  carousel.querySelectorAll(".squeeze-arrow").forEach((button) => {
    button.addEventListener("click", () => {
      select(activeIndex + Number(button.dataset.direction));
    });
  });

  track.addEventListener("touchstart", (event) => {
    touchStart = event.changedTouches[0].clientX;
  }, { passive: true });
  track.addEventListener("touchend", (event) => {
    if (touchStart === null) return;
    const delta = event.changedTouches[0].clientX - touchStart;
    if (Math.abs(delta) > 48) select(activeIndex + (delta < 0 ? 1 : -1));
    touchStart = null;
  }, { passive: true });

  window.addEventListener("resize", setWidths, { passive: true });
  reducedMotion.addEventListener("change", setWidths);

  if (isHome) document.documentElement.classList.add("has-squeeze-home");
  paint();
})();
