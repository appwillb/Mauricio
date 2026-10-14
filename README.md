# Flyers Instagram Story

Gerador de flyers 1080x1920 (formato Story) em PNG, estilo moderno/gradiente.

## Como gerar

```bash
node generate.js
```

Saída na pasta `flyers/`:
- `01-habitos.png`
- `02-erro-comum.png`
- `03-conteudo-que-vende.png`

## Personalizar

Edite o texto em `generate.js` (função `templates`). Cada flyer tem:
- `badge(...)` — etiqueta no topo
- `lines(...)` — título em múltiplas linhas
- `card(...)` — cartões de conteúdo
- `cta(...)` — botão do fim
- `handle(...)` — @usuário

As fontes ficam em `assets/fonts/`.
