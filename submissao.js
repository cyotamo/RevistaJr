document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formNovaSubmissao");
  const cursoSelect = document.getElementById("curso");
  const linhaSelect = document.getElementById("linha");

  if (!form) return;

  const WEB_APP_URL =
    "https://script.google.com/macros/s/AKfycby2UVD2U8q9emIvd9Jh8UzODT_LBCQr25kslqc4uddfsIySkjQHNlFsxEPg-cUsSX1kvg/exec";
  const ENDPOINT_CUR_LINHA = `${WEB_APP_URL}?acao=curLinha`;
  const ENDPOINT_SUBMISSAO = WEB_APP_URL;

  const normalizarLinha = (linha) => String(linha || "").trim();

  const extrairLinhas = (payload) => {
   if (Array.isArray(payload)) return payload;
   if (payload && Array.isArray(payload.dados)) return payload.dados; // ← ESTA LINHA FALTAVA
   if (payload && Array.isArray(payload.data)) return payload.data;
   if (payload && Array.isArray(payload.values)) return payload.values;
   return [];
 };


  const limparSelect = (select, placeholder) => {
    select.innerHTML = "";
    const option = document.createElement("option");
    option.value = "";
    option.textContent = placeholder;
    select.appendChild(option);
  };

  const carregarCursosELinhas = async () => {
    if (!ENDPOINT_CUR_LINHA) {
      return;
    }

    try {
      const response = await fetch(ENDPOINT_CUR_LINHA);
      const payload = await response.json();
      const linhas = extrairLinhas(payload)
        .map((linha) => [normalizarLinha(linha[0]), normalizarLinha(linha[1])])
        .filter(([curso, linha]) => curso && linha);

      const cursosUnicos = [...new Set(linhas.map(([curso]) => curso))];

      limparSelect(cursoSelect, "— Seleccione o curso —");
      cursosUnicos.forEach((curso) => {
        const option = document.createElement("option");
        option.value = curso;
        option.textContent = curso;
        cursoSelect.appendChild(option);
      });

      cursoSelect.addEventListener("change", () => {
        const cursoSelecionado = normalizarLinha(cursoSelect.value);
        const linhasFiltradas = [
          ...new Set(
            linhas
              .filter(([curso]) => curso === cursoSelecionado)
              .map(([, linha]) => linha)
          ),
        ];

        limparSelect(linhaSelect, "— Seleccione a linha de pesquisa —");
        linhasFiltradas.forEach((linha) => {
          const option = document.createElement("option");
          option.value = linha;
          option.textContent = linha;
          linhaSelect.appendChild(option);
        });
      });
    } catch (erro) {
      console.error("Erro ao carregar cursos e linhas:", erro);
    }
  };

  const ficheiroParaBase64 = (ficheiro) =>
    new Promise((resolve, reject) => {
      if (!ficheiro) {
        resolve("");
        return;
      }

      const leitor = new FileReader();
      leitor.onload = () => resolve(String(leitor.result || ""));
      leitor.onerror = () => reject(leitor.error);
      leitor.readAsDataURL(ficheiro);
    });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!ENDPOINT_SUBMISSAO) {
      alert("Envio não configurado. Aguarde a definição do endpoint.");
      return;
    }

    try {
      const ficheiro = form.querySelector("#ficheiro").files[0];
      const ficheiroBase64 = await ficheiroParaBase64(ficheiro);

      const dados = {
        nome: form.querySelector("#nome").value.trim(),
        numero: form.querySelector("#numero").value.trim(),
        curso: form.querySelector("#curso").value.trim(),
        linha: form.querySelector("#linha").value.trim(),
        autor1: form.querySelector("#autor1").value.trim(),
        autor2: form.querySelector("#autor2").value.trim(),
        autor3: form.querySelector("#autor3").value.trim(),
        email: form.querySelector("#email").value.trim(),
        contacto: form.querySelector("#contacto").value.trim(),
        titulo: form.querySelector("#titulo").value.trim(),
        ficheiroBase64,
        ficheiroNome: ficheiro ? ficheiro.name : "",
      };

      const response = await fetch(ENDPOINT_SUBMISSAO, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dados),
      });

      const resultado = await response.json();

      if (resultado && resultado.sucesso === true) {
        alert("Submissão enviada com sucesso.");
        form.reset();
        limparSelect(linhaSelect, "— Seleccione a linha de pesquisa —");
      } else {
        alert("Não foi possível enviar a submissão.");
      }
    } catch (erro) {
      console.error("Erro ao enviar submissão:", erro);
      alert("Ocorreu um erro ao enviar a submissão.");
    }
  });

  carregarCursosELinhas();
});
