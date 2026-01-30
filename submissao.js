document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formNovaSubmissao");
  const cursoSelect = document.getElementById("curso");
  const linhaSelect = document.getElementById("linha");
  const botao = document.getElementById("btnEnviar");
  const msg = document.getElementById("mensagemSucesso");

  if (!form) return;

  const WEB_APP_URL =
    "https://script.google.com/macros/s/AKfycbwPL7XOGZZibG-Qxxdg8fVLEDs9ISNeLbltG7qZ6mo6xaRVAIA_h7r-oQYWZvaXf7Zkmg/exec";
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
      leitor.onload = () => {
        const resultado = String(leitor.result || "");
        const base64 = resultado.includes(",")
          ? resultado.split(",")[1]
          : resultado;
        resolve(base64);
      };
      leitor.onerror = () => reject(leitor.error);
      leitor.readAsDataURL(ficheiro);
    });

  const enviarArtigo = async () => {
    if (!ENDPOINT_SUBMISSAO) {
      alert("Envio não configurado. Aguarde a definição do endpoint.");
      return;
    }

    if (!botao) {
      return;
    }

    botao.classList.add("btn-loading");
    botao.disabled = true;
    if (msg) {
      msg.style.display = "none";
    }

    try {
      const ficheiro = form.querySelector("#ficheiro").files[0];
      const ficheiroBase64 = await ficheiroParaBase64(ficheiro);

      const formData = new FormData();
      const campos = [
        "nome",
        "numero",
        "curso",
        "linha",
        "autor1",
        "autor2",
        "autor3",
        "email",
        "contacto",
        "titulo",
      ];

      campos.forEach((campo) => {
        const valor = form.querySelector(`#${campo}`).value.trim();
        formData.append(campo, valor);
      });

      formData.append("ficheiroBase64", ficheiroBase64);
      formData.append("ficheiroNome", ficheiro ? ficheiro.name : "");
      formData.append("ficheiroTipo", ficheiro ? ficheiro.type : "");

      const response = await fetch(ENDPOINT_SUBMISSAO, {
        method: "POST",
        body: formData,
      });

      const resultado = await response.json();

      if (resultado && resultado.sucesso === true) {
        form.reset();
        limparSelect(linhaSelect, "— Seleccione a linha de pesquisa —");
        if (msg) {
          msg.textContent =
            "O seu artigo foi enviado com sucesso, aguarde o contacto.";
          msg.style.display = "block";
        }
      } else {
        alert("Não foi possível enviar a submissão.");
      }
    } catch (erro) {
      console.error("Erro ao enviar submissão:", erro);
      alert("Ocorreu um erro ao enviar a submissão.");
    } finally {
      botao.classList.remove("btn-loading");
      botao.disabled = false;
    }
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    enviarArtigo();
  });

  window.enviarArtigo = enviarArtigo;

  carregarCursosELinhas();
});
