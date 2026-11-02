# Antarrá Editora
Base simples da livraria digital, sem instalação de pacotes e sem ferramentas de compilação.

## Abrir no computador
1. Baixe o repositório (Code → Download ZIP) e extraia a pasta.
2. Abra a pasta no Visual Studio Code.
3. Instale a extensão **Live Server**, de Ritwick Dey.
4. Clique com o botão direito em `index.html` e escolha **Open with Live Server**.

Abra pelo servidor: dar dois cliques no HTML pode impedir o carregamento do JSON.

## Onde editar
- `dados/livros.json`: livros, versões, preços e links.
- `capas/`: imagens de capa.
- `index.html`, `livros.html`, `sobre.html`, `contato.html`: textos das páginas.
- `css/style.css`: cores e aparência.
- `js/loja.js`: carrega o catálogo automaticamente; não precisa editar ao adicionar livros.

## O exemplo atual
O exemplo permanece no JSON para você copiar, mas não aparece no site enquanto tiver `prototipo: true`. A página inicial usa uma ilustração editorial independente do catálogo.
Você pode substituir a capa por JPG, PNG, WebP ou SVG. O nome e as letras maiúsculas/minúsculas do caminho devem coincidir com o arquivo.

## Adicionar seu primeiro livro
1. Coloque a capa em `capas/`, por exemplo `meu-livro.jpg`.
2. Abra `dados/livros.json`.
3. Substitua o objeto de protótipo pelo modelo abaixo.
4. Troque os textos, preço e link pelo checkout real. Mantenha `prototipo: false`.
5. Salve e atualize o navegador. No site publicado, envie também os arquivos alterados ao GitHub.

```json
[
  {
    "id": "meu-livro",
    "capa": "capas/meu-livro.jpg",
    "autor": "Seu nome",
    "prototipo": false,
    "versoes": [
      {
        "idioma": "Português",
        "codigo": "pt-BR",
        "titulo": "Título do livro",
        "descricao": "Escreva aqui uma sinopse curta.",
        "preco": "29,90",
        "moeda": "R$",
        "comprar": "Comprar",
        "link": "https://pay.hotmart.com/SEU-CODIGO"
      }
    ]
  }
]
```

O endereço acima é um modelo: substitua pelo seu link verdadeiro. Preço é texto: mantenha as aspas. O checkout é quem determina o valor cobrado; atualize o valor exibido no site quando mudar o checkout.

## Adicionar outro livro
Copie todo o bloco entre `{` e `}` de um livro, incluindo `versoes`.
Cole depois do primeiro livro, dentro dos colchetes externos `[ ]`.
Separe os livros com uma vírgula. Dê a cada livro um `id` diferente.
Não coloque vírgula depois do último livro.

Estrutura resumida (apenas explicação, não cole no JSON):
```text
[
  { primeiro livro },
  { segundo livro }
]
```

## Adicionar outro idioma ao mesmo livro
Dentro de `versoes`, coloque uma vírgula depois da versão em português e cole este segundo objeto.
Não crie outro livro nem outra página HTML.

```json
{
  "idioma": "English",
  "codigo": "en",
  "titulo": "Book title",
  "descricao": "A short description in English.",
  "preco": "9.90",
  "moeda": "US$",
  "comprar": "Buy",
  "link": "https://pay.hotmart.com/SEU-CODIGO-EN"
}
```

- Uma versão: o botão leva diretamente ao link.
- Várias versões: o botão abre um seletor com idioma, título e preço de cada versão.
- O cartão usa título e descrição da primeira versão; o seletor mostra os dados das demais.
- O campo `comprar` personaliza o botão de compra da versão. Sem ele, o texto é traduzido automaticamente pelo `codigo`.
- Link vazio ou inválido: versão indisponível. Use links completos começando com `https://`.
- `prototipo: true` oculta o livro do catálogo público. Use `false` para publicar seu livro.
- Para deixar a estante vazia, use apenas `[]`.

## Cuidados com o JSON
Use aspas duplas, separe objetos com vírgulas e não escreva comentários no arquivo.
Se colocar aspas em um título, coloque uma barra invertida antes de cada aspa interna.
Se a estante mostrar erro depois de editar, confira as vírgulas, aspas e colchetes.
Não inclua arquivos PDF pagos neste repositório público; cadastre a entrega do produto na plataforma de vendas.

