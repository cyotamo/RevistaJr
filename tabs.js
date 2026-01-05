document.addEventListener("DOMContentLoaded", () => {
  const DADOS_INICIO = {
    ultimaEdicao: "2026/1",
    editorial: {
      titulo: "Editorial",
      pdf: "https://exemplo.com/editorial.pdf",
    },
    artigos: [
      {
        titulo: "Título do Artigo Exemplo 1",
        autor: "Nome do Autor 1",
        pdf: "https://exemplo.com/artigo1.pdf",
      },
      {
        titulo: "Título do Artigo Exemplo 2",
        autor: "Nome do Autor 2",
        pdf: "https://exemplo.com/artigo2.pdf",
      },
      {
        titulo: "Título do Artigo Exemplo 3",
        autor: "Nome do Autor 3",
        pdf: "https://exemplo.com/artigo3.pdf",
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

  const criarBlocoArtigo = ({ titulo, autor, link }) => {
    const item = document.createElement("div");
    item.classList.add("artigo-bloco");

    const tituloElemento = document.createElement("h4");
    tituloElemento.classList.add("artigo-titulo");
    tituloElemento.textContent = titulo ?? "";
    item.appendChild(tituloElemento);

    const autorElemento = document.createElement("p");
    autorElemento.classList.add("artigo-autores");
    autorElemento.textContent = autor ?? "";
    item.appendChild(autorElemento);

    const botao = criarLinkBaixar(link);
    if (botao) {
      item.appendChild(botao);
    }

    return item;
  };

  const renderizarUltimaEdicao = (dados) => {
    if (!txtUltimaEdicao) return;
    txtUltimaEdicao.textContent = `Última Edição: ${dados.ultimaEdicao}`;
  };

  const renderizarEditorial = (editorial) => {
    if (!editorialConteudo) return;
    limparContainer(editorialConteudo);

    const item = criarBlocoArtigo({
      titulo: editorial.titulo,
      autor: editorial.autor,
      link: editorial.link,
    });

    editorialConteudo.appendChild(item);
  };

  const renderizarArtigos = (artigos) => {
    if (!listaArtigos) return;
    limparContainer(listaArtigos);

    artigos.forEach((artigo) => {
      const item = criarBlocoArtigo({
        titulo: artigo.titulo,
        autor: artigo.autor,
        link: artigo.link,
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
      "Esta plataforma é um espaço institucional destinado à divulgação e valorização da produção científica desenvolvida na Faculdade. Tem como foco principal os Trabalhos de Conclusão de Curso (TCC), integrando igualmente artigos científicos, projectos de investigação, relatórios técnicos, monografias e outras produções académicas relevantes.",
      "O seu objectivo é promover a investigação científica, facilitar o acesso ao conhecimento produzido e reforçar a visibilidade do trabalho académico de estudantes, docentes e investigadores, contribuindo para o fortalecimento da qualidade científica e da memória institucional da Faculdade.",
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
      txtUltimaEdicao.textContent = `Última Edição: ${DADOS_INICIO.ultimaEdicao}`;
    }

    if (editorialConteudo && DADOS_INICIO.editorial) {
      const editorial = criarBlocoArtigo({
        titulo: DADOS_INICIO.editorial.titulo,
        autor: DADOS_INICIO.editorial.autor,
        link: DADOS_INICIO.editorial.pdf,
      });
      editorialConteudo.appendChild(editorial);
    }

    if (listaArtigos) {
      DADOS_INICIO.artigos.forEach((artigo) => {
        const item = criarBlocoArtigo({
          titulo: artigo.titulo,
          autor: artigo.autor,
          link: artigo.pdf,
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

  btnLogin.addEventListener("click", () => {
    modal.style.display = "flex";
  });

  btnFechar.addEventListener("click", () => {
    modal.style.display = "none";
  });

  if (btnOkLogin) {
    btnOkLogin.addEventListener("click", () => {
      const email = document.getElementById("emailLogin").value;
      const senha = document.getElementById("senhaLogin").value;

      loginFirebase(email, senha)
        .then(() => {
          window.location.href = "gestor.html";
        })
        .catch(() => {
          alert("Email ou senha incorrectos");
        });
    });
  }

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  carregarInicio();
});
