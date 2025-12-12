document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll("nav a");
  const sections = document.querySelectorAll(".tab");

  tabs.forEach(tab => {
    tab.addEventListener("click", e => {
      e.preventDefault();

      const target = tab.getAttribute("data-tab");

      // remover active de todos
      tabs.forEach(t => t.classList.remove("active"));
      sections.forEach(sec => sec.classList.remove("active"));

      // adicionar active nos seleccionados
      tab.classList.add("active");
      document.getElementById(target).classList.add("active");
    });
  });

  // deixar INÍCIO activo no carregamento
  document.querySelector('a[data-tab="inicio"]').classList.add("active");
});
