// Состояние приложения
const state = {
  values: {
    body: 25,
    activity: 25,
    contacts: 25,
    meaning: 25
  },
  history: [],
  currentScreen: 'main',
  ropeEffectEnabled: true,
  testData: {
    importanceScores: [[], [], [], []], // 4 spheres, 6 questions each
    currentStateScores: [[], [], [], []] // 4 spheres, 6 questions each
  },
  // СОХРАНЕНИЕ ПОСЛЕДНИХ ОТВЕТОВ ТЕСТА
  lastTestData: {
    importanceScores: [
      [50, 50, 50, 50, 50, 50],
      [50, 50, 50, 50, 50, 50],
      [50, 50, 50, 50, 50, 50],
      [50, 50, 50, 50, 50, 50]
    ],
    currentStateScores: [
      [50, 50, 50, 50, 50, 50],
      [50, 50, 50, 50, 50, 50],
      [50, 50, 50, 50, 50, 50],
      [50, 50, 50, 50, 50, 50]
    ]
  }
};

// Константы
const IDEAL_BALANCE = 25;
const OVERLOADED_THRESHOLD = 35;
const UNDERLOADED_THRESHOLD = 15;

const sphereConfig = [
  { key: 'body', name: 'Тело/Здоровье', color: '#4CAF50', position: 'top', icon: '💪' },
  { key: 'activity', name: 'Деятельность/Достижения', color: '#2196F3', position: 'right', icon: '🎯' },
  { key: 'contacts', name: 'Контакты/Отношения', color: '#FF9800', position: 'bottom', icon: '❤️' },
  { key: 'meaning', name: 'Смыслы/Будущее', color: '#9C27B0', position: 'left', icon: '✨' }
];

// Вопросы для теста - ОБНОВЛЕНО: 6 вопросов на сферу
const testQuestions = {
  importance: [
    // Тело/Здоровье
    [
      "Насколько важно для вас иметь хорошее физическое самочувствие?",
      "Насколько важны для вас психологическое спокойствие и умение восстанавливаться после стресса?",
      "Насколько важно для вас правильное питание?",
      "Важен ли для вас качественный сон и отдых?",
      "Насколько важна для вас регулярная физическая активность?",
      "Насколько важно для вас отсутствие вредных привычек (алкоголь, курение, наркотики)?"
    ],
    // Деятельность/Достижения
    [
      "Насколько важна для вас успешная карьера?",
      "Важно ли вам финансовое благополучие?",
      "Насколько важно для вас профессиональное развитие и обучение?",
      "Важно ли вам признание ваших достижений окружающими?",
      "Насколько важна для вас полезность и значимость вашей работы?",
      "Насколько важен для вас полноценный отдых и отпуск?"
    ],
    // Контакты/Отношения
    [
      "Насколько важно для вас иметь вторую половинку (партнера, девушку, парня)?",
      "Важна ли для вас дружба и качественное общение с друзьями?",
      "Насколько важно для вас умение выстраивать контакт с людьми?",
      "Важно ли вам не чувствовать себя одиноким?",
      "Насколько важны для вас отношения с родными (родители, братья, сестры, бабушки, дедушки)?",
      "Насколько важна для вас поддержка и понимание от близких людей?"
    ],
    // Смыслы/Будущее
    [
      "Насколько важны для вас жизненные цели и планы на будущее?",
      "Насколько важно для вас получать удовольствие и радость от движения к своим жизненным целям?",
      "Насколько важно для вас иметь контроль над происходящим в вашей жизни?",
      "Важно ли вам иметь возможность обсуждать свои переживания с кем-то (психолог, близкие, друзья)?",
      "Насколько важна для вас способность мечтать и фантазировать?",
      "Важно ли вам, чтобы ваши фантазии и мечты влияли на реальность?"
    ]
  ],
  currentState: [
    // Тело/Здоровье
    [
      "У меня хорошее физическое самочувствие",
      "Я хорошо справляюсь со стрессом и быстро восстанавливаюсь",
      "Я питаюсь правильно и сбалансированно",
      "Я высыпаюсь и полноценно отдыхаю",
      "Я регулярно занимаюсь физической активностью",
      "Я свободен от вредных привычек (алкоголь, курение, наркотики)"
    ],
    // Деятельность/Достижения
    [
      "Моя карьера развивается успешно",
      "Меня устраивает мое финансовое положение",
      "Я активно развиваюсь профессионально",
      "Мои достижения признаются окружающими",
      "Моя работа полезна и значима",
      "Я регулярно отдыхаю и беру отпуск"
    ],
    // Контакты/Отношения
    [
      "У меня есть вторая половинка (партнер, девушка, парень) / Я доволен своей личной жизнью",
      "У меня есть настоящие друзья и качественное общение",
      "Я легко выстраиваю контакт с людьми",
      "Я не чувствую себя одиноким",
      "У меня хорошие отношения с родными (родители, братья, сестры, бабушки, дедушки)",
      "Я получаю достаточно поддержки и понимания от близких людей"
    ],
    // Смыслы/Будущее
    [
      "У меня есть четкие жизненные цели и планы",
      "Я получаю удовольствие и радость от процесса движения к своим целям",
      "Я сам контролирую происходящее в моей жизни (а не другие люди или обстоятельства)",
      "У меня есть с кем обсудить свои переживания (психолог, понимающие близкие, друзья)",
      "Я часто мечтаю и позволяю себе фантазировать",
      "Мои фантазии и мечты позитивно влияют на мою реальную жизнь"
    ]
  ]
};

// Элементы DOM
const elements = {
  mainScreen: document.getElementById('mainScreen'),
  assessmentScreen: document.getElementById('assessmentScreen'),
  importanceTestScreen: document.getElementById('importanceTestScreen'),
  stateTestScreen: document.getElementById('stateTestScreen'),
  testResultsScreen: document.getElementById('testResultsScreen'),
  infoModal: document.getElementById('infoModal'),
  startTestBtn: document.getElementById('startTestBtn'),
  startManualBtn: document.getElementById('startManualBtn'),
  backBtn: document.getElementById('backBtn'),
  backFromImportanceBtn: document.getElementById('backFromImportanceBtn'),
  backToImportanceBtn: document.getElementById('backToImportanceBtn'),
  backFromResultsBtn: document.getElementById('backFromResultsBtn'),
  nextToStateBtn: document.getElementById('nextToStateBtn'),
  completeTestBtn: document.getElementById('completeTestBtn'),
  saveTestBtn: document.getElementById('saveTestBtn'),
  retakeTestBtn: document.getElementById('retakeTestBtn'),
  resetTestBtn: document.getElementById('resetTestBtn'),
  ropeEffectToggle: document.getElementById('ropeEffect'),
  infoBtn: document.getElementById('infoBtn'),
  infoBtn2: document.getElementById('infoBtn2'),
  closeModal: document.getElementById('closeModal'),
  saveBtn: document.getElementById('saveBtn'),
  resetBtn: document.getElementById('resetBtn'),
  historyBtn: document.getElementById('historyBtn'),
  notificationContainer: document.getElementById('notificationContainer'),
  historyPanel: document.getElementById('historyPanel'),
  sliders: {
    body: document.getElementById('bodySlider'),
    activity: document.getElementById('activitySlider'),
    contacts: document.getElementById('contactsSlider'),
    meaning: document.getElementById('meaningSlider')
  },
  values: {
    body: document.getElementById('bodyValue'),
    activity: document.getElementById('activityValue'),
    contacts: document.getElementById('contactsValue'),
    meaning: document.getElementById('meaningValue')
  },
  canvas: document.getElementById('diamondCanvas'),
  testCanvas: document.getElementById('testDiamondCanvas'),
  recommendations: document.getElementById('recommendations'),
  balanceScore: document.getElementById('balanceScore'),
  historyList: document.getElementById('historyList'),
  testBalanceScore: document.getElementById('testBalanceScore'),
  testRecommendations: document.getElementById('testRecommendations'),
  importanceQuestions: document.getElementById('importanceQuestions'),
  stateQuestions: document.getElementById('stateQuestions'),
  importanceProgress: document.getElementById('importanceProgress'),
  stateProgress: document.getElementById('stateProgress'),
  importanceProgressText: document.getElementById('importanceProgressText'),
  stateProgressText: document.getElementById('stateProgressText')
};

