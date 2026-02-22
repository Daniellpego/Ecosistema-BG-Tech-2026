// ==== CONFIGURAÇÕES ====
const CONFIG = {
  whatsappNumber: '5511999998888',
  webhookUrl: '' // Insira sua URL do Make.com aqui
};

function escapeHtml(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

// ==== INTERAÇÕES DE UI ====
(function initHeaderScroll() {
  const header = document.getElementById('site-header');
  if (!header) return;
  window.addEventListener('scroll', function () {
    header.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
})();

function toggleMobileMenu() {
  document.getElementById('mobile-menu').classList.toggle('open');
}

function closeMobileMenu() {
  document.getElementById('mobile-menu').classList.remove('open');
}

(function initReveal() {
  var els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(function (el) { observer.observe(el); });
})();

(function initCounters() {
  var counters = document.querySelectorAll('.counter[data-target]');
  if (!counters.length) return;
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      observer.unobserve(el);
      var target = parseFloat(el.dataset.target);
      var decimals = parseInt(el.dataset.decimals, 10) || 0;
      var prefix = el.dataset.prefix || '';
      var suffix = el.dataset.suffix || '';
      var duration = 1800;
      var start = performance.now();
      function update(now) {
        var elapsed = now - start;
        var progress = Math.min(elapsed / duration, 1);
        var ease = 1 - Math.pow(1 - progress, 3);
        var current = target * ease;
        el.textContent = prefix + current.toFixed(decimals) + suffix;
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = prefix + target.toFixed(decimals) + suffix;
      }
      requestAnimationFrame(update);
    });
  }, { threshold: 0.5 });
  counters.forEach(function (el) { observer.observe(el); });
})();

// ==== QUIZ E DIAGNÓSTICO ====
const QUESTIONS = [
  {
    id: 'contato',
    label: 'PASSO 01 / 06',
    title: 'Como podemos te chamar?',
    desc: 'Para uma experiência personalizada, informe seus dados corporativos.',
    type: 'text',
    fields: [
      { id: 'nome', placeholder: 'Seu nome completo', type: 'text', required: true },
      { id: 'empresa', placeholder: 'Nome da empresa', type: 'text', required: false },
      { id: 'whatsapp', placeholder: 'WhatsApp (com DDD)', type: 'tel', required: true }
    ]
  },
  {
    id: 'setor',
    label: 'PASSO 02 / 06',
    title: 'Qual o segmento da sua empresa?',
    desc: 'Cada setor tem padrões de ineficiência únicos.',
    type: 'options',
    options: [
      { icon: 'shopping-cart', label: 'Comércio e Varejo', sub: 'Loja física, e-commerce', score: 82 },
      { icon: 'factory', label: 'Indústria e Manufatura', sub: 'Produção, logística', score: 88 },
      { icon: 'stethoscope', label: 'Saúde e Bem-estar', sub: 'Clínicas, consultórios', score: 91 },
      { icon: 'briefcase', label: 'Serviços Profissionais', sub: 'Contabilidade, consultoria', score: 79 },
      { icon: 'layout-grid', label: 'Outro segmento', sub: 'Detalhamos na reunião', score: 80 }
    ]
  },
  {
    id: 'tamanho',
    label: 'PASSO 03 / 06',
    title: 'Quantas pessoas trabalham na operação?',
    desc: 'O tamanho da equipe muda o tipo de arquitetura ideal.',
    type: 'options',
    options: [
      { icon: 'user', label: 'Até 5 pessoas', sub: 'Equipe enxuta', score: 70 },
      { icon: 'users', label: '6 a 20 pessoas', sub: 'Crescimento ativo', score: 85 },
      { icon: 'building', label: '21 a 50 pessoas', sub: 'Estruturação de setores', score: 92 },
      { icon: 'building-2', label: 'Mais de 50 pessoas', sub: 'Gestão complexa', score: 95 }
    ]
  },
  {
    id: 'dor',
    label: 'PASSO 04 / 06',
    title: 'Qual o principal gargalo atual?',
    desc: 'Onde a empresa mais "sangra" dinheiro hoje?',
    type: 'options',
    options: [
      { icon: 'clock', label: 'Trabalho manual excessivo', sub: 'Planilhas, retrabalho', score: 88 },
      { icon: 'trending-down', label: 'Baixa conversão de vendas', sub: 'Leads esfriam rápido', score: 82 },
      { icon: 'alert-triangle', label: 'Erros operacionais e falhas', sub: 'Custos invisíveis', score: 91 },
      { icon: 'unlink', label: 'Sistemas que não integram', sub: 'Dados duplicados', score: 94 }
    ]
  },
  {
    id: 'faturamento',
    label: 'PASSO 05 / 06',
    title: 'Qual a faixa de faturamento mensal?',
    desc: 'Necessário para calcularmos o ROI potencial da tecnologia.',
    type: 'options',
    options: [
      { icon: 'bar-chart', label: 'Até R$ 50 mil/mês', sub: 'Fase de tração', score: 75 },
      { icon: 'trending-up', label: 'R$ 50k a R$ 200 mil/mês', sub: 'Escalando operações', score: 88 },
      { icon: 'line-chart', label: 'Acima de R$ 200 mil/mês', sub: 'Alta complexidade', score: 95 },
      { icon: 'lock', label: 'Prefiro não informar', sub: 'Sem problemas', score: 80 }
    ]
  },
  {
    id: 'tecnologia',
    label: 'PASSO 06 / 06',
    title: 'Qual o cenário tecnológico hoje?',
    desc: 'Última etapa para o diagnóstico.',
    type: 'options',
    options: [
      { icon: 'file-spreadsheet', label: 'Muitas planilhas e papel', sub: 'Nível básico', score: 95 },
      { icon: 'blocks', label: 'Vários sistemas, mas soltos', sub: 'Falta de integração', score: 91 },
      { icon: 'server-cog', label: 'Já usamos automações simples', sub: 'Nível intermediário', score: 85 },
      { icon: 'rocket', label: 'Operação altamente tecnológica', sub: 'Nível avançado', score: 72 }
    ]
  }
];

