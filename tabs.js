document.addEventListener("DOMContentLoaded", () => {
  const DADOS_INICIO = {
    ultimaEdicao: "2026/1",
    editorial: {
      titulo: "Editorial",
      autor: "Prof. Dr. Cremildo José Yotamo",
      pdf: "https://exemplo.com/editorial.pdf",
    },
    artigos: [
      {
        titulo: "Impacto das Microfinanças no Rendimento das Famílias Urbanas no Município de Nampula (2019–2023)",
        autor: "Armindo Joaquim Mussa",
        pdf: "https://exemplo.com/artigo1.pdf",
      },
      {
        titulo: "Determinantes do Crescimento das Pequenas e Médias Empresas na Cidade de Maputo no Período Pós-COVID-19 (2020–2022)",
        autor: "Helena Maria Chale",
        pdf: "https://exemplo.com/artigo2.pdf",
      },
      {
        titulo: "Efeitos da Política Monetária do Banco de Moçambique na Inflação Nacional (2015–2022)",
        autor: "Carlos Alberto Macamo",
        pdf: "https://exemplo.com/artigo3.pdf",
      },
      {
        titulo: "Práticas de Gestão Estratégica e Desempenho das Empresas Familiares do Sector Comercial na Província de Nampula (2018–2022)",
        autor: "Lídia Ernesto Nhampossa",
        pdf: "https://exemplo.com/artigo4.pdf",
      },
      {
        titulo: "Influência da Cultura Organizacional na Motivação dos Trabalhadores das Empresas Privadas da Cidade de Maputo (2019–2021)",
        autor: "Nelson Tomás Langa",
        pdf: "https://exemplo.com/artigo5.pdf",
      },
      {
        titulo: "Gestão de Recursos Humanos e Produtividade Docente nas Instituições Públicas de Ensino Superior em Moçambique (2017–2022)",
        autor: "Rosa Amélia Cossa",
        pdf: "https://exemplo.com/artigo6.pdf",
      },
      {
        titulo: "Qualidade da Informação Contabilística e Tomada de Decisão nas Pequenas e Médias Empresas da Cidade de Nampula (2018–2022)",
        autor: "Paulo Sérgio Matavele",
        pdf: "https://exemplo.com/artigo7.pdf",
      },
      {
        titulo: "Eficácia do Sistema de Controlo Interno na Prevenção de Fraudes nas Empresas Comerciais de Maputo (2019–2023)",
        autor: "Ana Paula Nhantumbo",
        pdf: "https://exemplo.com/artigo8.pdf",
      },
      {
        titulo: "Descentralização Administrativa e Qualidade da Prestação de Serviços Públicos no Distrito de Ribáuè, Província de Nampula (2016–2021)",
        autor: "Eusébio Francisco Mucavel",
        pdf: "https://exemplo.com/artigo9.pdf",
      },
      {
        titulo: "Transparência na Gestão Pública e Combate à Corrupção nos Conselhos Municipais de Moçambique (2015–2022)",
        autor: "Julieta Teresa Mabunda",
        pdf: "https://exemplo.com/artigo10.pdf",
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

  const criarBlocoArtigo = ({ titulo, autor, link, resumo, imagem, artigoIndex }) => {
    const item = document.createElement("div");
    item.classList.add("artigo-card");

    const thumb = document.createElement("div");
    thumb.classList.add("artigo-thumb");

    const imagemElemento = document.createElement("img");
    const imagemPadrao = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><rect width='100%25' height='100%25' fill='%23f0f0f0'/><text x='50%25' y='50%25' font-size='18' text-anchor='middle' fill='%23999' dy='.3em'>Sem imagem</text></svg>";
    const caminhoImagem = imagem ?? (artigoIndex ? `assets/thumbs/art${artigoIndex}.jpg` : null);
    imagemElemento.src = caminhoImagem ?? imagemPadrao;
    imagemElemento.alt = "Imagem do artigo";
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
    txtUltimaEdicao.textContent = `Última Edição: ${dados.ultimaEdicao}`;
  };

  const renderizarEditorial = (editorial) => {
    if (!editorialConteudo) return;
    limparContainer(editorialConteudo);

    const item = criarBlocoArtigo({
      titulo: editorial.titulo,
      autor: editorial.autor,
      link: editorial.link,
      resumo: editorial.resumo,
      imagem: "assets/thumbs/editorial.jpg",
    });

    editorialConteudo.appendChild(item);
  };

  const renderizarArtigos = (artigos) => {
    if (!listaArtigos) return;
    limparContainer(listaArtigos);

    artigos.forEach((artigo, index) => {
      const item = criarBlocoArtigo({
        titulo: artigo.titulo,
        autor: artigo.autor,
        link: artigo.link,
        resumo: artigo.resumo,
        artigoIndex: index + 1,
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
      "Esta plataforma é um espaço institucional destinado à divulgação e valorização da produção científica desenvolvida na Faculdade. Tem como foco principal a publicação de pesquisas oriundas dos Trabalhos de Conclusão de Curso (TCC) defendidos na faculdade, integrando igualmente outros tipos de pesquisas científicas, projectos de investigação, relatórios técnicos relevantes.",
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
      txtUltimaEdicao.textContent = `Última Edição: ${DADOS_INICIO.ultimaEdicao}`;
    }

    if (editorialConteudo && DADOS_INICIO.editorial) {
      const editorial = criarBlocoArtigo({
        titulo: DADOS_INICIO.editorial.titulo,
        autor: DADOS_INICIO.editorial.autor,
        link: DADOS_INICIO.editorial.pdf,
        resumo: DADOS_INICIO.editorial.resumo,
        imagem: "assets/thumbs/editorial.jpg",
      });
      editorialConteudo.appendChild(editorial);
    }

    if (listaArtigos) {
      DADOS_INICIO.artigos.forEach((artigo, index) => {
        const item = criarBlocoArtigo({
          titulo: artigo.titulo,
          autor: artigo.autor,
          link: artigo.pdf,
          resumo: artigo.resumo,
          artigoIndex: index + 1,
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