## Cores e contato
As cores ficam no início de `css/style.css`: marinho, azul real, ciano, branco-gelo e lavanda.
A arte genérica usa apenas formas geométricas, sem personagens ou elementos de Hollow Knight.
Em `contato.html`, adicione seus canais oficiais de atendimento.
Não há formulário nem endereço de e-mail fictício.

## Publicar no GitHub Pages (opcional)
No GitHub, abra Settings → Pages → Deploy from a branch → main → / (root) → Save.
Aguarde o GitHub fornecer o endereço. Todos os caminhos são relativos, compatíveis com a subpasta do repositório.
Não é necessário ativar hospedagem para editar os arquivos.

## Conferir depois de uma alteração
Abra Início e Livros pelo Live Server; confira capa, título, preço e link.
Teste também a largura de celular e, ao cadastrar traduções, abra o seletor e confira cada destino.

## Campos adicionais do catálogo

Você continua administrando os livros somente no JSON. Os campos novos são opcionais:

```json
{
  "id": "modelo-para-copiar",
  "capa": "capas/meu-livro.jpg",
  "autor": "Seu nome",
  "genero": "Romance",
  "descricaoCurta": "Texto breve para o cartão.",
  "sinopse": "Sinopse completa para o painel de detalhes.",
  "paginas": 320,
  "formato": "PDF",
  "idiomaOriginal": "pt-BR",
  "prototipo": false,
  "versoes": [
    {
      "idioma": "Português (Brasil)",
      "codigo": "pt-BR",
      "titulo": "Título do livro",
      "preco": "29,90",
      "moeda": "R$",
      "link": "https://pay.hotmart.com/SEU-CODIGO"
    }
  ]
}
```

Este bloco representa um livro: coloque-o dentro da lista externa do arquivo, separado dos demais por vírgula. Não cadastre o exemplo como produto real.

- `genero`: uma categoria por livro. Os filtros e as categorias da página inicial são automáticos. Sem gênero, o livro entra em Outros. Diferenças de maiúsculas, acentos e espaços não geram categorias duplicadas.
- `descricaoCurta` e `sinopse`: podem ficar no livro ou na versão. O texto da primeira versão tem preferência quando existir; `descricao` antiga continua funcionando como alternativa.
- `paginas`, `formato` e `idiomaOriginal`: aparecem no painel apenas quando preenchidos.
- A primeira versão fornece o título e a apresentação do cartão. Cada versão mantém preço e checkout próprios.
- Só uma versão com link válido: compra direta. Duas ou mais versões com links válidos: seletor de idiomas. Versões sem link aparecem indisponíveis no seletor.
- Nenhuma versão com link válido: compra desativada. O livro ainda pode ter seus detalhes consultados.
- O campo `comprar` é opcional. Há traduções automáticas para pt-BR, en, es, fr, de, it, ja, ko, zh-CN, ru, ar e nl.
- Novos gêneros recebem um tema neutro automaticamente. Romance, Mistério, Ficção Científica, Aventura, Drama, Reflexão e Desenvolvimento Pessoal possuem cores sutis próprias.
- A página Contato continua disponível pelo endereço direto, mas saiu do menu principal.

## Destaques automáticos

A página inicial exibe até quatro livros, ordenados pelos cliques registrados no navegador. Sem contagem ou em empates, vale a ordem do JSON.

Uma abertura de detalhes ou clique de compra no cartão conta como interesse. Uma compra feita depois de abrir os detalhes não conta novamente. Fechar o painel não conta como clique. Os números não são apresentados como estatística pública.

Esta primeira implementação usa `localStorage`: **não soma os visitantes do site**. Cada navegador tem seu próprio histórico. Limpar os dados do site zera esse histórico. Se o armazenamento estiver bloqueado, o site continua funcionando com memória temporária. O adaptador `popularidade` em `js/loja.js` concentra a leitura e gravação para futura integração com serviço remoto.

## Conferência dos novos recursos

Use um livro visível de teste somente em uma cópia local. Confira gênero novo, título longo, sinopse longa, 1/2/5 idiomas, links vazios, capa ausente e teclado. O painel fecha por Fechar, Escape ou clique fora. No celular, os gêneros viram lista horizontal; use toque ou a barra de rolagem. Na página inicial, as setas também permitem navegar pelos gêneros.

O catálogo público permanece sem livros reais até você substituir o exemplo oculto. Não publique os dados fictícios usados em testes.
