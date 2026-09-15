# Saul Goodman - Criminal Defense Attorney Website

Uma experiência web imersiva e cinematográfica com efeitos avançados de parallax, animações suaves e temática inspirada na série *Better Call Saul*.

## 🌟 Funcionalidades

- **Parallax Multi-Camada:** Movimento suave de profundidade baseado na posição do cursor do mouse (com interpolação LERP via RAF).
- **Cinematic Smooth Scroll:** Integração com **Lenis Smooth Scroll** e **GSAP ScrollTrigger**.
- **Internacionalização (i18n):**
  - Detecção automática do idioma do sistema (Português do Brasil ou Inglês).
  - Seletor manual no menu com persistência em `localStorage`.
- **Efeitos Visuais:**
  - Tilt 3D interativo no título ao mover o mouse.
  - Scanlines, vinheta estilo filme noir e partículas flutuantes.
  - Barra de progresso de scroll dinâmica.
  - Carrossel infinito de depoimentos com pausa no hover.
- **Assets Locais e CDNs Otimizadas:**
  - Imagens servidas localmente na pasta `/assets`.
  - Bibliotecas (GSAP, Lenis, Splitting) via CDNs de alta disponibilidade.

## 📁 Estrutura do Projeto

```text
├── index.html           # Estrutura semântica com suporte i18n
├── css/
│   └── style.css        # Estilos, variáveis e responsividade
├── js/
│   ├── translations.js  # Dicionário de tradução (pt-BR / en)
│   ├── i18n.js          # Gerenciador e detecção de idioma
│   └── main.js          # Motor de animações GSAP e Lenis
└── assets/              # Imagens e mídias locais
```

## 🚀 Como Executar

Basta clonar o repositório e abrir o arquivo `index.html` em qualquer navegador moderno.