const LOADING_STEPS = [
  { icon: 'search', text: 'Analisando estrutura operacional...' },
  { icon: 'activity', text: 'Mapeando gargalos sistêmicos...' },
  { icon: 'calculator', text: 'Calculando impacto de eficiência...' },
  { icon: 'file-check-2', text: 'Gerando relatório final...' }
];

let currentStep = 0;
let answers = {};
let textValues = {};

function openDiagnostic() {
  currentStep = 0;
  answers = {};
  textValues = {};
  document.getElementById('diagnostic-overlay').classList.add('open');
  document.body.classList.add('modal-open');
  renderDiagnosticStep();
}

function closeDiagnostic() {
  document.getElementById('diagnostic-overlay').classList.remove('open');
  document.body.classList.remove('modal-open');
}

function renderDiagnosticStep() {
  var q = QUESTIONS[currentStep];
  var content = document.getElementById('diagnostic-content');

  if (q.type === 'options') {
    content.innerHTML =
      '<div class="diag-question-wrap">' +
      '<p class="diag-step-label">' + q.label + '</p>' +
      '<h2 class="diag-title">' + q.title + '</h2>' +
      '<p class="diag-desc">' + q.desc + '</p>' +
      '<div class="diag-options">' +
      q.options.map(function (opt, i) {
        return '<div class="diag-option ' + (answers[q.id] === i ? 'selected' : '') + '" onclick="selectDiagOption(' + i + ')">' +
          '<div class="diag-option-icon"><i data-lucide="' + opt.icon + '"></i></div>' +
          '<div class="diag-option-info">' +
          '<div class="diag-option-label">' + opt.label + '</div>' +
          '<div class="diag-option-sub">' + opt.sub + '</div>' +
          '</div>' +
          '<div class="diag-option-check">' + (answers[q.id] === i ? '<i data-lucide="check" width="14"></i>' : '') + '</div>' +
          '</div>';
      }).join('') +
      '</div></div>';

    if (currentStep > 0) {
      content.querySelector('.diag-question-wrap').insertAdjacentHTML('beforeend', '<button type="button" class="diag-back" onclick="prevDiagStep()" style="margin-top:24px"><i data-lucide="arrow-left" width="16" style="margin-right:8px"></i> Voltar</button>');
    }
  } else {
    content.innerHTML =
      '<div class="diag-question-wrap">' +
      '<p class="diag-step-label">' + q.label + '</p>' +
      '<h2 class="diag-title">' + q.title + '</h2>' +
      '<div class="diag-fields">' +
      q.fields.map(function (f) {
        return '<div class="diag-field-wrap">' +
          '<input class="diag-input" id="diag-field-' + f.id + '" type="' + f.type + '" placeholder="' + f.placeholder + '" value="' + escapeHtml(textValues[f.id] || '') + '" oninput="clearDiagError(\'' + f.id + '\')">' +
          '<div class="diag-field-error" id="diag-error-' + f.id + '">Campo obrigatório</div>' +
          '</div>';
      }).join('') +
      '</div>' +
      '<div class="diag-nav">' +
      '<button type="button" class="btn-primary" onclick="nextDiagStep()">Avançar <i data-lucide="arrow-right" width="16" style="margin-left:8px"></i></button>' +
      '</div></div>';
  }
  
  lucide.createIcons();
}

