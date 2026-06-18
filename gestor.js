document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll("nav a");
  const sections = document.querySelectorAll(".tab");
  const logoutButton = document.querySelector(".logout-btn");
  const novasTabelaContainer = document.getElementById("novasTabela");
  const analiseTabelaContainer = document.getElementById("analiseTabela");
  const aprovadasTabelaContainer = document.getElementById("aprovadasTabela");
  const publicadasTabelaContainer = document.getElementById("publicadasTabela");
  const reprovadasTabelaContainer = document.getElementById("reprovadasTabela");

  const { WEB_APP_URL } = window.APP_CONFIG;
  const ENDPOINT_NOVAS_SUBMISSOES = `${WEB_APP_URL}?acao=novasSubmissoes`;
  const ENDPOINT_SUBMISSOES_ANALISE = `${WEB_APP_URL}?acao=submissoesEmAnalise`;
  const ENDPOINT_SUBMISSOES_APROVADAS = `${WEB_APP_URL}?acao=submissoesAprovadas`;
  const ENDPOINT_SUBMISSOES_REPROVADAS = `${WEB_APP_URL}?acao=submissoesReprovadas`;
  const ENDPOINT_SUBMISSOES_PUBLICADAS = `${WEB_APP_URL}?acao=submissoesPublicadas`;

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

  const criarTabelaSubmissoes = (registos, opcoesBotao) => {
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
      const botoes = Array.isArray(opcoesBotao) ? opcoesBotao : [opcoesBotao];
      const rowIndex = linha?.rowIndex;

      botoes.forEach((opcaoBotao) => {
        const botao = document.createElement("button");
        botao.type = "button";
        botao.className = opcaoBotao.classe;
        botao.innerHTML = `
          <span class="btn-text">${opcaoBotao.texto}</span>
          <span class="btn-spinner"></span>
        `;
        botao.addEventListener("click", () => opcaoBotao.onClick(botao, rowIndex));
        celulaSituacao.appendChild(botao);
      });

      tr.appendChild(celulaSituacao);

      tbody.appendChild(tr);
    });

    tabela.appendChild(tbody);
    return tabela;
  };

  const renderizarEstado = (container, mensagem) => {
    if (!container) return;
    container.innerHTML = "";
    const aviso = document.createElement("p");
    aviso.classList.add("estado-tabela");
    aviso.textContent = mensagem;
    container.appendChild(aviso);
  };

  const renderTabela = (container, registos, opcoesBotao) => {
    if (!container) return;
    container.innerHTML = "";

    if (!registos.length) {
      renderizarEstado(container, "Sem submissões para mostrar.");
      return;
    }

    const tabela = criarTabelaSubmissoes(registos, opcoesBotao);
    container.appendChild(tabela);
  };

  const criarTabelaSemAcoes = (registos, situacao) => {
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
      celulaSituacao.textContent = situacao;
      tr.appendChild(celulaSituacao);

      tbody.appendChild(tr);
    });

    tabela.appendChild(tbody);
    return tabela;
  };

  const renderTabelaSemAcoes = (container, registos, situacao) => {
    if (!container) return;
    container.innerHTML = "";

    if (!registos.length) {
      renderizarEstado(container, "Sem submissões para mostrar.");
      return;
    }

    const tabela = criarTabelaSemAcoes(registos, situacao);
    container.appendChild(tabela);
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

      await carregarNovasSubmissoes();
    } catch (err) {
      botao.classList.remove("loading");
      botao.disabled = false;
      alert("Erro ao marcar como analisado.");
    }
  };

  const onAprovarClick = async (botao, rowIndex) => {
    if (botao.classList.contains("loading")) return;

    botao.classList.add("loading");
    botao.disabled = true;

    try {
      const dados = new FormData();
      dados.append("acao", "marcarAprovado");
      dados.append("rowIndex", rowIndex);

      const res = await fetch(WEB_APP_URL, {
        method: "POST",
        body: dados,
      });

      const json = await res.json();

      if (!json.sucesso) {
        throw new Error(json.mensagem || "Erro ao aprovar");
      }

      botao.classList.remove("loading");
      botao.disabled = true;

      await carregarSubmissoesEmAnalise();
    } catch (err) {
      botao.classList.remove("loading");
      botao.disabled = false;
      alert("Erro ao aprovar submissão.");
    }
  };

  const onReprovarClick = async (botao, rowIndex) => {
    if (botao.classList.contains("loading")) return;

    botao.classList.add("loading");
    botao.disabled = true;

    try {
      const dados = new FormData();
      dados.append("acao", "marcarReprovado");
      dados.append("rowIndex", rowIndex);

      const res = await fetch(WEB_APP_URL, {
        method: "POST",
        body: dados,
      });

      const json = await res.json();

      if (!json.sucesso) {
        throw new Error(json.mensagem || "Erro ao reprovar");
      }

      botao.classList.remove("loading");
      botao.disabled = true;

      await carregarSubmissoesEmAnalise();
    } catch (err) {
      botao.classList.remove("loading");
      botao.disabled = false;
      alert("Erro ao reprovar submissão.");
    }
  };

  const onPublicarClick = async (botao, rowIndex) => {
    if (botao.classList.contains("loading")) return;

    botao.classList.add("loading");
    botao.disabled = true;

    try {
      const dados = new FormData();
      dados.append("acao", "publicar");
      dados.append("rowIndex", rowIndex);

      const res = await fetch(WEB_APP_URL, {
        method: "POST",
        body: dados,
      });

      const json = await res.json();

      if (!json.sucesso) {
        throw new Error(json.mensagem || "Erro ao publicar");
      }

      botao.classList.remove("loading");
      botao.disabled = true;

      await carregarSubmissoesAprovadas();
    } catch (err) {
      botao.classList.remove("loading");
      botao.disabled = false;
      alert("Erro ao publicar submissão.");
    }
  };

  const carregarNovasSubmissoes = async () => {
    if (!novasTabelaContainer) return;
    if (!ENDPOINT_NOVAS_SUBMISSOES) {
      renderizarEstado(novasTabelaContainer, "Endpoint não configurado.");
      return;
    }

    renderizarEstado(novasTabelaContainer, "A carregar submissões...");

    try {
      const response = await fetch(ENDPOINT_NOVAS_SUBMISSOES, {
        cache: "no-store",
      });
      const payload = await response.json();

      if (!payload.sucesso) {
        console.error("Erro ao carregar submissões");
        renderizarEstado(novasTabelaContainer, "Não foi possível carregar as submissões.");
        return;
      }

      renderTabela(novasTabelaContainer, payload.dados || [], {
        classe: "btn-analisar",
        texto: "Analisar",
        onClick: onAnalisarClick,
      });
    } catch (erro) {
      console.error("Erro ao carregar novas submissões:", erro);
      renderizarEstado(novasTabelaContainer, "Não foi possível carregar as submissões.");
    }
  };

  const carregarSubmissoesEmAnalise = async () => {
    if (!analiseTabelaContainer) return;
    if (!ENDPOINT_SUBMISSOES_ANALISE) {
      renderizarEstado(analiseTabelaContainer, "Endpoint não configurado.");
      return;
    }

    renderizarEstado(analiseTabelaContainer, "A carregar submissões...");

    try {
      const response = await fetch(ENDPOINT_SUBMISSOES_ANALISE, {
        cache: "no-store",
      });
      const payload = await response.json();

      if (!payload.sucesso) {
        console.error("Erro ao carregar submissões em análise");
        renderizarEstado(analiseTabelaContainer, "Não foi possível carregar as submissões.");
        return;
      }

      renderTabela(analiseTabelaContainer, payload.dados || [], [
        {
          classe: "btn-aprovar",
          texto: "Aprovar",
          onClick: onAprovarClick,
        },
        {
          classe: "btn-analisar",
          texto: "Reprovar",
          onClick: onReprovarClick,
        },
      ]);
    } catch (erro) {
      console.error("Erro ao carregar submissões em análise:", erro);
      renderizarEstado(analiseTabelaContainer, "Não foi possível carregar as submissões.");
    }
  };

  const carregarSubmissoesAprovadas = async () => {
    if (!aprovadasTabelaContainer) return;
    if (!ENDPOINT_SUBMISSOES_APROVADAS) {
      renderizarEstado(aprovadasTabelaContainer, "Endpoint não configurado.");
      return;
    }

    renderizarEstado(aprovadasTabelaContainer, "A carregar submissões...");

    try {
      const response = await fetch(ENDPOINT_SUBMISSOES_APROVADAS, {
        cache: "no-store",
      });
      const payload = await response.json();

      if (!payload.sucesso) {
        console.error("Erro ao carregar submissões aprovadas");
        renderizarEstado(aprovadasTabelaContainer, "Não foi possível carregar as submissões.");
        return;
      }

      renderTabela(aprovadasTabelaContainer, payload.dados || [], {
        classe: "btn-aprovar",
        texto: "Publicar",
        onClick: onPublicarClick,
      });
    } catch (erro) {
      console.error("Erro ao carregar submissões aprovadas:", erro);
      renderizarEstado(aprovadasTabelaContainer, "Não foi possível carregar as submissões.");
    }
  };

  const carregarSubmissoesReprovadas = async () => {
    if (!reprovadasTabelaContainer) return;
    if (!ENDPOINT_SUBMISSOES_REPROVADAS) {
      renderizarEstado(reprovadasTabelaContainer, "Endpoint não configurado.");
      return;
    }

    renderizarEstado(reprovadasTabelaContainer, "A carregar submissões...");

    try {
      const response = await fetch(ENDPOINT_SUBMISSOES_REPROVADAS, {
        cache: "no-store",
      });
      const payload = await response.json();

      if (!payload.sucesso) {
        console.error("Erro ao carregar submissões reprovadas");
        renderizarEstado(reprovadasTabelaContainer, "Não foi possível carregar as submissões.");
        return;
      }

      renderTabelaSemAcoes(reprovadasTabelaContainer, payload.dados || [], "Reprovado");
    } catch (erro) {
      console.error("Erro ao carregar submissões reprovadas:", erro);
      renderizarEstado(reprovadasTabelaContainer, "Não foi possível carregar as submissões.");
    }
  };

  const carregarSubmissoesPublicadas = async () => {
    if (!publicadasTabelaContainer) return;
    if (!ENDPOINT_SUBMISSOES_PUBLICADAS) {
      renderizarEstado(publicadasTabelaContainer, "Endpoint não configurado.");
      return;
    }

    renderizarEstado(publicadasTabelaContainer, "A carregar submissões...");

    try {
      const response = await fetch(ENDPOINT_SUBMISSOES_PUBLICADAS, {
        cache: "no-store",
      });
      const payload = await response.json();

      if (!payload.sucesso) {
        console.error("Erro ao carregar submissões publicadas");
        renderizarEstado(publicadasTabelaContainer, "Não foi possível carregar as submissões.");
        return;
      }

      renderTabelaSemAcoes(publicadasTabelaContainer, payload.dados || [], "Publicado");
    } catch (erro) {
      console.error("Erro ao carregar submissões publicadas:", erro);
      renderizarEstado(publicadasTabelaContainer, "Não foi possível carregar as submissões.");
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

      if (target === "analise") {
        carregarSubmissoesEmAnalise();
      }

      if (target === "aprovadas") {
        carregarSubmissoesAprovadas();
      }

      if (target === "reprovadas") {
        carregarSubmissoesReprovadas();
      }

      if (target === "publicadas") {
        carregarSubmissoesPublicadas();
      }
    });
  });

  // activar a primeira aba por defeito
  tabs[0].classList.add("active");

  carregarNovasSubmissoes();
});