let ctx;
let testCtx;
let isUpdating = false;

// Состояние перетаскивания
let isDragging = false;
let draggedPointIndex = -1;
let hoveredPointIndex = -1;

// Конфигурация точек
const POINT_RADIUS = {
  normal: 8,
  hover: 10,
  dragging: 12,
  clickArea: 15
};

// Определение размера canvas в зависимости от размера экрана
function getCanvasSize() {
  const screenWidth = window.innerWidth;
  
  if (screenWidth <= 480) {
    // Малые мобильные устройства
    return { width: 400, height: 400, axisLength: 130 };
  } else if (screenWidth <= 768) {
    // Мобильные устройства и планшеты
    return { width: 500, height: 500, axisLength: 160 };
  } else if (screenWidth <= 1024) {
    // Планшеты и малые ноутбуки
    return { width: 600, height: 600, axisLength: 190 };
  } else {
    // Десктопы
    return { width: 750, height: 750, axisLength: 220 };
  }
}

// Настройка размера canvas
function setupCanvasSize() {
  const size = getCanvasSize();
  
  elements.canvas.width = size.width;
  elements.canvas.height = size.height;
  
  elements.testCanvas.width = size.width;
  elements.testCanvas.height = size.height;
}

// Инициализация
function init() {
  ctx = elements.canvas.getContext('2d');
  testCtx = elements.testCanvas.getContext('2d');
  setupCanvasSize();
  setupEventListeners();
  setupCanvasInteraction();
  drawDiamond();
  updateRecommendations();
  renderHistory();
  initializeTestData();
  
  // Обработчик изменения размера окна
  window.addEventListener('resize', handleResize);
}

// Обработчик изменения размера окна
let resizeTimeout;
function handleResize() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    setupCanvasSize();
    drawDiamond();
    if (state.currentScreen === 'testResults') {
      drawTestDiamond();
    }
  }, 250);
}

// Инициализация данных теста - ЗАГРУЗКА ПРЕДЫДУЩИХ ОТВЕТОВ
function initializeTestData() {
  // КЛЮЧЕВОЕ ИЗМЕНЕНИЕ: Загружаем последние сохраненные ответы вместо значений по умолчанию
  for (let i = 0; i < 4; i++) {
    // Создаем копии массивов, чтобы не изменять оригиналы напрямую
    state.testData.importanceScores[i] = [...state.lastTestData.importanceScores[i]];
    state.testData.currentStateScores[i] = [...state.lastTestData.currentStateScores[i]];
  }
}

// Настройка обработчиков событий
function setupEventListeners() {
  elements.startTestBtn.addEventListener('click', () => {
    initializeTestData();
    renderImportanceTest();
    showScreen('importanceTest');
  });
  elements.startManualBtn.addEventListener('click', () => showScreen('assessment'));
  elements.backBtn.addEventListener('click', () => showScreen('main'));
  elements.backFromImportanceBtn.addEventListener('click', () => showScreen('main'));
  elements.backToImportanceBtn.addEventListener('click', () => {
    renderImportanceTest();
    showScreen('importanceTest');
  });
  elements.backFromResultsBtn.addEventListener('click', () => showScreen('main'));
  elements.nextToStateBtn.addEventListener('click', () => {
    renderStateTest();
    showScreen('stateTest');
  });
  elements.completeTestBtn.addEventListener('click', () => completeTest());
  elements.saveTestBtn.addEventListener('click', () => saveTestResult());
  elements.retakeTestBtn.addEventListener('click', () => {
    initializeTestData();
    renderImportanceTest();
    showScreen('importanceTest');
  });
  elements.resetTestBtn.addEventListener('click', () => resetTestData());
  
  // Переключатель эффекта каната
  elements.ropeEffectToggle.addEventListener('change', (e) => {
    state.ropeEffectEnabled = e.target.checked;
  });
  elements.infoBtn.addEventListener('click', () => openModal());
  elements.infoBtn2.addEventListener('click', () => openModal());
  elements.closeModal.addEventListener('click', () => closeModal());
  elements.saveBtn.addEventListener('click', () => saveResult());
  elements.resetBtn.addEventListener('click', () => resetValues());
  elements.historyBtn.addEventListener('click', () => toggleHistory());
  
  // Обработчики слайдеров - с улучшенной обработкой для предотвращения залипания
  Object.keys(elements.sliders).forEach(key => {
    const slider = elements.sliders[key];
    
    // Основной обработчик input
    slider.addEventListener('input', (e) => {
      e.stopPropagation();
      handleSliderChange(key, parseInt(e.target.value));
    });
    
    // Дополнительный обработчик change для надежности
    slider.addEventListener('change', (e) => {
      e.stopPropagation();
      handleSliderChange(key, parseInt(e.target.value));
    });
    
    // Предотвращаем конфликт с canvas при взаимодействии со слайдером
    slider.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      slider.focus();
    });
    
    slider.addEventListener('touchstart', (e) => {
      e.stopPropagation();
      slider.focus();
    });
  });
  
  // Закрытие модального окна при клике вне его
  elements.infoModal.addEventListener('click', (e) => {
    if (e.target === elements.infoModal) {
      closeModal();
    }
  });
}

// Получение корректной позиции мыши с учётом масштабирования canvas
function getMousePos(canvas, evt) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  
  return {
    x: (evt.clientX - rect.left) * scaleX,
    y: (evt.clientY - rect.top) * scaleY
  };
}

// Настройка интерактивности Canvas
function setupCanvasInteraction() {
  const canvas = elements.canvas;
  
  // Mouse events
  canvas.addEventListener('mousedown', handleCanvasMouseDown);
  canvas.addEventListener('mousemove', handleCanvasMouseMove);
  canvas.addEventListener('mouseup', handleCanvasMouseUp);
  canvas.addEventListener('mouseleave', handleCanvasMouseLeave);
  
  // Touch events для мобильных
  canvas.addEventListener('touchstart', handleCanvasTouchStart, { passive: false });
  canvas.addEventListener('touchmove', handleCanvasTouchMove, { passive: false });
  canvas.addEventListener('touchend', handleCanvasTouchEnd);
}

// Получение позиции точки на графике
function getPointPosition(index, value) {
  const canvas = elements.canvas;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const maxRadius = Math.min(canvas.width, canvas.height) / 2 - 60;
  const radius = maxRadius * (value / 100);
  
  const positions = [
    { x: centerX, y: centerY - radius }, // top (body)
    { x: centerX + radius, y: centerY }, // right (activity)
    { x: centerX, y: centerY + radius }, // bottom (contacts)
    { x: centerX - radius, y: centerY }  // left (meaning)
  ];
  
  return positions[index];
}