function selectDiagOption(i) {
  answers[QUESTIONS[currentStep].id] = i;
  if (currentStep < QUESTIONS.length - 1) {
    setTimeout(function () {
      currentStep++;
      renderDiagnosticStep();
    }, 250);
  } else {
    setTimeout(runDiagLoading, 250);
  }
}

function nextDiagStep() {
  var q = QUESTIONS[currentStep];
  if (q.type === 'text') {
    var hasError = false;
    q.fields.forEach(function (f) {
      var inputEl = document.getElementById('diag-field-' + f.id);
      if (f.required && !inputEl.value.trim()) {
        hasError = true;
        document.getElementById('diag-error-' + f.id).style.display = 'block';
        inputEl.classList.add('input-error');
      }
      textValues[f.id] = inputEl.value.trim();
    });
    if (hasError) return;
  }
  currentStep++;
  renderDiagnosticStep();
}

function prevDiagStep() {
  currentStep--;
  renderDiagnosticStep();
}

function clearDiagError(fid) {
  document.getElementById('diag-error-' + fid).style.display = 'none';
  document.getElementById('diag-field-' + fid).classList.remove('input-error');
}

function runDiagLoading() {
  var content = document.getElementById('diagnostic-content');
  content.innerHTML =
    '<div class="diag-loading">' +
    '<div class="diag-loading-ring"></div>' +
    '<h2 class="diag-loading-title">Compilando dados...</h2>' +
    '<div class="diag-loading-steps">' +
    LOADING_STEPS.map(function (s, i) {
      return '<div class="diag-loading-step" id="dls-' + i + '">' +
        '<div class="diag-loading-step-icon"><i data-lucide="' + s.icon + '" width="14"></i></div>' +
        '<span>' + s.text + '</span>' +
        '</div>';
    }).join('') +
    '</div></div>';
  
  lucide.createIcons();

  var i = 0;
  var tick = function () {
    if (i > 0) {
      var prev = document.getElementById('dls-' + (i - 1));
      prev.classList.add('done');
      prev.querySelector('.diag-loading-step-icon').innerHTML = '<i data-lucide="check" width="14"></i>';
    }
    if (i < LOADING_STEPS.length) {
      document.getElementById('dls-' + i).classList.add('active');
      lucide.createIcons();
      i++;
      setTimeout(tick, 800);
    } else {
      setTimeout(showDiagResult, 500);
    }
  };
  tick();
}

function showDiagResult() {
  var content = document.getElementById('diagnostic-content');
  var nome = textValues.nome ? textValues.nome.split(' ')[0] : 'Gestor';
  
  var shareTxt = 'Olá! Fiz o diagnóstico na BG Tech e gostaria de agendar uma consultoria estratégica.';
  var wppUrl = 'https://wa.me/' + CONFIG.whatsappNumber + '?text=' + encodeURIComponent(shareTxt);

  content.innerHTML =
    '<div class="diag-result">' +
    '<div class="diag-result-header">' +
    '<h2 class="diag-result-title">Diagnóstico concluído, ' + escapeHtml(nome) + '.</h2>' +
    '</div>' +
    '<div class="diag-score-banner">' +
    '<div class="diag-score-info">' +
    '<div class="diag-score-label">Oportunidade de Escala Identificada</div>' +
    '<p class="diag-score-text">Com base nas suas respostas, sua operação possui gargalos claros que podem ser resolvidos com integração de sistemas e automação. O próximo passo é desenharmos a arquitetura dessa solução juntos.</p>' +
    '</div></div>' +
    '<div class="diag-result-cta">' +
    '<h3>Agende sua Reunião Estratégica</h3>' +
    '<p>Fale diretamente com nossos especialistas para analisar o escopo técnico.</p>' +
    '<a href="' + wppUrl + '" target="_blank" class="btn-primary" style="display:inline-flex;align-items:center;gap:8px;"><i data-lucide="calendar" width="18"></i> Falar com Especialista</a>' +
    '</div></div>';
    
  lucide.createIcons();

  // Enviar Webhook
  if (CONFIG.webhookUrl) {
    fetch(CONFIG.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: textValues.nome, empresa: textValues.empresa, telefone: textValues.whatsapp, respostas: answers })
    }).catch(e => console.error(e));
  }
}
