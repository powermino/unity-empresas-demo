# Unity Empresas — site institucional (projeto conceitual demonstrativo)

Proposta visual para apresentação comercial à Unity Empresas.
Stack: **React 18 · Vite 6 · Tailwind CSS 3 · GSAP + ScrollTrigger · Three.js + React Three Fiber · Lucide**.

## Rodar

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # gera /dist (estático)
npm run preview    # serve o build localmente
```

Requer Node 18+.

## Estrutura

```
├─ index.html                 SEO, Open Graph, JSON-LD (Organization)
├─ public/
│  ├─ assets/                 imagens oficiais (baixadas de unityempresas.com.br)
│  ├─ favicon.svg             provisório: trocar pelo favicon oficial
│  └─ robots.txt              bloqueia indexação (demonstração)
├─ scripts/extract-brazil.mjs gera src/data/brazil.json (Natural Earth 1:50m)
└─ src/
   ├─ config/site.js          ← TODO o conteúdo editável (contatos, números, soluções, unidades)
   ├─ data/brazil.json        contorno geográfico real do Brasil
   ├─ lib/geo.js              projeção, SVG, amostragem de pontos, nós ilustrativos
   ├─ lib/gsap.js · webgl.js
   ├─ hooks/                  useReducedMotion, useScrollReveal
   └─ components/
      ├─ BrazilMap3D.jsx      mapa 3D (R3F + shaders), carregado sob demanda
      ├─ BrazilMapSVG.jsx     versão 2D (seção Atuação e fallback sem WebGL)
      ├─ Header · Footer · WhatsAppFloat
      ├─ ui/                  ícones, títulos de seção
      └─ sections/            Hero, Authority, Solutions, Coverage, About,
                              Opportunities, Social, Contact
```

## Configuração (`.env.local`; veja `.env.example`)

| Variável | Uso |
|---|---|
| `VITE_WHATSAPP_NUMBER` | WhatsApp comercial. Padrão: `554135016022` (publicado no site oficial). **Confirmar.** |
| `VITE_FORM_ENDPOINT` | Endpoint do formulário (Formspree, Getform, função serverless…). Vazio = o formulário abre a mensagem no WhatsApp. |
| `VITE_SITE_URL` | URL pública (canonical/OG). |
| `VITE_ROBOTS` | `noindex, nofollow` enquanto for demonstração. |
| `VITE_BASE` | Subpasta de publicação (GitHub Pages). |

## Fidelidade do conteúdo

Todo o texto, as soluções, os números e os contatos vêm do site oficial (consultado em 10/11/2026).
Nada foi inventado: nenhum selo, certificação, depoimento, preço ou dado técnico.

**Divergências no próprio site oficial (validar com a Unity):**
- Unidades: “17 unidades em 10 estados” × “21 escritórios” × “12 estados” (Trabalhe Conosco).
- Colaboradores: “150” × “mais de 180” (por isso não aparece nos contadores).
- O DDD 41 (PR) não bate com o endereço de Campinas/SP.
- O LinkedIn e as páginas de Política de Privacidade e Termos não têm URL no site oficial, então foram omitidos.

Os números ficam em `stats` (`src/config/site.js`). Com `value: null`, o contador mostra um marcador “—” em vez de inventar um número.

**Mapa:** o contorno é geográfico e real (Natural Earth, domínio público). Pontos e conexões são **ilustrativos**
(posições aleatórias com semente fixa) e não representam cidades nem cobertura. Isso vem indicado na interface.

**Instagram:** não há integração com a API, então o feed não é simulado. As imagens institucionais levam ao perfil real.
Para usar miniaturas autorizadas, preencha `instagramThumbs` em `src/config/site.js`.

## Desempenho e acessibilidade

- Three.js (~220 KB gzip) fica em um chunk carregado sob demanda. O texto do hero aparece antes.
- Celulares e CPUs fracas recebem menos partículas e um DPR menor. A renderização pausa fora da tela.
- Sem WebGL: entra o mapa SVG com a mesma geometria.
- `prefers-reduced-motion`: sem animações de entrada, parallax ou loops. O conteúdo fica visível de imediato.
- HTML semântico, skip link, `aria-*` no menu mobile, foco visível e contraste adequado.

## Publicação gratuita (URL pública)

- **Netlify:** “Add new site → Import from Git” (o `netlify.toml` já está pronto), ou arraste a pasta `dist/` em app.netlify.com/drop.
- **Vercel:** importe o repositório (o `vercel.json` já está pronto).
- **GitHub Pages:** `npm run deploy:gh` (gera o build com `VITE_BASE=/unity-empresas-demo/` e publica a pasta `dist` no branch `gh-pages`).
- **Cloudflare Pages:** build `npm run build`, saída `dist`.

Ao virar site oficial: troque `VITE_ROBOTS` para `index, follow`, mude `public/robots.txt` para `Allow: /` e remova o aviso do rodapé.