// Проверка попадания в точку
function getPointAtPosition(x, y) {
  const keys = ['body', 'activity', 'contacts', 'meaning'];
  
  for (let i = 0; i < keys.length; i++) {
    const point = getPointPosition(i, state.values[keys[i]]);
    const distance = Math.sqrt((x - point.x) ** 2 + (y - point.y) ** 2);
    
    if (distance <= POINT_RADIUS.clickArea) {
      return i;
    }
  }
  
  return -1;
}

// Вычисление значения из позиции на графике
function calculateValueFromPosition(index, x, y) {
  const canvas = elements.canvas;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const maxRadius = Math.min(canvas.width, canvas.height) / 2 - 60;
  
  let distance = 0;
  
  switch(index) {
    case 0: // top (body)
      distance = Math.max(0, centerY - y);
      break;
    case 1: // right (activity)
      distance = Math.max(0, x - centerX);
      break;
    case 2: // bottom (contacts)
      distance = Math.max(0, y - centerY);
      break;
    case 3: // left (meaning)
      distance = Math.max(0, centerX - x);
      break;
  }
  
  const value = Math.round((distance / maxRadius) * 100);
  return Math.max(0, Math.min(100, value));
}

// Обработчик mousedown
function handleCanvasMouseDown(e) {
  // Предотвращаем обработку, если клик был на слайдере
  if (e.target.tagName === 'INPUT' && e.target.type === 'range') {
    return;
  }
  
  const mousePos = getMousePos(elements.canvas, e);
  const pointIndex = getPointAtPosition(mousePos.x, mousePos.y);
  
  if (pointIndex !== -1) {
    isDragging = true;
    draggedPointIndex = pointIndex;
    elements.canvas.style.cursor = 'grabbing';
    e.preventDefault();
    e.stopPropagation();
  }
}

// Обработчик mousemove
function handleCanvasMouseMove(e) {
  const mousePos = getMousePos(elements.canvas, e);
  
  if (isDragging && draggedPointIndex !== -1) {
    e.preventDefault();
    e.stopPropagation();
    
    // Вычисляем новое значение
    const newValue = calculateValueFromPosition(draggedPointIndex, mousePos.x, mousePos.y);
    const keys = ['body', 'activity', 'contacts', 'meaning'];
    const changedKey = keys[draggedPointIndex];
    
    // Обновляем значения с пропорциональной корректировкой
    handleSliderChange(changedKey, newValue);
    
  } else {
    // Проверяем наведение на точки
    const pointIndex = getPointAtPosition(mousePos.x, mousePos.y);
    
    if (pointIndex !== -1) {
      hoveredPointIndex = pointIndex;
      elements.canvas.style.cursor = 'grab';
    } else {
      hoveredPointIndex = -1;
      elements.canvas.style.cursor = 'default';
    }
    
    // Перерисовываем для эффекта наведения
    if (hoveredPointIndex !== -1) {
      drawDiamond();
    }
  }
}

// Обработчик mouseup
function handleCanvasMouseUp(e) {
  if (isDragging) {
    e.preventDefault();
    e.stopPropagation();
    isDragging = false;
    draggedPointIndex = -1;
    elements.canvas.style.cursor = 'default';
    drawDiamond();
  }
}

// Обработчик mouseleave
function handleCanvasMouseLeave(e) {
  if (isDragging) {
    isDragging = false;
    draggedPointIndex = -1;
  }
  hoveredPointIndex = -1;
  elements.canvas.style.cursor = 'default';
  drawDiamond();
}

// Touch обработчики
function handleCanvasTouchStart(e) {
  e.preventDefault();
  const touch = e.touches[0];
  const mousePos = getMousePos(elements.canvas, touch);
  
  const pointIndex = getPointAtPosition(mousePos.x, mousePos.y);
  
  if (pointIndex !== -1) {
    isDragging = true;
    draggedPointIndex = pointIndex;
  }
}

function handleCanvasTouchMove(e) {
  e.preventDefault();
  
  if (isDragging && draggedPointIndex !== -1) {
    const touch = e.touches[0];
    const mousePos = getMousePos(elements.canvas, touch);
    
    const newValue = calculateValueFromPosition(draggedPointIndex, mousePos.x, mousePos.y);
    const keys = ['body', 'activity', 'contacts', 'meaning'];
    const changedKey = keys[draggedPointIndex];
    
    handleSliderChange(changedKey, newValue);
  }
}

function handleCanvasTouchEnd(e) {
  isDragging = false;
  draggedPointIndex = -1;
  drawDiamond();
}

// Переключение экранов
function showScreen(screenName) {
  elements.mainScreen.classList.remove('active');
  elements.assessmentScreen.classList.remove('active');
  elements.importanceTestScreen.classList.remove('active');
  elements.stateTestScreen.classList.remove('active');
  elements.testResultsScreen.classList.remove('active');
  
  setTimeout(() => {
    if (screenName === 'main') {
      elements.mainScreen.classList.add('active');
    } else if (screenName === 'assessment') {
      elements.assessmentScreen.classList.add('active');
    } else if (screenName === 'importanceTest') {
      elements.importanceTestScreen.classList.add('active');
    } else if (screenName === 'stateTest') {
      elements.stateTestScreen.classList.add('active');
    } else if (screenName === 'testResults') {
      elements.testResultsScreen.classList.add('active');
    }
  }, 50);
  
  state.currentScreen = screenName;
}

// Модальное окно
function openModal() {
  elements.infoModal.classList.add('active');
}

function closeModal() {
  elements.infoModal.classList.remove('active');
}

// Обработка изменения слайдера
function handleSliderChange(changedKey, newValue) {
  if (isUpdating) return;
  isUpdating = true;
  
  // Ограничиваем значение от 0 до 100
  newValue = Math.max(0, Math.min(100, newValue));
  
  if (state.ropeEffectEnabled) {
    // РЕЖИМ С ЭФФЕКТОМ КАНАТА
    // КРИТИЧЕСКИ ВАЖНО: Сохраняем старые значения ПЕРЕД любыми изменениями
    const oldValues = { ...state.values };
    
    // Вычисляем остаток, который нужно распределить между остальными тремя сферами
    const remainder = 100 - newValue;
    
    // Получаем ключи остальных сфер
    const otherKeys = Object.keys(state.values).filter(k => k !== changedKey);
    
    // Вычисляем сумму текущих значений остальных трех сфер (ДО изменения)
    let othersSum = 0;
    otherKeys.forEach(key => {
      othersSum += oldValues[key];
    });
    
    // Теперь устанавливаем новое значение для изменённой сферы
    state.values[changedKey] = newValue;
    
    // Распределяем остаток пропорционально между остальными тремя сферами
    if (othersSum > 0) {
      // Каждая из трёх сфер получает долю от остатка пропорционально своему старому значению
      otherKeys.forEach(key => {
        // Доля этой сферы в общей сумме остальных (используем СТАРЫЕ значения)
        const proportion = oldValues[key] / othersSum;
        // Новое значение = доля от остатка
        state.values[key] = proportion * remainder;
      });
    } else {
      // Если все остальные сферы были 0, распределяем остаток поровну
      const equalShare = remainder / otherKeys.length;
      otherKeys.forEach(key => {
        state.values[key] = equalShare;
      });
    }
    
    // Финальная нормализация для исключения ошибок округления
    const total = Object.values(state.values).reduce((sum, val) => sum + val, 0);
    if (Math.abs(total - 100) > 0.01) {
      const correction = 100 / total;
      Object.keys(state.values).forEach(key => {
        state.values[key] = state.values[key] * correction;
      });
    }
  } else {
    // РЕЖИМ БЕЗ ЭФФЕКТА КАНАТА - просто устанавливаем значение
    state.values[changedKey] = newValue;
  }
  
  // Обновляем UI
  updateSliders();
  drawDiamond();
  updateRecommendations();
  
  isUpdating = false;
}

