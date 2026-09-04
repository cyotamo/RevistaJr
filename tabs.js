document.addEventListener("DOMContentLoaded", () => {
  const MOSTRAR_ARTIGOS = true;
  const DADOS_INICIO = {
    ultimaEdicao: "Edição Actual: Vol. 2026, Edição n.º 1 (Ago – Dez)",
    editorial: {
      titulo: "Editorial",
      autor: "Prof. Dr. Cremildo José Yotamo",
      pdf: "https://drive.google.com/file/d/1ZDakALIP-zS7xaZGiby8MXQvcHc5kLT3/view?usp=drive_link",
    },
    artigos: [
      {
        titulo: "Influência de Conflitos Laborais nas Relações Interpessoais dos Trabalhadores: Caso da Focus-Comércio e Serviços (2022–2024)",
        autor: "Elidate Ezequiel Aspirante & Itelvina Ribeiro",
        pdf: "https://drive.google.com/file/d/1rX5FUw9Lttxx7OGn09Z8IY6OxVt1uzSX/view?usp=drive_link",
      },
      {
        titulo: "Aplicação da Economia Comportamental no Sector Público: Evidências dos Funcionários da Saúde e da Educação na Cidade de Nampula (2024–2025)",
        autor: "Eva Pedro & Abudo Sadate Ucade",
        pdf: "https://drive.google.com/file/d/1EZcrCITnBV6H5zIIJSfNfjxBvZvCpvpy/view?usp=drive_link",
      },
      {
        titulo: "Determinantes das Exportações em Moçambique (2010–2023)",
        autor: "Carlos Pires & Castigo Castigo",
        pdf: "https://drive.google.com/file/d/1UEHVPnKfqZgYEUI0diaHpCjkoQWe27WY/view?usp=drive_link",
      },
      {
        titulo: "O Impacto da Inflação no Poder de Compra dos Funcionários Públicos: Estudo de Caso da Direcção Provincial da Indústria e Comércio da Cidade de Nampula (2016–2024)",
        autor: "Denis Mita Manuel & Abudo Sadate Ucade",
        pdf: "https://drive.google.com/file/d/1u2CWqgb7oPd3N7XqAP8E7Vj17ABvYE_r/view?usp=drive_link",
      },
      {
        titulo: "Práticas de Promoção da Saúde Ocupacional nas Organizações: O Caso dos Funcionários do Comando Provincial da Polícia da República de Moçambique em Nampula (2022–2024)",
        autor: "Manuel Alberto António & Lucília Consolo",
        pdf: "https://drive.google.com/file/d/1gsmFrDlaG0k859oITtgjXKscy5Ssxsk_/view?usp=drive_link",
      },
      {
        titulo: "Análise de Competitividade no Mercado de Combustível à Luz das 5 Forças de Porter: Caso da Cidade de Nampula (2003–2026)",
        autor: "Adolfo Paiva & Cremildo Yotamo",
        pdf: "https://drive.google.com/file/d/1pRYomeD2BvTsPDWuxvS74G0TCJameluv/view?usp=drive_link",
      },
    ],
  };

  const txtUltimaEdicao = document.getElementById("txtUltimaEdicao");
  const editorialConteudo = document.getElementById("editorialConteudo");
  const listaArtigos = document.getElementById("listaArtigos");
  const conteudoSobre = document.getElementById("conteudoSobre");

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

      if (target === "inicio") {
        carregarInicio();
      } else if (target === "sobre") {
        carregarSobre();
      }
    });
  });

  document.querySelector('a[data-tab="inicio"]').classList.add("active");

  const limparContainer = (container) => {
    if (container) {
      container.textContent = "";
    }
  };

  const criarLinkBaixar = (link) => {
    if (!link) return null;
    const botao = document.createElement("a");
    botao.textContent = "PDF";
    botao.href = link;
    botao.target = "_blank";
    botao.rel = "noopener";
    botao.classList.add("btn", "btn-pdf");
    return botao;
  };

  const criarBlocoArtigo = ({ titulo, autor, link, resumo }) => {
    const item = document.createElement("div");
    item.classList.add("artigo-card");

    const thumb = document.createElement("div");
    thumb.classList.add("artigo-thumb");

    const imagemElemento = document.createElement("img");
    imagemElemento.src = "assets/thumbs/Capa.png";
    imagemElemento.alt = "Capa do artigo";
    thumb.appendChild(imagemElemento);
    item.appendChild(thumb);

    const conteudo = document.createElement("div");
    conteudo.classList.add("artigo-conteudo");

    const tituloElemento = document.createElement("h4");
    tituloElemento.classList.add("artigo-titulo");
    tituloElemento.textContent = titulo ?? "";
    conteudo.appendChild(tituloElemento);

    const autorElemento = document.createElement("p");
    autorElemento.classList.add("artigo-autores");
    autorElemento.textContent = autor ?? "";
    conteudo.appendChild(autorElemento);

    const resumoElemento = document.createElement("p");
    resumoElemento.classList.add("artigo-resumo");
    resumoElemento.textContent =
      resumo ??
      "Resumo indisponível no momento. Em breve será disponibilizada uma introdução detalhada.";
    conteudo.appendChild(resumoElemento);

    item.appendChild(conteudo);

    const acoes = document.createElement("div");
    acoes.classList.add("artigo-acoes");

    const botao = criarLinkBaixar(link);
    if (botao) {
      acoes.appendChild(botao);
    }

    item.appendChild(acoes);

    return item;
  };

  const renderizarUltimaEdicao = (dados) => {
    if (!txtUltimaEdicao) return;
    txtUltimaEdicao.textContent = dados.ultimaEdicao;
  };

  const renderizarEditorial = (editorial) => {
    if (!editorialConteudo) return;
    limparContainer(editorialConteudo);

    const item = criarBlocoArtigo({
      titulo: editorial.titulo,
      autor: editorial.autor,
      link: editorial.link,
      resumo: editorial.resumo,
    });

    editorialConteudo.appendChild(item);
  };

  const renderizarArtigos = (artigos) => {
    if (!MOSTRAR_ARTIGOS) return;
    if (!listaArtigos) return;
    limparContainer(listaArtigos);

    artigos.forEach((artigo) => {
      const item = criarBlocoArtigo({
        titulo: artigo.titulo,
        autor: artigo.autor,
        link: artigo.link,
        resumo: artigo.resumo,
      });

      listaArtigos.appendChild(item);
    });
  };

  const carregarSobre = () => {
    if (!conteudoSobre) return;
    limparContainer(conteudoSobre);

    const titulo = document.createElement("h3");
    titulo.classList.add("secao-titulo");
    titulo.textContent = "Sobre a Plataforma";
    conteudoSobre.appendChild(titulo);

    const paragrafos = [
      "Esta plataforma é um espaço institucional da Faculdade de Ciências Económicas e Empresarias da Universidade Rovuma, destinado à divulgação e valorização da produção científica. Tem como foco principal a publicação de pesquisas oriundas dos Trabalhos de Conclusão de Curso (TCC) defendidos na faculdade, integrando igualmente outros tipos de pesquisas científicas, projectos de investigação, relatórios técnicos relevantes.",
      "Assim, o seu objectivo é promover a investigação científica, facilitar o acesso ao conhecimento produzido e reforçar a visibilidade do trabalho académico de estudantes, docentes e investigadores, contribuindo para o fortalecimento da qualidade científica e da memória institucional da Faculdade.",
    ];

    paragrafos.forEach((texto) => {
      const paragrafo = document.createElement("p");
      paragrafo.textContent = texto;
      conteudoSobre.appendChild(paragrafo);
    });
  };

  const carregarInicio = () => {
    limparContainer(editorialConteudo);
    limparContainer(listaArtigos);

    if (txtUltimaEdicao) {
      txtUltimaEdicao.textContent = DADOS_INICIO.ultimaEdicao;
    }

    if (editorialConteudo && DADOS_INICIO.editorial) {
      const editorial = criarBlocoArtigo({
        titulo: DADOS_INICIO.editorial.titulo,
        autor: DADOS_INICIO.editorial.autor,
        link: DADOS_INICIO.editorial.pdf,
        resumo: DADOS_INICIO.editorial.resumo,
      });
      editorialConteudo.appendChild(editorial);
    }

    if (MOSTRAR_ARTIGOS && listaArtigos) {
      DADOS_INICIO.artigos.forEach((artigo) => {
        const item = criarBlocoArtigo({
          titulo: artigo.titulo,
          autor: artigo.autor,
          link: artigo.pdf,
          resumo: artigo.resumo,
        });
        listaArtigos.appendChild(item);
      });
    }
  };

  // ===== LÓGICA DO MODAL LOGIN =====
  const btnLogin = document.querySelector(".login-btn");
  const modal = document.getElementById("modalLogin");
  const btnFechar = document.getElementById("btnFecharModal");
  const btnOkLogin = document.getElementById("btnOkLogin");
  const inputEmail = document.getElementById("emailLogin");
  const inputSenha = document.getElementById("senhaLogin");
  let ultimoFoco = null;

  const abrirModal = () => {
    if (!modal) {
      return;
    }
    ultimoFoco = document.activeElement;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    requestAnimationFrame(() => {
      inputEmail?.focus();
    });
  };

  const fecharModal = () => {
    if (!modal) {
      return;
    }
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    if (ultimoFoco && typeof ultimoFoco.focus === "function") {
      ultimoFoco.focus();
    }
  };

  if (btnLogin) {
    btnLogin.addEventListener("click", abrirModal);
  }

  if (btnFechar) {
    btnFechar.addEventListener("click", fecharModal);
  }

  if (btnOkLogin) {
    const normalizarCredenciais = () => {
      const email = inputEmail?.value.trim() ?? "";
      const senha = inputSenha?.value.trim() ?? "";
      console.log("[login] credenciais recolhidas", { email, senhaLength: senha.length });
      return { email, senha };
    };

    const mensagemErroLogin = (erro) => {
      if (!erro || !erro.code) {
        return "Servidor indisponível / Falha de rede";
      }

      if (erro.code === "auth/invalid-credential" || erro.code === "auth/wrong-password" || erro.code === "auth/user-not-found") {
        return "Credenciais incorrectas";
      }

      if (erro.code === "auth/unauthorized-domain") {
        return "Resposta inválida do servidor";
      }

      return "Servidor indisponível / Falha de rede";
    };

    const tratarLogin = async () => {
      console.log("[login] início do processo");
      const { email, senha } = normalizarCredenciais();

      if (!email || !senha) {
        console.warn("[login] campos vazios");
        alert("Credenciais incorrectas");
        return;
      }

      try {
        console.log("[login] a autenticar no Firebase");
        await loginFirebase(email, senha);
        console.log("[login] login efectuado com sucesso");
        window.location.href = "gestor.html";
      } catch (erro) {
        console.error("[login] falha na autenticação", erro);
        alert(mensagemErroLogin(erro));
      }
    };

    btnOkLogin.addEventListener("click", tratarLogin);
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        fecharModal();
      }
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal?.classList.contains("is-open")) {
      fecharModal();
    }
  });

  carregarInicio();
});
