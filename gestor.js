document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll("nav a");
  const sections = document.querySelectorAll(".tab");
  const logoutButton = document.querySelector(".logout-btn");
  const novasTabelaContainer = document.getElementById("novasTabela");

  const WEB_APP_URL =
    "https://script.google.com/macros/s/AKfycbyvj-DF7IYQh1fn9AFxQhiLLLGe1ssudIhUZzjigarcjyI3vc_z9-nG09sAFwMtDnwvXw/exec";
  const ENDPOINT_NOVAS_SUBMISSOES = `${WEB_APP_URL}?acao=novasSubmissoes`;

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

  const converterData = (valor) => {
    if (!valor) return null;
    if (valor instanceof Date && !Number.isNaN(valor.getTime())) return valor;

    if (typeof valor === "number") {
      if (valor > 1e12) {
        const dataMs = new Date(valor);
        return Number.isNaN(dataMs.getTime()) ? null : dataMs;
      }
      const dataSerial = new Date(Math.round((valor - 25569) * 86400 * 1000));
      return Number.isNaN(dataSerial.getTime()) ? null : dataSerial;
    }

    const texto = String(valor).trim();
    if (!texto) return null;

    const tentativa = new Date(texto);
    if (!Number.isNaN(tentativa.getTime())) return tentativa;

    const partes = texto.split(/[\/\-]/).map(parte => parte.trim());
    if (partes.length >= 3) {
      const [dia, mes, ano] = partes;
      const dataManual = new Date(
        Number(ano.length === 2 ? `20${ano}` : ano),
        Number(mes) - 1,
        Number(dia)
      );
      return Number.isNaN(dataManual.getTime()) ? null : dataManual;
    }

    return null;
  };

  const formatarData = (valor) => {
    const data = converterData(valor);
    if (!data) return "";
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = String(data.getFullYear()).slice(-2);
    return `${dia}-${mes}-${ano}`;
  };

  const obterCampo = (linha, indice, chave) => {
    if (Array.isArray(linha)) return linha[indice] ?? "";
    if (linha && typeof linha === "object") {
      return linha[chave] ?? linha[indice] ?? "";
    }
    return "";
  };

  const criarCelula = (texto) => {
    const celula = document.createElement("td");
    celula.textContent = texto;
    return celula;
  };

  const criarTabelaNovasSubmissoes = (registos) => {
    const tabela = document.createElement("table");
    tabela.classList.add("tabela-submissoes");

    const thead = document.createElement("thead");
    const cabecalho = document.createElement("tr");
    [
      "Ord",
      "Submissão",
      "Nome",
      "Curso",
      "E-mail",
      "Contacto",
      "Artigo",
      "Situação",
    ].forEach((titulo) => {
      const th = document.createElement("th");
      th.textContent = titulo;
      cabecalho.appendChild(th);
    });
    thead.appendChild(cabecalho);
    tabela.appendChild(thead);

    const tbody = document.createElement("tbody");

    registos.forEach((linha, index) => {
      const tr = document.createElement("tr");

      const data = obterCampo(linha, 0, "data");
      const nome = obterCampo(linha, 2, "nome");
      const curso = obterCampo(linha, 3, "curso");
      const email = obterCampo(linha, 9, "email");
      const contacto = obterCampo(linha, 10, "contacto");
      const linkArtigo = obterCampo(linha, 11, "artigo");

      tr.appendChild(criarCelula(String(index + 1)));
      tr.appendChild(criarCelula(formatarData(data)));
      tr.appendChild(criarCelula(nome));
      tr.appendChild(criarCelula(curso));
      tr.appendChild(criarCelula(email));
      tr.appendChild(criarCelula(contacto));

      const celulaArtigo = document.createElement("td");
      const artigoUrl =
        typeof linkArtigo === "string" ? linkArtigo.trim() : linkArtigo;
      if (artigoUrl) {
        const link = document.createElement("a");
        link.href = artigoUrl;
        link.target = "_blank";
        link.rel = "noopener";
        link.classList.add("link-artigo");
        link.title = "Abrir documento";

        const icon = document.createElement("img");
        icon.src = "icons/word.svg";
        icon.alt = "Word";
        icon.classList.add("icon-word");

        link.appendChild(icon);
        celulaArtigo.appendChild(link);
      } else {
        celulaArtigo.textContent = "Sem ficheiro";
      }
      tr.appendChild(celulaArtigo);

      const celulaSituacao = document.createElement("td");
      const botao = document.createElement("button");
      botao.type = "button";
      botao.className = "btn-analisar";
      const rowIndex = linha?.rowIndex;
      botao.innerHTML = `
        <span class="btn-text">Analisar</span>
        <span class="btn-spinner"></span>
      `;
      botao.addEventListener("click", () => onAnalisarClick(botao, rowIndex));
      celulaSituacao.appendChild(botao);
      tr.appendChild(celulaSituacao);

      tbody.appendChild(tr);
    });

    tabela.appendChild(tbody);
    return tabela;
  };

  const renderizarEstado = (mensagem) => {
    if (!novasTabelaContainer) return;
    novasTabelaContainer.innerHTML = "";
    const aviso = document.createElement("p");
    aviso.classList.add("estado-tabela");
    aviso.textContent = mensagem;
    novasTabelaContainer.appendChild(aviso);
  };

  const renderTabela = (registos) => {
    if (!novasTabelaContainer) return;
    novasTabelaContainer.innerHTML = "";

    if (!registos.length) {
      renderizarEstado("Sem submissões para mostrar.");
      return;
    }

    const tabela = criarTabelaNovasSubmissoes(registos);
    novasTabelaContainer.appendChild(tabela);
  };

  const onAnalisarClick = async (botao, rowIndex) => {
    if (botao.classList.contains("loading")) return;

    botao.classList.add("loading");
    botao.disabled = true;

    try {
      const dados = new FormData();
      dados.append("acao", "marcarAnalisado");
      dados.append("rowIndex", rowIndex);

      const res = await fetch(WEB_APP_URL, {
        method: "POST",
        body: dados,
      });

      const json = await res.json();

      if (!json.sucesso) {
        throw new Error(json.mensagem || "Erro ao analisar");
      }

      botao.classList.remove("loading");
      botao.disabled = true;
    } catch (err) {
      botao.classList.remove("loading");
      botao.disabled = false;
      alert("Erro ao marcar como analisado.");
    }
  };

  const carregarNovasSubmissoes = async () => {
    if (!novasTabelaContainer) return;
    if (!ENDPOINT_NOVAS_SUBMISSOES) {
      renderizarEstado("Endpoint não configurado.");
      return;
    }

    renderizarEstado("A carregar submissões...");

    try {
      const response = await fetch(ENDPOINT_NOVAS_SUBMISSOES, {
        cache: "no-store",
      });
      const payload = await response.json();

      if (!payload.sucesso) {
        console.error("Erro ao carregar submissões");
        renderizarEstado("Não foi possível carregar as submissões.");
        return;
      }

      renderTabela(payload.dados || []);
    } catch (erro) {
      console.error("Erro ao carregar novas submissões:", erro);
      renderizarEstado("Não foi possível carregar as submissões.");
    }
  };

  tabs.forEach(tab => {
    tab.addEventListener("click", e => {
      e.preventDefault();

      const target = tab.getAttribute("data-tab");

      tabs.forEach(t => t.classList.remove("active"));
      sections.forEach(sec => sec.classList.remove("active"));

      tab.classList.add("active");
      document.getElementById(target).classList.add("active");

      if (target === "novas") {
        carregarNovasSubmissoes();
      }
    });
  });

  // activar a primeira aba por defeito
  tabs[0].classList.add("active");

  carregarNovasSubmissoes();
});