// Обновление слайдеров и значений
function updateSliders() {
  Object.keys(state.values).forEach(key => {
    elements.sliders[key].value = state.values[key];
    // ОКРУГЛЕНИЕ ДЛЯ ОТОБРАЖЕНИЯ - внутренние значения остаются точными
    elements.values[key].textContent = Math.round(state.values[key]) + '%';
  });
}

// Рисование ромба
function drawDiamond() {
  const canvas = elements.canvas;
  const width = canvas.width;
  const height = canvas.height;
  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = Math.min(width, height) / 2 - 60;
  
  // Очистка canvas
  ctx.clearRect(0, 0, width, height);
  
  // Рисуем оси и метки
  drawAxes(centerX, centerY, maxRadius);
  
  // Рисуем идеальный ромб пунктиром
  drawIdealDiamond(centerX, centerY, maxRadius);
  
  // Рисуем текущий ромб
  drawCurrentDiamond(centerX, centerY, maxRadius);
}

// Рисование осей
function drawAxes(centerX, centerY, maxRadius) {
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.lineWidth = 1;
  
  // Рисуем концентрические круги для шкалы
  [0.25, 0.5, 0.75, 1].forEach(scale => {
    ctx.beginPath();
    ctx.arc(centerX, centerY, maxRadius * scale, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Метки процентов
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${Math.round(scale * 100)}%`, centerX + maxRadius * scale + 15, centerY + 5);
  });
  
  // Рисуем оси
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.lineWidth = 2;
  
  // Вертикальная ось
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - maxRadius - 10);
  ctx.lineTo(centerX, centerY + maxRadius + 10);
  ctx.stroke();
  
  // Горизонтальная ось
  ctx.beginPath();
  ctx.moveTo(centerX - maxRadius - 10, centerY);
  ctx.lineTo(centerX + maxRadius + 10, centerY);
  ctx.stroke();
  
  // Подписи осей с цветным свечением - ОПТИМИЗИРОВАННЫЕ ОТСТУПЫ
  ctx.font = 'bold 13px sans-serif';
  ctx.textAlign = 'center';
  
  const lineHeight = 16;
  const labels = [
    { text1: 'Тело/', text2: 'Здоровье', color: '#4CAF50' },
    { text1: 'Деятельность/', text2: 'Достижения', color: '#2196F3' },
    { text1: 'Контакты/', text2: 'Отношения', color: '#FF9800' },
    { text1: 'Смыслы/', text2: 'Будущее', color: '#9C27B0' }
  ];
  
  const topOffset = 42;
  const bottomOffset = 28;
  
  // Верхняя ось - Тело/Здоровье
  ctx.fillStyle = labels[0].color;
  ctx.shadowColor = labels[0].color;
  ctx.shadowBlur = 15;
  ctx.fillText(labels[0].text1, centerX, centerY - maxRadius - topOffset);
  ctx.fillText(labels[0].text2, centerX, centerY - maxRadius - topOffset + lineHeight);
  
  // Правая ось - Деятельность/Достижения
  ctx.fillStyle = labels[1].color;
  ctx.shadowColor = labels[1].color;
  ctx.shadowBlur = 15;
  const rightX = centerX + maxRadius + 32;
  const rightY = centerY - 32;
  ctx.fillText(labels[1].text1, rightX, rightY - lineHeight / 2);
  ctx.fillText(labels[1].text2, rightX, rightY + lineHeight / 2);
  
  // Нижняя ось - Контакты/Отношения
  ctx.fillStyle = labels[2].color;
  ctx.shadowColor = labels[2].color;
  ctx.shadowBlur = 15;
  ctx.fillText(labels[2].text1, centerX, centerY + maxRadius + bottomOffset);
  ctx.fillText(labels[2].text2, centerX, centerY + maxRadius + bottomOffset + lineHeight);
  
  // Левая ось - Смыслы/Будущее
  ctx.fillStyle = labels[3].color;
  ctx.shadowColor = labels[3].color;
  ctx.shadowBlur = 15;
  const leftX = centerX - maxRadius - 32;
  const leftY = centerY - 32;
  ctx.fillText(labels[3].text1, leftX, leftY - lineHeight / 2);
  ctx.fillText(labels[3].text2, leftX, leftY + lineHeight / 2);
  
  // Сброс эффектов
  ctx.shadowBlur = 0;
}

// Рисование идеального ромба
function drawIdealDiamond(centerX, centerY, maxRadius) {
  const idealRadius = maxRadius * (IDEAL_BALANCE / 100);
  
  ctx.strokeStyle = 'rgba(0, 200, 0, 0.3)';
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
  
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - idealRadius);
  ctx.lineTo(centerX + idealRadius, centerY);
  ctx.lineTo(centerX, centerY + idealRadius);
  ctx.lineTo(centerX - idealRadius, centerY);
  ctx.closePath();
  ctx.stroke();
  
  ctx.setLineDash([]);
}

// Рисование процентных значений НА ОСЯХ (не возле точек)
function drawPercentageValues(centerX, centerY, maxRadius) {
  ctx.font = 'bold 18px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Белый цвет с эффектом свечения
  ctx.fillStyle = '#FFFFFF';
  ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
  ctx.shadowBlur = 12;
  
  const percentages = [
    Math.round(state.values.body),
    Math.round(state.values.activity),
    Math.round(state.values.contacts),
    Math.round(state.values.meaning)
  ];
  
  // Расстояние от центра до позиции процента (на концах осей)
  const percentOffset = maxRadius + 20;
  
  // Верхняя ось - отображаем процент на конце оси
  ctx.fillText(percentages[0] + '%', centerX, centerY - percentOffset);
  
  // Правая ось - отображаем процент на конце оси
  ctx.fillText(percentages[1] + '%', centerX + percentOffset, centerY);
  
  // Нижняя ось - отображаем процент на конце оси
  ctx.fillText(percentages[2] + '%', centerX, centerY + percentOffset);
  
  // Левая ось - отображаем процент на конце оси
  ctx.fillText(percentages[3] + '%', centerX - percentOffset, centerY);
  
  // Сброс тени
  ctx.shadowBlur = 0;
}

// Рисование текущего ромба
function drawCurrentDiamond(centerX, centerY, maxRadius) {
  const points = [
    { x: centerX, y: centerY - (maxRadius * state.values.body / 100) }, // top
    { x: centerX + (maxRadius * state.values.activity / 100), y: centerY }, // right
    { x: centerX, y: centerY + (maxRadius * state.values.contacts / 100) }, // bottom
    { x: centerX - (maxRadius * state.values.meaning / 100), y: centerY } // left
  ];
  
  // Определяем цвет на основе баланса
  const balance = calculateBalance();
  let fillColor, strokeColor;
  
  if (balance >= 80) {
    fillColor = 'rgba(76, 175, 80, 0.2)';
    strokeColor = '#4CAF50';
  } else if (balance >= 60) {
    fillColor = 'rgba(255, 193, 7, 0.2)';
    strokeColor = '#FFC107';
  } else {
    fillColor = 'rgba(244, 67, 54, 0.2)';
    strokeColor = '#f44336';
  }
  
  // Заливка
  ctx.fillStyle = fillColor;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  points.forEach(point => ctx.lineTo(point.x, point.y));
  ctx.closePath();
  ctx.fill();
  
  // Обводка
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 3;
  ctx.stroke();
  
  // Точки на вершинах с цветами сфер (интерактивные)
  sphereConfig.forEach((sphere, index) => {
    // Определяем размер точки в зависимости от состояния
    let radius = POINT_RADIUS.normal;
    
    if (isDragging && draggedPointIndex === index) {
      radius = POINT_RADIUS.dragging;
    } else if (hoveredPointIndex === index) {
      radius = POINT_RADIUS.hover;
    }
    
    // Тень для лучшей видимости
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2;
    
    // Основная точка
    ctx.fillStyle = sphere.color;
    ctx.beginPath();
    ctx.arc(points[index].x, points[index].y, radius, 0, 2 * Math.PI);
    ctx.fill();
    
    // Обводка
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Дополнительная обводка при наведении/перетаскивании
    if (hoveredPointIndex === index || (isDragging && draggedPointIndex === index)) {
      ctx.strokeStyle = sphere.color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(points[index].x, points[index].y, radius + 4, 0, 2 * Math.PI);
      ctx.stroke();
    }
  });
  
  // ПРОЦЕНТЫ НЕ ОТОБРАЖАЮТСЯ НА ГРАФИКЕ - только в правой панели
  // drawPercentageValues(centerX, centerY, maxRadius);
}

// Расчет баланса
function calculateBalance() {
  const values = Object.values(state.values);
  const deviations = values.map(v => Math.abs(v - IDEAL_BALANCE));
  const totalDeviation = deviations.reduce((a, b) => a + b, 0);
  const maxDeviation = 4 * IDEAL_BALANCE; // Максимальное отклонение
  const balance = Math.max(0, 100 - (totalDeviation / maxDeviation) * 100);
  return Math.round(balance);
}

// Обновление рекомендаций
function updateRecommendations() {
  const balance = calculateBalance();
  
  // Обновляем общий балл баланса
  let balanceText = '';
  let balanceEmoji = '';
  
  if (balance >= 80) {
    balanceEmoji = '🎉';
    balanceText = `${balanceEmoji} Отличный баланс: ${balance}%`;
  } else if (balance >= 60) {
    balanceEmoji = '👍';
    balanceText = `${balanceEmoji} Хороший баланс: ${balance}%`;
  } else if (balance >= 40) {
    balanceEmoji = '⚠️';
    balanceText = `${balanceEmoji} Умеренный дисбаланс: ${balance}%`;
  } else {
    balanceEmoji = '⚡';
    balanceText = `${balanceEmoji} Значительный дисбаланс: ${balance}%`;
  }
  
  elements.balanceScore.innerHTML = `<strong>${balanceText}</strong>`;
  
  // Генерируем рекомендации для каждой сферы
  const recommendations = [];
  
  sphereConfig.forEach(sphere => {
    const value = state.values[sphere.key];
    let recommendation = null;
    
    if (value > OVERLOADED_THRESHOLD) {
      recommendation = {
        type: 'overloaded',
        sphere: sphere.name,
        message: `<strong>${sphere.name}:</strong> Эта сфера перегружена (${Math.round(value)}%). Возможно, вы уделяете ей слишком много внимания в ущерб другим областям жизни.`
      };
    } else if (value < UNDERLOADED_THRESHOLD) {
      recommendation = {
        type: 'underloaded',
        sphere: sphere.name,
        message: `<strong>${sphere.name}:</strong> Эта сфера недостаточно развита (${Math.round(value)}%). Обратите на нее больше внимания для достижения баланса.`
      };
    } else {
      recommendation = {
        type: 'balanced',
        sphere: sphere.name,
        message: `<strong>${sphere.name}:</strong> Хороший баланс (${Math.round(value)}%)! Эта сфера получает достаточно внимания.`
      };
    }
    
    if (recommendation) {
      recommendations.push(recommendation);
    }
  });
  
  // Отображаем рекомендации
  elements.recommendations.innerHTML = recommendations
    .map(rec => `<div class="recommendation-item ${rec.type}">${rec.message}</div>`)
    .join('');
}

// Система уведомлений
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  
  const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️';
  
  notification.innerHTML = `
    <span class="notification-icon">${icon}</span>
    <span class="notification-message">${message}</span>
  `;
  
  elements.notificationContainer.appendChild(notification);
  
  // Показать уведомление с анимацией
  setTimeout(() => notification.classList.add('show'), 10);
  
  // Скрыть и удалить через 3 секунды
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Сохранение результата
function saveResult() {
  const now = new Date();
  const dateStr = now.toLocaleString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  const result = {
    date: dateStr,
    timestamp: now.getTime(),
    values: { ...state.values },
    balance: calculateBalance(),
    source: 'Ручная оценка'
  };
  
  state.history.unshift(result);
  
  // Ограничиваем историю до 10 записей
  if (state.history.length > 10) {
    state.history = state.history.slice(0, 10);
  }
  
  renderHistory();
  
  // Показываем уведомление
  showNotification('Результат успешно сохранён!');
  
  // Автоматически показываем историю
  if (!elements.historyPanel.classList.contains('visible')) {
    toggleHistory();
  }
}

// Переключение видимости истории
function toggleHistory() {
  const isVisible = elements.historyPanel.classList.contains('visible');
  
  if (isVisible) {
    elements.historyPanel.classList.remove('visible');
    elements.historyBtn.textContent = '📊 История';
  } else {
    elements.historyPanel.classList.add('visible');
    elements.historyBtn.textContent = '📊 Скрыть историю';
    // Прокрутить к истории
    setTimeout(() => {
      elements.historyPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  }
}

// Загрузка результата из истории
function loadResult(index) {
  const result = state.history[index];
  
  state.values = { ...result.values };
  
  updateSliders();
  drawDiamond();
  updateRecommendations();
  
  showNotification('Результат загружен из истории');
  
  // Прокрутить к графику
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Отображение истории
function renderHistory() {
  if (state.history.length === 0) {
    elements.historyList.innerHTML = '<div class="history-empty">История измерений пуста. Сохраните ваш первый результат!</div>';
    return;
  }
  
  const historyHTML = state.history.map((item, index) => `
    <div class="history-item">
      <div class="history-item-date">📅 ${item.date} <span style="color: var(--color-primary); margin-left: 8px;">${item.source === 'Тест' ? '🎯 Тест' : '✋ Ручная'}</span></div>
      <div class="history-item-values">
        <div>💪 Здоровье: <strong>${Math.round(item.values.body)}%</strong></div>
        <div>🎯 Деятельность: <strong>${Math.round(item.values.activity)}%</strong></div>
        <div>❤️ Отношения: <strong>${Math.round(item.values.contacts)}%</strong></div>
        <div>✨ Смыслы: <strong>${Math.round(item.values.meaning)}%</strong></div>
      </div>
      <div style="margin-top: 8px; font-weight: 500;">Баланс: ${item.balance}%</div>
      <div class="history-item-actions">
        <button class="btn btn--primary" onclick="loadResult(${index})">📥 Загрузить</button>
      </div>
    </div>
  `).join('');
  
  elements.historyList.innerHTML = historyHTML;
}

// Сброс значений
function resetValues() {
  state.values = {
    body: 25,
    activity: 25,
    contacts: 25,
    meaning: 25
  };
  
  updateSliders();
  drawDiamond();
  updateRecommendations();
  
  showNotification('Значения сброшены к начальным (25% каждая сфера)', 'info');
}

// Рендеринг вопросов оценки важности
function renderImportanceTest() {
  const container = elements.importanceQuestions;
  container.innerHTML = '';
  
  sphereConfig.forEach((sphere, sphereIndex) => {
    const questionCard = document.createElement('div');
    questionCard.className = 'question-card';
    
    const sphereTitle = document.createElement('h3');
    sphereTitle.innerHTML = `<span class="sphere-color-dot" style="background: ${sphere.color};"></span> ${sphere.icon} ${sphere.name}`;
    questionCard.appendChild(sphereTitle);
    
    testQuestions.importance[sphereIndex].forEach((question, qIndex) => {
      const questionDiv = document.createElement('div');
      questionDiv.className = 'question';
      
      const questionText = document.createElement('p');
      questionText.innerHTML = `<span class="question-number">${qIndex + 1}.</span> ${question}`;
      questionDiv.appendChild(questionText);
      
      // Create slider wrapper with diamond marks
      const sliderWrapper = document.createElement('div');
      sliderWrapper.className = 'slider-wrapper';
      
      // Create diamond marks container positioned above track
      const diamondMarks = document.createElement('div');
      diamondMarks.className = 'diamond-marks';
      for (let i = 0; i <= 10; i++) {
        const mark = document.createElement('span');
        mark.className = 'diamond-mark';
        mark.style.left = `${i * 10}%`;
        mark.style.background = sphere.color;
        mark.dataset.value = i * 10;
        diamondMarks.appendChild(mark);
      }
      sliderWrapper.appendChild(diamondMarks);
      
      const slider = document.createElement('input');
      slider.type = 'range';
      slider.min = '0';
      slider.max = '100';
      slider.step = '10';
      slider.value = state.testData.importanceScores[sphereIndex][qIndex];
      slider.className = 'slider';
      slider.style.setProperty('--slider-color', sphere.color);
      sliderWrapper.appendChild(slider);
      
      // Create labels with centered value display
      const sliderLabels = document.createElement('div');
      sliderLabels.className = 'slider-labels';
      
      const labelLeft = document.createElement('span');
      labelLeft.className = 'label-left';
      labelLeft.textContent = 'Совсем не важно';
      
      const valueDisplay = document.createElement('span');
      valueDisplay.className = 'value-display';
      valueDisplay.textContent = `${slider.value}%`;
      
      const labelRight = document.createElement('span');
      labelRight.className = 'label-right';
      labelRight.textContent = 'Крайне важно';
      
      sliderLabels.appendChild(labelLeft);
      sliderLabels.appendChild(valueDisplay);
      sliderLabels.appendChild(labelRight);
      
      slider.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        state.testData.importanceScores[sphereIndex][qIndex] = value;
        valueDisplay.textContent = `${value}%`;
        updateDiamondMarks(sliderWrapper, value, sphere.color);
        updateTestProgress('importance');
      });
      
      // Initialize diamond marks
      updateDiamondMarks(sliderWrapper, parseInt(slider.value), sphere.color);
      
      questionDiv.appendChild(sliderWrapper);
      questionDiv.appendChild(sliderLabels);
      questionCard.appendChild(questionDiv);
    });
    
    container.appendChild(questionCard);
  });
  
  updateTestProgress('importance');
}

// Рендеринг вопросов оценки текущего состояния
function renderStateTest() {
  const container = elements.stateQuestions;
  container.innerHTML = '';
  
  sphereConfig.forEach((sphere, sphereIndex) => {
    const questionCard = document.createElement('div');
    questionCard.className = 'question-card';
    
    const sphereTitle = document.createElement('h3');
    sphereTitle.innerHTML = `<span class="sphere-color-dot" style="background: ${sphere.color};"></span> ${sphere.icon} ${sphere.name}`;
    questionCard.appendChild(sphereTitle);
    
    testQuestions.currentState[sphereIndex].forEach((question, qIndex) => {
      const questionDiv = document.createElement('div');
      questionDiv.className = 'question';
      
      const questionText = document.createElement('p');
      questionText.innerHTML = `<span class="question-number">${qIndex + 1}.</span> ${question}`;
      questionDiv.appendChild(questionText);
      
      // Create slider wrapper with diamond marks
      const sliderWrapper = document.createElement('div');
      sliderWrapper.className = 'slider-wrapper';
      
      // Create diamond marks container positioned above track
      const diamondMarks = document.createElement('div');
      diamondMarks.className = 'diamond-marks';
      for (let i = 0; i <= 10; i++) {
        const mark = document.createElement('span');
        mark.className = 'diamond-mark';
        mark.style.left = `${i * 10}%`;
        mark.style.background = sphere.color;
        mark.dataset.value = i * 10;
        diamondMarks.appendChild(mark);
      }
      sliderWrapper.appendChild(diamondMarks);
      
      const slider = document.createElement('input');
      slider.type = 'range';
      slider.min = '0';
      slider.max = '100';
      slider.step = '10';
      slider.value = state.testData.currentStateScores[sphereIndex][qIndex];
      slider.className = 'slider';
      slider.style.setProperty('--slider-color', sphere.color);
      sliderWrapper.appendChild(slider);
      
      // Create labels with centered value display
      const sliderLabels = document.createElement('div');
      sliderLabels.className = 'slider-labels';
      
      const labelLeft = document.createElement('span');
      labelLeft.className = 'label-left';
      labelLeft.textContent = 'Совсем не соответствует';
      
      const valueDisplay = document.createElement('span');
      valueDisplay.className = 'value-display';
      valueDisplay.textContent = `${slider.value}%`;
      
      const labelRight = document.createElement('span');
      labelRight.className = 'label-right';
      labelRight.textContent = 'Полностью соответствует';
      
      sliderLabels.appendChild(labelLeft);
      sliderLabels.appendChild(valueDisplay);
      sliderLabels.appendChild(labelRight);
      
      slider.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        state.testData.currentStateScores[sphereIndex][qIndex] = value;
        valueDisplay.textContent = `${value}%`;
        updateDiamondMarks(sliderWrapper, value, sphere.color);
        updateTestProgress('state');
      });
      
      // Initialize diamond marks
      updateDiamondMarks(sliderWrapper, parseInt(slider.value), sphere.color);
      
      questionDiv.appendChild(sliderWrapper);
      questionDiv.appendChild(sliderLabels);
      questionCard.appendChild(questionDiv);
    });
    
    container.appendChild(questionCard);
  });
  
  updateTestProgress('state');
}

// Update diamond marks based on slider value
function updateDiamondMarks(sliderWrapper, value, sphereColor) {
  const marks = sliderWrapper.querySelectorAll('.diamond-mark');
  marks.forEach((mark, index) => {
    const markValue = index * 10;
    mark.classList.remove('active', 'passed');
    
    if (markValue === value) {
      mark.classList.add('active');
      mark.style.boxShadow = `0 0 10px ${sphereColor}`;
    } else if (markValue < value) {
      mark.classList.add('passed');
    }
  });
}

// Обновление прогресс-бара
function updateTestProgress(stage) {
  if (stage === 'importance') {
    // Подсчет отвеченных вопросов (не 50%)
    let answered = 0;
    state.testData.importanceScores.forEach(sphere => {
      sphere.forEach(score => {
        if (score !== 50) answered++;
      });
    });
    const progress = (answered / 24) * 100;
    elements.importanceProgress.style.width = `${Math.max(5, progress)}%`;
    elements.importanceProgressText.textContent = `Отвечено: ${answered} из 24 вопросов`;
  } else if (stage === 'state') {
    let answered = 0;
    state.testData.currentStateScores.forEach(sphere => {
      sphere.forEach(score => {
        if (score !== 50) answered++;
      });
    });
    const progress = (answered / 24) * 100;
    elements.stateProgress.style.width = `${Math.max(5, progress)}%`;
    elements.stateProgressText.textContent = `Отвечено: ${answered} из 24 вопросов`;
  }
}

// Расчет взвешенной оценки для сферы
function calculateSphereScore(sphereIndex) {
  let totalWeightedScore = 0;
  let totalImportance = 0;
  
  // Для каждого вопроса в сфере (6 вопросов)
  for (let q = 0; q < 6; q++) {
    const importance = state.testData.importanceScores[sphereIndex][q]; // 0-100
    const currentState = state.testData.currentStateScores[sphereIndex][q]; // 0-100
    
    // Взвешенная оценка = важность * текущее состояние
    totalWeightedScore += (importance / 100) * currentState;
    totalImportance += importance;
  }
  
  // Итоговый балл сферы = средневзвешенное значение
  const sphereScore = totalImportance > 0 
    ? (totalWeightedScore / totalImportance) * 100 
    : 0;
  
  return sphereScore;
}

// Завершение теста
function completeTest() {
  // Рассчитываем оценки для каждой сферы
  const scores = [];
  for (let i = 0; i < 4; i++) {
    scores.push(calculateSphereScore(i));
  }
  
  // Нормализация до 100%
  const total = scores.reduce((sum, val) => sum + val, 0);
  let normalizedScores = scores;
  if (total > 0) {
    normalizedScores = scores.map(v => (v / total) * 100);
  } else {
    normalizedScores = [25, 25, 25, 25];
  }
  
  // Сохраняем результаты
  state.values.body = normalizedScores[0];
  state.values.activity = normalizedScores[1];
  state.values.contacts = normalizedScores[2];
  state.values.meaning = normalizedScores[3];
  
  // СОХРАНЯЕМ ТЕКУЩИЕ ОТВЕТЫ КАК ПОСЛЕДНИЕ (для следующего прохождения)
  for (let i = 0; i < 4; i++) {
    state.lastTestData.importanceScores[i] = [...state.testData.importanceScores[i]];
    state.lastTestData.currentStateScores[i] = [...state.testData.currentStateScores[i]];
  }
  
  // АВТОМАТИЧЕСКИ СОХРАНЯЕМ РЕЗУЛЬТАТ (без действий пользователя)
  autoSaveTestResult();
  
  // Отображаем результаты
  showTestResults();
}

// Отображение результатов теста
function showTestResults() {
  // Настраиваем размер canvas перед рисованием
  setupCanvasSize();
  // Рисуем график
  drawTestDiamond();
  
  // Обновляем баланс
  const balance = calculateBalance();
  let balanceText = '';
  let balanceEmoji = '';
  
  if (balance >= 80) {
    balanceEmoji = '🎉';
    balanceText = `${balanceEmoji} Отличный баланс: ${balance}%`;
  } else if (balance >= 60) {
    balanceEmoji = '👍';
    balanceText = `${balanceEmoji} Хороший баланс: ${balance}%`;
  } else if (balance >= 40) {
    balanceEmoji = '⚠️';
    balanceText = `${balanceEmoji} Умеренный дисбаланс: ${balance}%`;
  } else {
    balanceEmoji = '⚡';
    balanceText = `${balanceEmoji} Значительный дисбаланс: ${balance}%`;
  }
  
  elements.testBalanceScore.innerHTML = `<strong>${balanceText}</strong>`;
  
  // Генерируем рекомендации
  const recommendations = [];
  
  sphereConfig.forEach(sphere => {
    const value = state.values[sphere.key];
    let recommendation = null;
    
    if (value > OVERLOADED_THRESHOLD) {
      recommendation = {
        type: 'overloaded',
        sphere: sphere.name,
        message: `<strong>${sphere.icon} ${sphere.name}:</strong> Эта сфера перегружена (${Math.round(value)}%). Возможно, вы уделяете ей слишком много внимания в ущерб другим областям жизни.`
      };
    } else if (value < UNDERLOADED_THRESHOLD) {
      recommendation = {
        type: 'underloaded',
        sphere: sphere.name,
        message: `<strong>${sphere.icon} ${sphere.name}:</strong> Эта сфера недостаточно развита (${Math.round(value)}%). Обратите на нее больше внимания для достижения баланса.`
      };
    } else {
      recommendation = {
        type: 'balanced',
        sphere: sphere.name,
        message: `<strong>${sphere.icon} ${sphere.name}:</strong> Хороший баланс (${Math.round(value)}%)! Эта сфера получает достаточно внимания.`
      };
    }
    
    if (recommendation) {
      recommendations.push(recommendation);
    }
  });
  
  // Отображаем рекомендации
  elements.testRecommendations.innerHTML = recommendations
    .map(rec => `<div class="recommendation-item ${rec.type}">${rec.message}</div>`)
    .join('');
  
  // Переходим к экрану результатов
  showScreen('testResults');
}

// Рисование тестового ромба
function drawTestDiamond() {
  const canvas = elements.testCanvas;
  const width = canvas.width;
  const height = canvas.height;
  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = Math.min(width, height) / 2 - 60;
  
  // Очистка canvas
  testCtx.clearRect(0, 0, width, height);
  
  // Рисуем оси и метки
  drawAxes2(testCtx, centerX, centerY, maxRadius);
  
  // Рисуем идеальный ромб пунктиром
  drawIdealDiamond2(testCtx, centerX, centerY, maxRadius);
  
  // Рисуем текущий ромб
  drawCurrentDiamond2(testCtx, centerX, centerY, maxRadius);
}

// Рисование процентных значений НА ОСЯХ для тестового графика (не возле точек)
function drawPercentageValues2(context, centerX, centerY, maxRadius) {
  context.font = 'bold 18px sans-serif';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  
  // Белый цвет с эффектом свечения
  context.fillStyle = '#FFFFFF';
  context.shadowColor = 'rgba(255, 255, 255, 0.8)';
  context.shadowBlur = 12;
  
  const percentages = [
    Math.round(state.values.body),
    Math.round(state.values.activity),
    Math.round(state.values.contacts),
    Math.round(state.values.meaning)
  ];
  
  // Расстояние от центра до позиции процента (на концах осей)
  const percentOffset = maxRadius + 20;
  
  // Верхняя ось - отображаем процент на конце оси
  context.fillText(percentages[0] + '%', centerX, centerY - percentOffset);
  
  // Правая ось - отображаем процент на конце оси
  context.fillText(percentages[1] + '%', centerX + percentOffset, centerY);
  
  // Нижняя ось - отображаем процент на конце оси
  context.fillText(percentages[2] + '%', centerX, centerY + percentOffset);
  
  // Левая ось - отображаем процент на конце оси
  context.fillText(percentages[3] + '%', centerX - percentOffset, centerY);
  
  // Сброс тени
  context.shadowBlur = 0;
}

// Вспомогательные функции для рисования на тестовом canvas
function drawAxes2(context, centerX, centerY, maxRadius) {
  context.strokeStyle = 'rgba(0, 0, 0, 0.1)';
  context.lineWidth = 1;
  
  [0.25, 0.5, 0.75, 1].forEach(scale => {
    context.beginPath();
    context.arc(centerX, centerY, maxRadius * scale, 0, 2 * Math.PI);
    context.stroke();
    
    context.fillStyle = 'rgba(0, 0, 0, 0.4)';
    context.font = '12px sans-serif';
    context.textAlign = 'center';
    context.fillText(`${Math.round(scale * 100)}%`, centerX + maxRadius * scale + 15, centerY + 5);
  });
  
  context.strokeStyle = 'rgba(0, 0, 0, 0.2)';
  context.lineWidth = 2;
  
  context.beginPath();
  context.moveTo(centerX, centerY - maxRadius - 10);
  context.lineTo(centerX, centerY + maxRadius + 10);
  context.stroke();
  
  context.beginPath();
  context.moveTo(centerX - maxRadius - 10, centerY);
  context.lineTo(centerX + maxRadius + 10, centerY);
  context.stroke();
  
  // Подписи осей с цветным свечением - ОПТИМИЗИРОВАННЫЕ ОТСТУПЫ
  context.font = 'bold 13px sans-serif';
  context.textAlign = 'center';
  
  const lineHeight = 16;
  const labels = [
    { text1: 'Тело/', text2: 'Здоровье', color: '#4CAF50' },
    { text1: 'Деятельность/', text2: 'Достижения', color: '#2196F3' },
    { text1: 'Контакты/', text2: 'Отношения', color: '#FF9800' },
    { text1: 'Смыслы/', text2: 'Будущее', color: '#9C27B0' }
  ];
  
  const topOffset = 42;
  const bottomOffset = 28;
  
  // Верхняя ось - Тело/Здоровье
  context.fillStyle = labels[0].color;
  context.shadowColor = labels[0].color;
  context.shadowBlur = 15;
  context.fillText(labels[0].text1, centerX, centerY - maxRadius - topOffset);
  context.fillText(labels[0].text2, centerX, centerY - maxRadius - topOffset + lineHeight);
  
  // Правая ось - Деятельность/Достижения
  context.fillStyle = labels[1].color;
  context.shadowColor = labels[1].color;
  context.shadowBlur = 15;
  const rightX = centerX + maxRadius + 32;
  const rightY = centerY - 32;
  context.fillText(labels[1].text1, rightX, rightY - lineHeight / 2);
  context.fillText(labels[1].text2, rightX, rightY + lineHeight / 2);
  
  // Нижняя ось - Контакты/Отношения
  context.fillStyle = labels[2].color;
  context.shadowColor = labels[2].color;
  context.shadowBlur = 15;
  context.fillText(labels[2].text1, centerX, centerY + maxRadius + bottomOffset);
  context.fillText(labels[2].text2, centerX, centerY + maxRadius + bottomOffset + lineHeight);
  
  // Левая ось - Смыслы/Будущее
  context.fillStyle = labels[3].color;
  context.shadowColor = labels[3].color;
  context.shadowBlur = 15;
  const leftX = centerX - maxRadius - 32;
  const leftY = centerY - 32;
  context.fillText(labels[3].text1, leftX, leftY - lineHeight / 2);
  context.fillText(labels[3].text2, leftX, leftY + lineHeight / 2);
  
  // Сброс эффектов
  context.shadowBlur = 0;
}

function drawIdealDiamond2(context, centerX, centerY, maxRadius) {
  const idealRadius = maxRadius * (IDEAL_BALANCE / 100);
  
  context.strokeStyle = 'rgba(0, 200, 0, 0.3)';
  context.lineWidth = 2;
  context.setLineDash([5, 5]);
  
  context.beginPath();
  context.moveTo(centerX, centerY - idealRadius);
  context.lineTo(centerX + idealRadius, centerY);
  context.lineTo(centerX, centerY + idealRadius);
  context.lineTo(centerX - idealRadius, centerY);
  context.closePath();
  context.stroke();
  
  context.setLineDash([]);
}

function drawCurrentDiamond2(context, centerX, centerY, maxRadius) {
  const points = [
    { x: centerX, y: centerY - (maxRadius * state.values.body / 100) },
    { x: centerX + (maxRadius * state.values.activity / 100), y: centerY },
    { x: centerX, y: centerY + (maxRadius * state.values.contacts / 100) },
    { x: centerX - (maxRadius * state.values.meaning / 100), y: centerY }
  ];
  
  const balance = calculateBalance();
  let fillColor, strokeColor;
  
  if (balance >= 80) {
    fillColor = 'rgba(76, 175, 80, 0.2)';
    strokeColor = '#4CAF50';
  } else if (balance >= 60) {
    fillColor = 'rgba(255, 193, 7, 0.2)';
    strokeColor = '#FFC107';
  } else {
    fillColor = 'rgba(244, 67, 54, 0.2)';
    strokeColor = '#f44336';
  }
  
  context.fillStyle = fillColor;
  context.beginPath();
  context.moveTo(points[0].x, points[0].y);
  points.forEach(point => context.lineTo(point.x, point.y));
  context.closePath();
  context.fill();
  
  context.strokeStyle = strokeColor;
  context.lineWidth = 3;
  context.stroke();
  
  sphereConfig.forEach((sphere, index) => {
    context.fillStyle = sphere.color;
    context.beginPath();
    context.arc(points[index].x, points[index].y, 8, 0, 2 * Math.PI);
    context.fill();
    
    context.strokeStyle = '#fff';
    context.lineWidth = 3;
    context.stroke();
  });
  
  // ПРОЦЕНТЫ НЕ ОТОБРАЖАЮТСЯ НА ГРАФИКЕ - только в правой панели
  // drawPercentageValues2(context, centerX, centerY, maxRadius);
}

// Автоматическое сохранение результатов теста (без уведомления)
function autoSaveTestResult() {
  const now = new Date();
  const dateStr = now.toLocaleString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  const result = {
    date: dateStr,
    timestamp: now.getTime(),
    values: { ...state.values },
    balance: calculateBalance(),
    source: 'Тест'
  };
  
  state.history.unshift(result);
  
  // Ограничиваем историю до 50 результатов
  if (state.history.length > 50) {
    state.history = state.history.slice(0, 50);
  }
  
  renderHistory();
  
  // Показываем уведомление об автосохранении
  showNotification('✓ Результат автоматически сохранен в истории');
}

// Сохранение результатов теста (ручное)
function saveTestResult() {
  const now = new Date();
  const dateStr = now.toLocaleString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  const result = {
    date: dateStr,
    timestamp: now.getTime(),
    values: { ...state.values },
    balance: calculateBalance(),
    source: 'Тест'
  };
  
  state.history.unshift(result);
  
  // Ограничиваем историю до 50 результатов
  if (state.history.length > 50) {
    state.history = state.history.slice(0, 50);
  }
  
  renderHistory();
  showNotification('Результаты теста сохранены вручную!');
}

// Сброс всех ответов теста до значений по умолчанию
function resetTestData() {
  const confirmReset = confirm('Вы уверены, что хотите сбросить все ответы теста и начать заново?\n\nЭто действие сбросит все сохраненные ответы к 50%.');
  
  if (confirmReset) {
    // Сбрасываем последние сохраненные ответы до значений по умолчанию
    for (let i = 0; i < 4; i++) {
      state.lastTestData.importanceScores[i] = [50, 50, 50, 50, 50, 50];
      state.lastTestData.currentStateScores[i] = [50, 50, 50, 50, 50, 50];
    }
    
    // Перезапускаем тест с новыми (сброшенными) значениями
    initializeTestData();
    renderImportanceTest();
    showScreen('importanceTest');
    
    showNotification('Все ответы теста сброшены к 50%', 'info');
  }
}

// Запуск приложения
init();