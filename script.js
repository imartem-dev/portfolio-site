function initMechanismHero() {
  const hero = document.querySelector(".mechanism-hero");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!hero || reducedMotion) return;

  const gears = Array.from(hero.querySelectorAll(".gear")).map((node) => {
    const styles = window.getComputedStyle(node);

    return {
      node,
      angle: 0,
      speed: Number.parseFloat(styles.getPropertyValue("--speed")) || 1,
      direction: Number.parseFloat(styles.getPropertyValue("--dir")) || 1
    };
  });

  if (!gears.length) return;

  let lastX = 0;
  let lastY = 0;
  let lastMoveTime = 0;
  let momentum = 0;
  let scrollMomentum = 0;
  let lastScrollY = window.scrollY;
  let lastScrollTime = performance.now();
  let lastFrameTime = performance.now();

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function isReactivePointerArea(rect, event) {
    const heroIsVisible = rect.bottom > 0 && rect.top < window.innerHeight;
    const belowHeroBuffer = Math.min(window.innerHeight * 0.32, 280);
    const pointerNearHero = rect.bottom > 0 && event.clientY <= rect.bottom + belowHeroBuffer;

    return heroIsVisible || pointerNearHero;
  }

  function isReactiveScrollArea(rect) {
    const viewportBuffer = Math.min(window.innerHeight * 0.36, 320);

    return rect.bottom > -viewportBuffer && rect.top < window.innerHeight + viewportBuffer;
  }

  document.addEventListener("pointermove", (event) => {
    const rect = hero.getBoundingClientRect();
    const active = isReactivePointerArea(rect, event);

    if (!active) {
      lastMoveTime = 0;
      return;
    }

    const x = clamp(event.clientX - rect.left, 0, rect.width);
    const y = clamp(event.clientY - rect.top, 0, rect.height);
    const now = performance.now();

    hero.style.setProperty("--cursor-x", `${(x / rect.width) * 100}%`);
    hero.style.setProperty("--cursor-y", `${(y / rect.height) * 100}%`);

    if (lastMoveTime) {
      const elapsed = Math.max(now - lastMoveTime, 16);
      const distance = Math.hypot(x - lastX, y - lastY);
      const impulse = Math.min(distance / elapsed, 8) * 0.09;
      momentum = Math.min(Math.max(momentum, impulse), 0.72);
    }

    lastX = x;
    lastY = y;
    lastMoveTime = now;
  }, { passive: true });

  window.addEventListener("scroll", () => {
    const rect = hero.getBoundingClientRect();
    const now = performance.now();
    const currentScrollY = window.scrollY;
    const deltaY = Math.abs(currentScrollY - lastScrollY);
    const elapsed = Math.max(now - lastScrollTime, 16);

    if (isReactiveScrollArea(rect) && deltaY > 0) {
      const impulse = Math.min(deltaY / elapsed, 10) * 0.055;
      scrollMomentum = Math.min(Math.max(scrollMomentum, impulse), 0.62);
    }

    lastScrollY = currentScrollY;
    lastScrollTime = now;
  }, { passive: true });

  function render(now) {
    const elapsed = Math.min(now - lastFrameTime, 48);
    const activeMomentum = momentum + scrollMomentum;
    lastFrameTime = now;

    momentum *= Math.pow(0.91, elapsed / 16.67);
    scrollMomentum *= Math.pow(0.89, elapsed / 16.67);
    if (momentum < 0.001) momentum = 0;
    if (scrollMomentum < 0.001) scrollMomentum = 0;

    hero.style.setProperty("--hero-energy", Math.min(activeMomentum * 2.2, 1).toFixed(3));

    gears.forEach((gear) => {
      gear.angle += activeMomentum * elapsed * gear.speed * gear.direction;
      gear.node.style.setProperty("--gear-rotation", `${gear.angle.toFixed(3)}deg`);
    });

    window.requestAnimationFrame(render);
  }

  window.requestAnimationFrame(render);
}

initMechanismHero();

