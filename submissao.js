document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formNovaSubmissao");

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    alert("Formulário preparado. O envio será activado na próxima etapa.");
  });
});
