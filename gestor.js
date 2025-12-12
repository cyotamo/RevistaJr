document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll("nav a");
  const sections = document.querySelectorAll(".tab");
  const logoutButton = document.querySelector(".logout-btn");

  verificarAuth(user => {
    if (!user) {
      window.location.href = "index.html";
    }
  });

  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      logoutFirebase().then(() => {
        window.location.href = "index.html";
      });
    });
  }

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

  // activar a primeira aba por defeito
  tabs[0].classList.add("active");
});
