(() => {
  const main = document.querySelector("main");
  if (!main) return;

  if (!document.querySelector(".appointment-cta")) {
    const appointmentCta = document.createElement("a");
    appointmentCta.className = "appointment-cta";
    appointmentCta.href = "contact.html#request-appointment";
    appointmentCta.innerHTML = `
      <span>Request a time</span>
      <span class="appointment-cta__arrow" aria-hidden="true">↗</span>
    `;
    document.body.append(appointmentCta);
  }

  const appointmentForm = document.querySelector("#appointment-request-form");
  appointmentForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(appointmentForm);
    const message = [
      `Name: ${formData.get("name")}`,
      `Email: ${formData.get("email")}`,
      `Project type: ${formData.get("project-type")}`,
      `Preferred appointment date: ${formData.get("appointment-date") || "Flexible"}`,
      "",
      "Project details:",
      formData.get("project-details")
    ].join("\n");
    const subject = encodeURIComponent("Appointment request — JOC Architectural Photography");
    window.location.href = `mailto:hello@jocarchitecturalphotography.com?subject=${subject}&body=${encodeURIComponent(message)}`;
  });

  if (document.querySelector(".site-footer")) return;

  const footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.innerHTML = `
    <div class="site-footer__inner">
      <div class="site-footer__top">
        <div class="site-footer__brand">
          <a class="site-footer__mark" href="index.html" aria-label="JOC home">JOC</a>
          <p>Architectural photography<br>with atmosphere and intention.</p>
        </div>
        <div class="site-footer__navigation">
          <p class="site-footer__label">Explore</p>
          <a href="index.html">Home</a>
          <a href="about-us.html">About the studio</a>
          <a href="blog.html">Journal</a>
          <a href="contact.html">Contact</a>
        </div>
        <div class="site-footer__navigation site-footer__navigation--work">
          <p class="site-footer__label">Selected work</p>
          <a href="southampton.html">Southampton</a>
          <a href="daniels-devlin-house.html">Daniels/Devlin House</a>
          <a href="walnut-creek-cottage.html">Walnut Creek Cottage</a>
          <a href="aidells-oakes-healdsburg-house.html">Healdsburg House</a>
          <a href="atherton-poolhouse.html">Atherton Poolhouse</a>
          <a href="art-and-architecture.html">Art &amp; Architecture</a>
          <a href="photography-of-artwork.html">Photography of Artwork</a>
        </div>
        <div class="site-footer__contact">
          <p class="site-footer__label">Have a project in mind?</p>
          <p>Let’s make thoughtful images of the spaces that matter.</p>
          <a class="site-footer__cta" href="contact.html#request-appointment">Request a time <span aria-hidden="true">↗</span></a>
          <a class="site-footer__email" href="mailto:hello@jocarchitecturalphotography.com">hello@jocarchitecturalphotography.com</a>
        </div>
      </div>
      <div class="site-footer__bottom">
        <span>© ${new Date().getFullYear()} JOC Architectural Photography</span>
        <span class="site-footer__socials"></span>
        <a href="#top" class="site-footer__back-to-top">Back to top ↑</a>
      </div>
    </div>
  `;

  main.insertAdjacentElement("afterend", footer);

  const socials = document.querySelector(".socials");
  const socialSlot = footer.querySelector(".site-footer__socials");
  if (socials && socialSlot) {
    socials.classList.add("site-footer__social-links");
    socialSlot.append(socials);
  }

  const navigation = document.querySelector(".site-navigation");
  const toggle = navigation?.querySelector(".menu-toggle");
  if (!document.getElementById("top")) document.body.id = "top";
  const closeMenu = () => {
    if (!navigation?.classList.contains("open")) return;
    navigation.classList.remove("open");
    toggle?.setAttribute("aria-expanded", "false");
  };

  toggle?.setAttribute("aria-controls", "site-navigation-links");
  navigation?.querySelector("ul")?.setAttribute("id", "site-navigation-links");
  navigation?.querySelectorAll("a").forEach((link) => {
    if (new URL(link.href, window.location.href).pathname === window.location.pathname) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
  document.addEventListener("click", (event) => {
    if (navigation && !navigation.contains(event.target)) closeMenu();
  });
})();
