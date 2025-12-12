document.addEventListener("DOMContentLoaded", () => {

  // ===== LÓGICA DAS TABS =====
  const tabs = document.querySelectorAll("nav a");
  const sections = document.querySelectorAll(".tab");

  tabs.forEach(tab => {
    tab.addEventListener("click", e => {
      e.preventDefault();
      const target = tab.getAttribute("data-tab");

      tabs.forEach(t => t.classList.remove("active"));
      sections.forEach(sec => sec.classList.remove("active"));

      tab.classList.add("active");
      document.getElementById(target).classList.add("active");
    });
  });

  document.querySelector('a[data-tab="inicio"]').classList.add("active");

  // ===== LÓGICA DO MODAL LOGIN =====
  const btnLogin = document.querySelector(".login-btn");
  const modal = document.getElementById("modalLogin");
  const btnFechar = document.getElementById("btnFecharModal");

  btnLogin.addEventListener("click", () => {
    modal.style.display = "flex";
  });

  btnFechar.addEventListener("click", () => {
    modal.style.display = "none";
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

});