function initStageAmbientEffects() {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const formulaField = document.querySelector(".formula-field");

  if (reducedMotion || !formulaField) return;

  const formulas = [
    "x = y",
    "4 x 8",
    "f(x)",
    "a + b",
    "E = mc2",
    "sum n",
    "AI -> UI",
    "y = mx + b",
    "2^n",
    "if x > 0",
    "{ a, b }",
    "p = mv",
    "x1 + x2",
    "n / 2",
    "UX + AI",
    "flow(t)"
  ];
  const fragment = document.createDocumentFragment();
  const tokenCount = 16;

  formulaField.textContent = "";

  for (let index = 0; index < tokenCount; index += 1) {
    const token = document.createElement("span");
    const duration = 5 + Math.random() * 3;
    const size = 1 + Math.random() * 1.15;

    token.className = "formula-token";
    token.textContent = formulas[index % formulas.length];
    token.style.setProperty("--formula-x", `${10 + Math.random() * 80}%`);
    token.style.setProperty("--formula-y", `${8 + Math.random() * 68}%`);
    token.style.setProperty("--formula-size", `${size.toFixed(2)}vw`);
    token.style.setProperty("--formula-rot", `${(-9 + Math.random() * 18).toFixed(1)}deg`);
    token.style.setProperty("--formula-opacity", `${(0.42 + Math.random() * 0.36).toFixed(2)}`);
    token.style.setProperty("--formula-duration", `${duration.toFixed(2)}s`);
    token.style.setProperty("--formula-delay", `${(-Math.random() * duration).toFixed(2)}s`);
    fragment.appendChild(token);
  }

  formulaField.appendChild(fragment);
}

initStageAmbientEffects();

function initScrollNarrative() {
  const section = document.querySelector(".process-scroll");
  const sticky = document.querySelector(".process-sticky");
  const hero = document.querySelector(".hero-minimal");
  const title = document.querySelector(".process-title");
  const cardsWrap = document.querySelector(".process-cards-wrap");
  const cards = Array.from(document.querySelectorAll(".process-card"));
  const stageBackgrounds = Array.from(document.querySelectorAll(".cards-mechanism-layer .mechanism-stage"));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!section || !sticky || !hero || !title || !cardsWrap || !cards.length) return;

  if (reducedMotion) {
    hero.style.setProperty("--hero-opacity", "1");
    hero.style.setProperty("--hero-y", "0px");
    title.style.setProperty("--process-title-opacity", "1");
    title.style.setProperty("--process-title-scale", "1");
    title.classList.add("is-visible");
    cardsWrap.classList.add("is-visible");
    cards.forEach((card) => card.classList.add("is-visible"));
    stageBackgrounds.forEach((stage) => stage.classList.add("is-visible"));
    return;
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function mapRange(value, start, end, from, to) {
    const progress = clamp((value - start) / (end - start), 0, 1);
    return from + (to - from) * progress;
  }

  function render() {
    const scrollable = Math.max(section.offsetHeight - window.innerHeight, 1);
    const progress = clamp(-section.getBoundingClientRect().top / scrollable, 0, 1);
    const isMobile = window.innerWidth <= 760;
    const cardThresholds = isMobile ? [0.5, 0.58, 0.66, 0.74] : [0.58, 0.68, 0.78, 0.88];
    const heroOpacity = mapRange(progress, 0.03, 0.27, 1, 0);
    const heroY = mapRange(progress, 0.03, 0.27, 0, -18);
    const introTitleOpacity = mapRange(progress, 0.03, 0.25, 0, 1);
    const cardTitleOpacity = progress >= cardThresholds[0]
      ? mapRange(progress, cardThresholds[0], cardThresholds[0] + 0.1, 1, 0.14)
      : introTitleOpacity;
    const titleScale = progress >= 0.48
      ? mapRange(progress, 0.48, 0.58, 1, 1.18)
      : mapRange(progress, 0.03, 0.27, 0.86, 1);

    hero.style.setProperty("--hero-opacity", heroOpacity.toFixed(3));
    hero.style.setProperty("--hero-y", `${heroY.toFixed(2)}px`);
    title.style.setProperty("--process-title-opacity", cardTitleOpacity.toFixed(3));
    title.style.setProperty("--process-title-scale", titleScale.toFixed(3));

    title.classList.toggle("is-visible", progress >= 0.03);
    sticky.classList.toggle("is-cards-mode", progress >= 0.5);
    cardsWrap.classList.toggle("is-visible", progress >= 0.5);

    cards.forEach((card, index) => {
      card.classList.toggle("is-visible", progress >= cardThresholds[index]);
    });

    stageBackgrounds.forEach((stage, index) => {
      stage.classList.toggle("is-visible", progress >= cardThresholds[index]);
    });
  }

  render();
  window.addEventListener("scroll", render, { passive: true });
  window.addEventListener("resize", render);
}

