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
- O campo `comprar` personaliza o botão quando há uma versão.
- Link vazio ou inválido: versão indisponível. Use links completos começando com `https://`.
- `prototipo: true` oculta o livro do catálogo público. Use `false` para publicar seu livro.
- Para deixar a estante vazia, use apenas `[]`.

## Cuidados com o JSON
Use aspas duplas, separe objetos com vírgulas e não escreva comentários no arquivo.
Se colocar aspas em um título, escreva `\\"` dentro do texto.
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
