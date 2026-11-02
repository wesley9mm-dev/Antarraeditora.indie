/* Catálogo estático: administre livros e versões em dados/livros.json. */
"use strict";
const estadoLoja = {livros: [], genero: ""};
const ROTULOS_COMPRA = {"pt":"COMPRAR","en":"BUY","es":"COMPRAR","fr":"ACHETER","de":"KAUFEN","it":"ACQUISTA","ja":"購入する","ko":"구매하기","zh":"购买","ru":"КУПИТЬ","ar":"شراء","nl":"KOPEN"};
let sequenciaDialogo = 0;
function elemento(tag, classe, texto) {
  const el = document.createElement(tag);
  if (classe) el.className = classe;
  if (texto !== undefined) el.textContent = texto;
  return el;
}
function texto(valor) { return typeof valor === "string" ? valor.trim() : ""; }
function chave(valor) { return texto(valor).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR").replace(/\s+/g," "); }
function generoLivro(livro) { return texto(livro.genero) || "Outros"; }
function linkSeguro(link) {
  try {
    const url = new URL(link);
    return ["https:", "http:"].includes(url.protocol) && !url.username && !url.password ? url.href : null;
  } catch { return null; }
}
function capaSegura(capa) {
  const caminho = texto(capa);
  return /^capas\/[a-zA-Z0-9_./%\-]+\.(jpe?g|png|webp|svg)$/i.test(caminho) && !caminho.split("/").includes("..") ? caminho : "capas/prototipo.svg";
}
function preco(v) { return v.preco === "" || v.preco == null ? "" : [texto(v.moeda), String(v.preco)].filter(Boolean).join(" "); }
function rotuloCompra(v) { return texto(v.comprar) || ROTULOS_COMPRA[chave(v.codigo).split("-")[0]] || "COMPRAR"; }
function descricaoLivro(livro) { const v = livro.versoes[0]; return texto(v.descricaoCurta) || texto(livro.descricaoCurta) || texto(v.descricao) || texto(livro.descricao); }
function sinopseLivro(livro) { const v=livro.versoes[0]; return texto(v.sinopse) || texto(livro.sinopse) || texto(v.descricao) || texto(livro.descricao) || descricaoLivro(livro); }
function idLivro(livro) { return texto(livro.id) || [livro.versoes[0].titulo,livro.autor,livro.capa].join("|"); }

/* Único adaptador de popularidade. Substitua ler/registrar por um serviço
   remoto para ranking global. localStorage mede só este navegador. */
const popularidade = {
  memoria: Object.create(null),
  ler() {
    try {
      const dados=JSON.parse(localStorage.getItem("antarra:cliques:v1") || "{}");
      if (dados && typeof dados==="object" && !Array.isArray(dados)) {
        this.memoria=Object.assign(Object.create(null), ...Object.entries(dados).filter(([,n])=>Number.isSafeInteger(n)&&n>=0).map(([k,n])=>({[k]:n})));
      }
    } catch { /* Armazenamento bloqueado ou corrompido: usar memória. */ }
    return this.memoria;
  },
  registrar(id) {
    const dados=this.ler();
    dados[id]=Math.min((dados[id] || 0)+1,Number.MAX_SAFE_INTEGER);
    try { localStorage.setItem("antarra:cliques:v1",JSON.stringify(dados)); } catch { /* Catálogo continua utilizável. */ }
  }
};
function livrosDestaque(livros) {
  const cliques=popularidade.ler();
  return livros.map((livro,ordem)=>({livro,ordem,cliques:cliques[idLivro(livro)] || 0}))
    .sort((a,b)=>b.cliques-a.cliques || a.ordem-b.ordem).slice(0,4).map(item=>item.livro);
}
function registrarInteresse(livro) {
  popularidade.registrar(idLivro(livro));
  renderizarDestaques();
}
function criarCapa(livro) {
  const img=elemento("img");
  img.src=capaSegura(livro.capa); img.alt="Capa de "+livro.versoes[0].titulo;
  img.width=360; img.height=500; img.loading="lazy";
  img.addEventListener("error",()=>{img.src="capas/prototipo.svg";},{once:true});
  return img;
}
function criarLink(v, classe, rotulo) {
  const url=linkSeguro(v.link);
  if (!url) return elemento("span",classe+" unavailable","Indisponível");
  const a=elemento("a",classe,rotulo); a.href=url;
  if(texto(v.codigo)) { a.hreflang=v.codigo; a.lang=v.codigo; }
  a.dir="auto";
  return a;
}
function abrirDialogo(titulo,origem,classe) {
  const dialogo=elemento("dialog",classe || "");
  const cabecalho=elemento("div","dialog-heading");
  const fechar=elemento("button","close","Fechar");
  fechar.type="button"; fechar.setAttribute("aria-label","Fechar painel");
  const h2=elemento("h2","",titulo);h2.id="dialogo-"+(++sequenciaDialogo);
  dialogo.setAttribute("aria-labelledby",h2.id); cabecalho.append(h2,fechar);dialogo.append(cabecalho);
  fechar.addEventListener("click",()=>dialogo.close());
  dialogo.addEventListener("keydown",e=>{
    if(e.key!=="Tab")return;
    const itens=[...dialogo.querySelectorAll('button:not([disabled]),a[href],[tabindex="0"]')];
    const primeiro=itens[0],ultimo=itens[itens.length-1];
    if(e.shiftKey && document.activeElement===primeiro){e.preventDefault();ultimo?.focus();}
    else if(!e.shiftKey && document.activeElement===ultimo){e.preventDefault();primeiro?.focus();}
  });
  dialogo.addEventListener("click",e=>{
    if(e.target!==dialogo)return;
    const r=dialogo.getBoundingClientRect();
    if(e.clientX<r.left || e.clientX>r.right || e.clientY<r.top || e.clientY>r.bottom)dialogo.close();
  });
  dialogo.addEventListener("close",()=>{
    dialogo.remove();
    if(!document.querySelector("dialog[open]")) document.body.classList.remove("modal-open");
    if(origem?.isConnected) origem.focus();
    else {
      const id=origem?.closest(".book")?.dataset.livro;
      const card=[...document.querySelectorAll(".book")].find(c=>c.dataset.livro===id);
      (card?.querySelector(".book-open") || document.querySelector("[data-catalogo] button"))?.focus();
    }
  },{once:true});
  document.body.append(dialogo);document.body.classList.add("modal-open");
  // showModal fornece foco contido no painel e fechamento nativo com Escape.
  dialogo.showModal();fechar.focus();
  return dialogo;
}
function escolherIdioma(livro,origem) {
  const d=abrirDialogo("Escolha sua versão",origem,"versions-dialog");
  livro.versoes.forEach(v=>{
    const linha=elemento("section","version-row");
    const h=elemento("h3","",texto(v.idioma) || texto(v.codigo) || "Versão");
    h.dir="auto";
    linha.append(h,elemento("p","version-title",v.titulo));
    if(preco(v))linha.append(elemento("p","price",preco(v)));
    linha.append(criarLink(v,"button",rotuloCompra(v))); d.append(linha);
  });
  return d;
}
function criarBotaoCompra(livro,{contar=true}={}) {
  const disponiveis=livro.versoes.filter(v=>linkSeguro(v.link));
  let botao;
  if(livro.prototipo || !disponiveis.length) {
    botao=elemento("button","button","Indisponível");botao.disabled=true;
  } else if(disponiveis.length===1) {
    botao=criarLink(disponiveis[0],"button",rotuloCompra(disponiveis[0]));
  } else {
    botao=elemento("button","button","COMPRAR");botao.type="button";
    botao.addEventListener("click",()=>escolherIdioma(livro,botao));
  }
  if(contar)botao.addEventListener("click",()=>registrarInteresse(livro));
  return botao;
}
function abrirLivro(livro,origem) {
  // Conte uma interação, sem contar novamente a compra feita neste painel.
  registrarInteresse(livro);
  const d=abrirDialogo(livro.versoes[0].titulo,origem,"book-dialog");
  const grade=elemento("div","book-details");
  grade.append(criarCapa(livro));
  const info=elemento("div","details-copy");
  if(texto(livro.autor))info.append(elemento("p","author",livro.autor));
  info.append(elemento("p","badge",generoLivro(livro)));
  const curta=descricaoLivro(livro),sinopse=sinopseLivro(livro);
  if(curta)info.append(elemento("p","description-short",curta));
  if(sinopse && sinopse!==curta)info.append(elemento("h3","","Sinopse"),elemento("p","synopsis",sinopse));
  const metadados=elemento("dl","book-metadata");
  const idioma=texto(livro.idiomaOriginal);
  let nomeIdioma=idioma;
  try{ if(idioma)nomeIdioma=new Intl.DisplayNames(["pt-BR"],{type:"language"}).of(idioma) || idioma; }catch{}
  const pares=[["Páginas",livro.paginas],["Formato",livro.formato],["Idioma original",nomeIdioma]];
  pares.forEach(([termo,valor])=>{if(valor!==undefined && valor!==null && String(valor).trim()!=="")metadados.append(elemento("dt","",termo),elemento("dd","",String(valor)));});
  if(metadados.children.length)info.append(metadados);
  const idiomas=livro.versoes.filter(v=>linkSeguro(v.link)).map(v=>texto(v.idioma)||texto(v.codigo)).filter(Boolean);
  if(idiomas.length)info.append(elemento("p","available-languages","Disponível em: "+[...new Set(idiomas)].join(" • ")));
  const primeira=livro.versoes.find(v=>linkSeguro(v.link)) || livro.versoes[0];
  if(preco(primeira))info.append(elemento("p","price",(livro.versoes.length>1 ? (texto(primeira.idioma)||"Versão principal")+" · ":"")+preco(primeira)));
  info.append(criarBotaoCompra(livro,{contar:false}));grade.append(info);d.append(grade);
  return d;
}
function criarLivro(livro) {
  const card=elemento("article","book");card.dataset.livro=idLivro(livro);
  const abrir=elemento("button","book-open");
  abrir.type="button";abrir.setAttribute("aria-label","Ver detalhes de "+livro.versoes[0].titulo);
  abrir.append(criarCapa(livro));
  const titulo=elemento("h3","",livro.versoes[0].titulo);
  const tituloBotao=elemento("button","title-open",livro.versoes[0].titulo);titulo.replaceChildren(tituloBotao);tituloBotao.type="button";
  abrir.addEventListener("click",()=>abrirLivro(livro,abrir));
  tituloBotao.addEventListener("click",()=>abrirLivro(livro,tituloBotao));
  const info=elemento("div","book-copy");
  info.append(elemento("span","badge",generoLivro(livro)),titulo);
  if(texto(livro.autor))info.append(elemento("p","author",livro.autor));
  if(descricaoLivro(livro))info.append(elemento("p","card-description",descricaoLivro(livro)));
  const v=livro.versoes[0];
  if(preco(v))info.append(elemento("p","price",(livro.versoes.length>1 ? (texto(v.idioma)||"Versão principal")+" · ":"")+preco(v)));
  info.append(criarBotaoCompra(livro));card.append(abrir,info);
  // Espaço livre do cartão também abre detalhes, sem interferir em seleção de texto ou links.
  card.addEventListener("click",e=>{
    if(e.target.closest("button,a"))return;
    if(window.getSelection?.().toString())return;
    abrirLivro(livro,abrir);
  });
  return card;
}
function generosDisponiveis(livros) {
  const unicos=new Map();
  livros.forEach(l=>{const g=generoLivro(l);if(!unicos.has(chave(g)))unicos.set(chave(g),g);});
  return [...unicos.values()].sort((a,b)=>a.localeCompare(b,"pt-BR"));
}
function temaGenero(genero) {
  const g=chave(genero);
  const temas={"romance":"romance","misterio":"misterio","ficcao cientifica":"ficcao","aventura":"aventura","drama":"drama","reflexao":"reflexao","desenvolvimento pessoal":"reflexao"};
  return temas[g] || "padrao";
}
function aplicarTema(genero) {
  document.body.dataset.tema=temaGenero(genero);
}
function renderizarArea(area,livros) {
  area.replaceChildren();
  if(!livros.length)area.append(elemento("p","empty-catalog","Nenhum livro disponível no catálogo."));
  livros.forEach(l=>area.append(criarLivro(l)));
}
function renderizarDestaques() {
  document.querySelectorAll('[data-catalogo="destaques"]').forEach(area=>renderizarArea(area,livrosDestaque(estadoLoja.livros)));
}
function filtrarGenero(genero,atualizarUrl=true) {
  estadoLoja.genero=genero;aplicarTema(genero);
  const filtrados=estadoLoja.livros.filter(l=>!genero || chave(generoLivro(l))===chave(genero));
  document.querySelectorAll('[data-catalogo="todos"]').forEach(area=>renderizarArea(area,filtrados));
  const titulo=document.querySelector("[data-filtro-titulo]");if(titulo)titulo.textContent=genero || "Todos os livros";
  const contagem=document.querySelector("[data-contagem]");if(contagem)contagem.textContent=filtrados.length+" "+(filtrados.length===1?"livro":"livros");
  document.querySelectorAll("[data-genero]").forEach(b=>b.setAttribute("aria-pressed",String(chave(b.dataset.genero)===chave(genero))));
  if(atualizarUrl) {
    const url=new URL(window.location.href);
    if(genero)url.searchParams.set("genero",genero);else url.searchParams.delete("genero");
    history.replaceState(null,"",url);
  }
}
function montarGeneros() {
  const generos=generosDisponiveis(estadoLoja.livros);
  const home=document.querySelector("[data-generos-home]");
  if(home) {
    home.replaceChildren();
    generos.forEach(g=>{
      const a=elemento("a","genre-chip",g);a.href="livros.html?"+new URLSearchParams({genero:g});home.append(a);
    });
    const vazio=document.querySelector("[data-generos-vazio]");if(vazio)vazio.hidden=generos.length>0;
    document.querySelectorAll("[data-scroll-generos]").forEach(b=>{
      b.disabled=!generos.length;
      b.addEventListener("click",()=>home.scrollBy({left:Number(b.dataset.scrollGeneros)*Math.max(200,home.clientWidth*.7),behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth"}));
    });
  }
  const menu=document.querySelector("[data-generos-filtro]");
  if(menu) {
    menu.replaceChildren();
    ["",...generos].forEach(g=>{
      const b=elemento("button","genre-chip",g || "Todos os livros");b.type="button";b.dataset.genero=g;
      b.addEventListener("click",()=>filtrarGenero(g));menu.append(b);
    });
    const pedido=new URL(window.location.href).searchParams.get("genero") || "";
    filtrarGenero(generos.find(g=>chave(g)===chave(pedido)) || "",false);
  }
}
function validarCatalogo(livros) {
  if(!Array.isArray(livros) || livros.some(l=>!l || typeof l!=="object" || !Array.isArray(l.versoes) || !l.versoes.length || l.versoes.some(v=>!v || typeof v.titulo!=="string" || !v.titulo.trim())))throw new Error("Revise os livros e as versões no JSON.");
  const ids=livros.map(idLivro);
  if(new Set(ids).size!==ids.length)throw new Error("Use um id diferente para cada livro.");
  return livros.filter(l=>!l.prototipo);
}
async function carregarCatalogo() {
  const areas=document.querySelectorAll("[data-catalogo]");
  if(!areas.length)return;
  try {
    const resposta=await fetch("dados/livros.json");
    if(!resposta.ok)throw new Error("Catálogo indisponível");
    estadoLoja.livros=validarCatalogo(await resposta.json());
    renderizarDestaques();montarGeneros();
  }catch(erro) {
    areas.forEach(area=>area.replaceChildren(elemento("p","","Não foi possível carregar a estante. Tente novamente mais tarde.")));
    console.error("Catálogo:",erro);
  }
}
window.addEventListener("storage",e=>{if(e.key==="antarra:cliques:v1"){popularidade.memoria=Object.create(null);renderizarDestaques();}});
carregarCatalogo();
