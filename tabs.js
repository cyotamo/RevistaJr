document.addEventListener("DOMContentLoaded", () => {
  const WEB_APP_URL =
    "https://script.google.com/macros/s/AKfycbyvj-DF7IYQh1fn9AFxQhiLLLGe1ssudIhUZzjigarcjyI3vc_z9-nG09sAFwMtDnwvXw/exec";
  const ENDPOINT_ULTIMA_EDICAO = `${WEB_APP_URL}?acao=ultEdicao`;

  const txtUltimaEdicao = document.getElementById("txtUltimaEdicao");
  const editorialConteudo = document.getElementById("editorialConteudo");
  const listaArtigos = document.getElementById("listaArtigos");

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

  const carregarInicio = async () => {
    limparContainer(editorialConteudo);
    limparContainer(listaArtigos);

    try {
      const response = await fetch(ENDPOINT_ULTIMA_EDICAO, {
        cache: "no-store",
      });
      const payload = await response.json();

      if (!payload || payload.sucesso === false) {
        console.error("Erro ao carregar última edição.");
        return;
      }

      const dados = payload.dados;
      if (!dados) {
        console.error("Resposta sem dados da última edição.");
        return;
      }

      renderizarUltimaEdicao(dados);
      renderizarEditorial(dados.editorial || {});
      renderizarArtigos(Array.isArray(dados.artigos) ? dados.artigos : []);
    } catch (erro) {
      console.error("Erro ao carregar última edição:", erro);
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