initScrollNarrative();

function initContactScene() {
  const section = document.querySelector(".contact-section");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!section) return;

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function mix(from, to, progress) {
    return from + (to - from) * progress;
  }

  function getMotionSettings() {
    const isMobile = window.innerWidth <= 760;

    if (isMobile) {
      return {
        leftX: [6, 20],
        leftY: [6, 1],
        leftRot: [-42, -34],
        rightX: [8, -4],
        rightY: [-2, 2],
        rightRot: [-7, -14]
      };
    }

    return {
      leftX: [-28, -12],
      leftY: [7, -1],
      leftRot: [-35, -29],
      rightX: [16, 3],
      rightY: [-5, -1],
      rightRot: [3, -5]
    };
  }

  function setContactProgress(progress) {
    const isMobile = window.innerWidth <= 760;
    const eased = 1 - Math.pow(1 - progress, isMobile ? 1.8 : 1.12);
    const motion = getMotionSettings();

    section.style.setProperty("--contact-progress", progress.toFixed(3));
    section.style.setProperty("--contact-left-x", `${mix(motion.leftX[0], motion.leftX[1], eased).toFixed(2)}vw`);
    section.style.setProperty("--contact-left-y", `${mix(motion.leftY[0], motion.leftY[1], eased).toFixed(2)}vh`);
    section.style.setProperty("--contact-left-rot", `${mix(motion.leftRot[0], motion.leftRot[1], eased).toFixed(2)}deg`);
    section.style.setProperty("--contact-right-x", `${mix(motion.rightX[0], motion.rightX[1], eased).toFixed(2)}vw`);
    section.style.setProperty("--contact-right-y", `${mix(motion.rightY[0], motion.rightY[1], eased).toFixed(2)}vh`);
    section.style.setProperty("--contact-right-rot", `${mix(motion.rightRot[0], motion.rightRot[1], eased).toFixed(2)}deg`);
  }

  if (reducedMotion) {
    setContactProgress(1);
    return;
  }

  let ticking = false;

  function update() {
    const isMobile = window.innerWidth <= 760;
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const travel = Math.max(section.offsetHeight - window.innerHeight, 1);
    const rawProgress = clamp((window.scrollY - sectionTop) / travel, 0, 1);
    const progress = clamp(rawProgress / (isMobile ? 0.82 : 0.68), 0, 1);

    setContactProgress(progress);
    ticking = false;
  }

  function requestUpdate() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  }

  update();
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
}

