/* Edite o catálogo em dados/livros.json. Não é necessário alterar este arquivo. */
"use strict";
function elemento(tag, classe, texto) {
  const el = document.createElement(tag);
  if (classe) el.className = classe;
  if (texto !== undefined) el.textContent = texto;
  return el;
}
function linkSeguro(link) {
  try {
    const url = new URL(link);
    return ["https:", "http:"].includes(url.protocol) ? url.href : null;
  } catch { return null; }
}
function preco(versao) {
  return versao.preco === "" || versao.preco == null ? "" : [versao.moeda, versao.preco].filter(Boolean).join(" ");
}
function criarLink(versao, classe, texto) {
  const url = linkSeguro(versao.link);
  if (!url) {
    const indisponivel = elemento("span", classe, versao.idioma + " — indisponível");
    return indisponivel;
  }
  const a = elemento("a", classe, texto);
  a.href = url;
  if (versao.codigo) a.hreflang = versao.codigo;
  return a;
}
function escolherIdioma(livro, origem) {
  const dialogo = elemento("dialog");
  const fechar = elemento("button", "close", "Fechar");
  fechar.type = "button";
  const titulo = elemento("h2", "", "Escolha o idioma");
  titulo.id = "titulo-idiomas";
  dialogo.setAttribute("aria-labelledby", titulo.id);
  dialogo.append(fechar, titulo);
  livro.versoes.forEach(v => {
    dialogo.append(criarLink(v, "language", [v.idioma, v.titulo, preco(v)].filter(Boolean).join(" · ")));
  });
  fechar.addEventListener("click", () => dialogo.close());
  dialogo.addEventListener("click", e => { if (e.target === dialogo) {
    const r = dialogo.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialogo.close();
  }});
  dialogo.addEventListener("close", () => { dialogo.remove(); origem.focus(); }, {once:true});
  document.body.append(dialogo);
  dialogo.showModal();
}
function criarLivro(livro) {
  const versao = livro.versoes[0];
  const card = elemento("article", "book");
  const img = elemento("img");
  img.src = livro.capa || "capas/prototipo.svg";
  img.alt = "Capa de " + versao.titulo;
  img.width = 360; img.height = 500; img.loading = "lazy";
  img.addEventListener("error", () => { img.src = "capas/prototipo.svg"; }, {once:true});
  const info = elemento("div");
  info.append(elemento("span", "badge", livro.prototipo ? "Protótipo · não está à venda" : "Livro digital"));
  info.append(elemento("h3", "", versao.titulo));
  if (livro.autor) info.append(elemento("p", "author", livro.autor));
  info.append(elemento("p", "", versao.descricao));
  if (!livro.prototipo && preco(versao)) info.append(elemento("p", "price", (livro.versoes.length > 1 ? versao.idioma + " · " : "") + preco(versao)));
  let botao;
  if (livro.prototipo || (livro.versoes.length === 1 && !linkSeguro(versao.link))) {
    botao = elemento("button", "button", "Indisponível");
    botao.disabled = true;
  } else if (livro.versoes.length === 1) {
    botao = criarLink(versao, "button", versao.comprar || "Comprar");
  } else {
    botao = elemento("button", "button", "Comprar · escolher idioma");
    botao.type = "button";
    botao.addEventListener("click", () => escolherIdioma(livro, botao));
  }
  info.append(botao); card.append(img, info);
  return card;
}
async function carregarCatalogo() {
  const areas = document.querySelectorAll("[data-catalogo]");
  if (!areas.length) return;
  try {
    const resposta = await fetch("dados/livros.json");
    if (!resposta.ok) throw new Error("Catálogo indisponível");
    const livros = await resposta.json();
    if (!Array.isArray(livros) || livros.some(l => !l || !Array.isArray(l.versoes) || !l.versoes.length || l.versoes.some(v => !v || typeof v.titulo !== "string"))) throw new Error("Revise os livros e suas versões no JSON");
    areas.forEach(area => {
      area.replaceChildren();
      const publicados = livros.filter(livro => !livro.prototipo);
      if (!publicados.length) area.append(elemento("p", "", "Nenhum livro disponível no catálogo."));
      publicados.forEach(livro => area.append(criarLivro(livro)));
    });
  } catch (erro) {
    areas.forEach(area => area.replaceChildren(elemento("p", "", "Não foi possível carregar a estante. Tente novamente mais tarde.")));
    console.error("Catálogo:", erro);
  }
}
carregarCatalogo();