function initCaseCards() {
  const cards = Array.from(document.querySelectorAll(".case-card"));
  const modal = document.querySelector(".case-modal");
  const modalPanel = document.querySelector(".case-modal-panel");
  const modalKicker = document.querySelector(".case-modal-kicker");
  const modalTitle = document.querySelector("#case-modal-title");
  const modalBody = document.querySelector(".case-modal-body");
  const modalResult = document.querySelector(".case-modal-result");
  const modalLink = document.querySelector(".case-modal-link");
  const caseImage = document.querySelector(".case-image-full");
  const caseImageMobile = document.querySelector(".case-image-mobile");
  const caseImageCta = document.querySelector(".case-image-cta");
  const storyKicker = document.querySelector(".case-story-kicker");
  const storyTitle = document.querySelector(".case-story-title");
  const storyLead = document.querySelector(".case-story-lead");
  const storySteps = document.querySelector(".case-story-steps");
  const diagramLabels = Array.from(document.querySelectorAll(".case-diagram-label"));
  const closeControls = Array.from(document.querySelectorAll("[data-close-case]"));

  if (!cards.length || !modal || !modalPanel || !modalKicker || !modalTitle || !modalBody || !modalResult || !modalLink || !caseImage || !caseImageMobile || !caseImageCta || !storyKicker || !storyTitle || !storyLead || !storySteps) return;

  const cases = {
    video: {
      kicker: "AI video pipeline",
      title: "",
      body: [
        "<strong>Задача</strong> — создать повторяемый формат для YouTube-канала: разные персонажи, одна структура, быстрый выпуск.",
        "<strong>Проблема</strong> — AI-видео без нарративной логики превращается в визуальный шум.",
        "<strong>Решение</strong> — многоступенчатый pipeline в Claude (лучшая модель для написания текста): каждый шаг автоматически передаёт результат следующему. В системный промпт встроены правила кинодраматургии: запрет внутренних состояний которые не может передать камера (ход мыслей, внутренний диалог и т.п.), обязательные эмоциональные перипетии каждые 1-2 минуты для удержания зрителя, правила смены ракурса."
      ],
      result: "<strong>Результат</strong> — конвейер от идеи до промптов без ручных промежуточных шагов.",
      linkText: "Смотреть видео",
      linkSubtext: "на youtube",
      linkHref: "https://www.youtube.com/watch?v=yAEgqdsTZuI",
      diagram: ["Ниша", "Формат", "Библия", "Бит-шит", "Сценарий", "Промпты"],
      image: {
        desktop: "./assets/cases/case-1-desktop.svg",
        mobile: "./assets/cases/case-1-mobile.svg",
        alt: "Кейс #1: AI video pipeline"
      }
    },
    game: {
      kicker: "Interactive prototype · В разработке",
      title: "Браузерная игра на Three.js",
      body: [
        "Кликер с системой воинов, сундуков, бафов и стихий. Обсудил механики с Claude, оформил Game Design Document, передал в Claude Code — логика заработала с первого прохода.",
        "Спрайты персонажей сгенерированы по референсам, разрезаны и подключены автоматически."
      ],
      result: "Результат: рабочий билд с анимированными персонажами и игровой логикой.",
      linkText: "GitHub — заменить позже",
      diagram: ["Механики", "GDD", "Claude Code", "Спрайты", "Логика", "Билд"],
      image: {
        desktop: "./assets/cases/case-2-desktop.png",
        mobile: "./assets/cases/case-2-mobile.png",
        alt: "Кейс #2: браузерная игра на Three.js"
      }
    },
    automation: {
      kicker: "Automation · Готово",
      title: "Python-автоматизация и Telegram-бот",
      body: [
        "Скрипт на Python с обращением к OpenAI API — читает данные из таблицы, отправляет запросы, записывает ответы без ручного вмешательства.",
        "Telegram-бот с интеграцией LLM. AI-ассистент для личного планирования на базе системы промптов."
      ],
      result: "Результат: рабочие автоматизации которые закрывают реальные задачи.",
      linkText: "Ссылка — заменить позже",
      diagram: ["Таблица", "Python", "OpenAI API", "Ответы", "Telegram", "Планирование"]
    },
    marketing: {
      kicker: "Beauty automation",
      title: "Сайт + CRM",
      lead: [
        "Задача — сайт собирающий лиды в CRM.",
        "Решение — ChatGPT проектирует сайт, публикует его и помогает собрать CRM-воронку.",
        "Автоматизация — CRM, чат-бот / Telegram, GPT по API объединяются в одну систему для общения с клиентами."
      ],
      result: "Единая система: сайт → лиды → CRM → Telegram → повторные продажи.",
      linkText: "Перейти на сайт",
      linkHref: "https://www.косметологи-уфы.рф",
      story: [
        {
          title: "Исследование",
          image: "./assets/cases/case-4-step-1.webp",
          alt: "Исследование конкурентов для beauty-проекта",
          text: "Gemini Deep Research собрал сильные референсы конкурентов."
        },
        {
          title: "Сайт",
          image: "./assets/cases/case-4-step-2.webp",
          alt: "Сайт beauty-проекта",
          text: "GPT 5.5 написал основной HTML/CSS и сам выложил на хостинг."
        },
        {
          title: "Bitrix24 + CRM",
          image: "./assets/cases/case-4-step-3.webp",
          alt: "CRM-воронка в Bitrix24",
          text: "GPT 5.5 собрал по описанию воронку и подключил виджет. Воронка + анти-брошенная корзина + пост-процедурный цикл."
        },
        {
          title: "Лид-магнит",
          image: "./assets/cases/case-4-step-4.webp",
          alt: "AI лид-магнит для общения с клиентом",
          text: "GPT oss-120b, подключённый по API, анализирует диалог с клиентом и ставит AI-тег отталкиваясь от жалоб. Например: прыщи, угри, сыпь = тег «акне». В зависимости от тега в телеграм отправляется лид-магнит."
        }
      ]
    },
    "three-d": {
      kicker: "3D pipeline",
      title: "От референса до готовой 3D-модели",
      lead: "Последовательный pipeline: референс, подготовка, генерация, оптимизация и анимация.",
      story: [
        {
          title: "Выбор референса",
          image: "./assets/cases/case-5-step-1.webp",
          alt: "Выбор визуального референса для 3D-модели",
          text: "Подбираем визуальный референс: фото, концепт-арт или любое изображение, которое станет основой для будущей 3D-модели. На этом этапе важно выбрать чёткий ракурс с хорошей читаемостью формы."
        },
        {
          title: "Подготовка изображения",
          image: "./assets/cases/case-5-step-2.webp",
          alt: "Подготовка изображения для генерации 3D-модели",
          text: "Редактируем референс для корректной работы с генератором: убираем лишний фон, выравниваем освещение, при необходимости дорисовываем недостающие детали. Цель — получить максимально «чистый» источник для точной генерации геометрии."
        },
        {
          title: "Генерация и оптимизация 3D-модели",
          image: "./assets/cases/case-5-step-3.webp",
          alt: "Генерация и оптимизация 3D-модели",
          text: "По подготовленному изображению генерируем 3D-модель. Далее подключаем GPT через MCP-сервер Blender и даём задачу на оптимизацию: снижаем полигональность, чистим топологию, уменьшаем вес файла без потери качества. На выходе — готовая модель, пригодная для:",
          list: [
            "веб-анимации и интерактивных сайтов",
            "рекламных креативов",
            "анимационных видео",
            "игровых ассетов"
          ]
        },
        {
          title: "Анимация",
          image: "./assets/cases/case-5-step-4.webp",
          alt: "Финальная анимация готовой 3D-модели",
          text: "Финальная 3D-модель передаётся в риггинг и анимацию. Результат — живой, движущийся объект, готовый к интеграции в любой продакшн-пайплайн."
        }
      ]
    }
  };

  function setDiagramLabel(label, text) {
    label.textContent = "";
    const words = text.split(" ");
    const lines = words.length > 1 ? words : [text];

    lines.slice(0, 2).forEach((line, index) => {
      const tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
      tspan.setAttribute("x", "56");
      tspan.setAttribute("dy", index === 0 ? "0" : "15");
      tspan.textContent = line;
      label.appendChild(tspan);
    });
  }

  function renderStory(item) {
    storyKicker.textContent = item.kicker || "";
    storyTitle.textContent = item.title;
    storyLead.textContent = "";
    const leadItems = Array.isArray(item.lead) ? item.lead : [item.lead].filter(Boolean);
    leadItems.forEach((leadText) => {
      const paragraph = document.createElement("p");
      paragraph.textContent = leadText;
      storyLead.appendChild(paragraph);
    });
    storySteps.textContent = "";

    item.story.forEach((step, index) => {
      const section = document.createElement("section");
      section.className = "case-story-step";

      const media = document.createElement("figure");
      media.className = "case-story-media";
      const image = document.createElement("img");
      image.src = step.image;
      image.alt = step.alt || step.title;
      media.appendChild(image);

      const copy = document.createElement("div");
      copy.className = "case-story-copy";
      const number = document.createElement("span");
      number.className = "case-story-number";
      number.textContent = String(index + 1).padStart(2, "0");
      const title = document.createElement("h3");
      title.textContent = step.title;
      const text = document.createElement("p");
      text.textContent = step.text;

      copy.append(number, title, text);

      if (step.list?.length) {
        const list = document.createElement("ul");
        list.className = "case-story-list";
        step.list.forEach((itemText) => {
          const listItem = document.createElement("li");
          listItem.textContent = itemText;
          list.appendChild(listItem);
        });
        copy.appendChild(list);
      }

      section.append(media, copy);
      storySteps.appendChild(section);
    });

    if (item.result) {
      const result = document.createElement("section");
      result.className = "case-story-result";
      const title = document.createElement("h3");
      title.textContent = "Результат";
      const text = document.createElement("p");
      text.textContent = item.result;
      result.append(title, text);

      if (item.linkHref) {
        const link = document.createElement("a");
        link.className = "case-story-link";
        link.href = item.linkHref;
        link.target = "_blank";
        link.rel = "noreferrer";
        link.textContent = item.linkText || "Посмотреть";
        result.appendChild(link);
      }

      storySteps.appendChild(result);
    }
  }

  function renderImageCta(item) {
    caseImageCta.textContent = "";

    const label = document.createElement("span");
    label.className = "case-image-cta-main";
    label.textContent = item.linkText || "";
    caseImageCta.appendChild(label);

    if (item.linkSubtext) {
      const subtext = document.createElement("span");
      subtext.className = "case-image-cta-sub";
      subtext.textContent = item.linkSubtext;
      caseImageCta.appendChild(subtext);
    }

    caseImageCta.href = item.linkHref || "#";
    caseImageCta.classList.toggle("is-visible", Boolean(item.linkHref));
  }

  function openCase(caseId) {
    const item = cases[caseId];
    if (!item) return;

    if (item.story) {
      modal.classList.remove("is-image-mode");
      modal.classList.add("is-story-mode");
      caseImage.removeAttribute("src");
      caseImage.alt = "";
      caseImageMobile.removeAttribute("srcset");
      caseImageCta.classList.remove("is-visible");
      caseImageCta.textContent = "";
      caseImageCta.href = "#";
      storyKicker.textContent = "";
      renderStory(item);
      modal.setAttribute("aria-hidden", "false");
      modal.classList.add("is-open");
      document.body.classList.add("case-modal-open");
      return;
    }

    if (item.image) {
      modal.classList.remove("is-story-mode");
      modal.classList.add("is-image-mode");
      modalPanel.removeAttribute("aria-labelledby");
      modalPanel.removeAttribute("aria-label");
      caseImage.src = item.image.desktop;
      caseImage.alt = item.image.alt;
      caseImageMobile.srcset = item.image.mobile;
      renderImageCta(item);
      storyKicker.textContent = "";
      storyTitle.textContent = "";
      storyLead.textContent = "";
      storySteps.textContent = "";
      modal.setAttribute("aria-hidden", "false");
      modal.classList.add("is-open");
      document.body.classList.add("case-modal-open");
      return;
    }

    modal.classList.remove("is-image-mode");
    modal.classList.remove("is-story-mode");
    caseImage.removeAttribute("src");
    caseImage.alt = "";
    caseImageMobile.removeAttribute("srcset");
    caseImageCta.classList.remove("is-visible");
    caseImageCta.textContent = "";
    caseImageCta.href = "#";
    storyKicker.textContent = "";
    storyTitle.textContent = "";
    storyLead.textContent = "";
    storySteps.textContent = "";
    modalKicker.textContent = item.kicker;
    modalTitle.textContent = item.title;
    modalTitle.hidden = !item.title;
    if (item.title) {
      modalPanel.setAttribute("aria-labelledby", "case-modal-title");
      modalPanel.removeAttribute("aria-label");
    } else {
      modalPanel.removeAttribute("aria-labelledby");
      modalPanel.setAttribute("aria-label", item.kicker);
    }
    modalBody.innerHTML = item.body.map((paragraph) => `<p>${paragraph}</p>`).join("");
    modalResult.innerHTML = item.result;
    modalLink.textContent = item.linkText;
    modalLink.classList.toggle("is-placeholder", !item.linkHref);
    modalLink.href = item.linkHref || "#";
    diagramLabels.forEach((label, index) => {
      setDiagramLabel(label, item.diagram[index] || "");
    });
    modal.setAttribute("aria-hidden", "false");
    modal.classList.add("is-open");
    document.body.classList.add("case-modal-open");
  }

  function closeCase() {
    modal.classList.remove("is-open");
    modal.classList.remove("is-image-mode");
    modal.classList.remove("is-story-mode");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("case-modal-open");
    caseImage.removeAttribute("src");
    caseImage.alt = "";
    caseImageMobile.removeAttribute("srcset");
    caseImageCta.classList.remove("is-visible");
    caseImageCta.textContent = "";
    caseImageCta.href = "#";
    storyKicker.textContent = "";
    storyTitle.textContent = "";
    storyLead.textContent = "";
    storySteps.textContent = "";
  }

  cards.forEach((card) => {
    card.addEventListener("click", () => openCase(card.dataset.case));
  });

  closeControls.forEach((control) => {
    control.addEventListener("click", closeCase);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      closeCase();
    }
  });
}

initCaseCards();
initContactScene();
