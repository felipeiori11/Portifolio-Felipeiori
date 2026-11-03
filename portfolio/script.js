// Navegação e interações da adaptação estática do Sidefolio.
document.documentElement.classList.add('js');
const sections = [...document.querySelectorAll('.aba')];
const navLinks = [...document.querySelectorAll('.abas a')];
function showSection(focus = false) {
  const target = document.getElementById(location.hash.slice(1));
  const active = target?.closest('.aba') || document.getElementById('inicio');
  sections.forEach(section => section.classList.toggle('ativa', section === active));
  navLinks.forEach(link => {
    if (link.hash === '#' + active.id) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  document.title = `${active.id === 'inicio' ? 'Felipe Iori de Souza' : active.querySelector('h1').textContent + ' | Felipe Iori'} | Desenvolvedor de software`;
  if (focus) {
    const heading = active.querySelector('h1');
    heading.focus({ preventScroll: true });
    if (target && target !== active) target.scrollIntoView({ block: 'start' });
    else window.scrollTo({ top: 0, behavior: 'instant' });
  }
}
window.addEventListener('hashchange', () => showSection(true));
showSection();

const skillInfo = {
  aliest: ['Aliest — Estagiário em Automação e Dados', 'Aliest · Estágio\nout. de 2026 – atual\nCuritiba, Paraná, Brasil · No local'],
  positivo: ['Universidade Positivo — Engenharia de Software', 'Ensino superior · Cursando\n2026 – 2029'],
  wizard: ['Wizard', 'Curso de Inglês\nIdioma · jan. de 2026 – atual\nNível B1']
};
let dialogTrigger = null;
function openDialog(dialog, trigger) {
  if (!dialog || dialog.open) return;
  dialogTrigger = trigger;
  dialog.showModal();
}
const bindings = {
  'data-curriculo-modal': 'curriculo-modal',
  'data-projeto-modal': 'projeto-automacao',
  'data-portal-modal': 'portal-modal',
  'data-crm-modal': 'crm-modal',
  'data-aulas-modal': 'aulas-modal'
};
for (const [attribute, id] of Object.entries(bindings)) {
  document.querySelectorAll(`[${attribute}]`).forEach(trigger => trigger.addEventListener('click', event => {
    event.preventDefault();
    openDialog(document.getElementById(id), trigger);
  }));
}
document.querySelectorAll('[data-modal]').forEach(trigger => trigger.addEventListener('click', event => {
  event.preventDefault();
  const info = skillInfo[trigger.dataset.modal];
  if (!info) return;
  document.getElementById('habilidade-modal-titulo').textContent = info[0];
  document.getElementById('habilidade-modal-descricao').textContent = info[1];
  openDialog(document.getElementById('habilidade-modal'), trigger);
}));
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('.habilidade-modal-fechar')?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => {
    if (dialogTrigger?.getClientRects().length) dialogTrigger.focus({ preventScroll: true });
    else document.querySelector('.abas a[aria-current="page"]')?.focus({ preventScroll: true });
    dialogTrigger = null;
  });
});

// Accessible, manual galleries keep images stable while visitors read each description.
for (const prefix of ['portal', 'crm', 'aulas']) {
  const dialog = document.getElementById(prefix + '-modal');
  const track = document.getElementById(prefix + '-track');
  const slides = [...track.children];
  const dots = [...dialog.querySelectorAll('.aula-indicador')];
  let current = 0;
  function showSlide(index) {
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    slides.forEach((slide, i) => { slide.inert = i !== current; slide.setAttribute('aria-hidden', String(i !== current)); });
    dots.forEach((dot, i) => {
      dot.classList.toggle('ativo', i === current);
      if (i === current) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
  }
  document.getElementById(prefix + '-anterior').addEventListener('click', () => showSlide(current - 1));
  document.getElementById(prefix + '-proxima').addEventListener('click', () => showSlide(current + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => showSlide(i)));
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); showSlide(current - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); showSlide(current + 1); }
  });
  dialog.querySelector('.aulas-autoavanco').textContent = 'Use as setas ou os indicadores para explorar as imagens.';
  dialog.addEventListener('close', () => showSlide(0));
  showSlide(0);
}
const projectTabs = [...document.querySelectorAll('[data-projetos-visao]')];
function showProjectTab(tab, focus = false) {
  projectTabs.forEach(button => {
    const selected = button === tab;
    button.classList.toggle('ativa', selected);
    button.setAttribute('aria-selected', String(selected));
    button.tabIndex = selected ? 0 : -1;
  });
  document.querySelectorAll('[data-projetos-conteudo]').forEach(panel => { panel.hidden = panel.dataset.projetosConteudo !== tab.dataset.projetosVisao; });
  if (focus) tab.focus();
}
projectTabs.forEach((tab, index) => {
  const panel = document.querySelector(`[data-projetos-conteudo="${tab.dataset.projetosVisao}"]`);
  tab.id = 'tab-' + tab.dataset.projetosVisao;
  tab.setAttribute('aria-controls', panel.id);
  panel.setAttribute('role', 'tabpanel');
  panel.setAttribute('aria-labelledby', tab.id);
  tab.addEventListener('click', () => showProjectTab(tab));
  tab.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? projectTabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + projectTabs.length) % projectTabs.length;
    showProjectTab(projectTabs[next], true);
  });
});
showProjectTab(projectTabs[0]);

// 3D Card: tilt the body and lift independent layers without changing links or dialogs.
const cardMotion = window.matchMedia('(hover: hover) and (pointer: fine)');
const cardReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const resetProjectCards = [];
document.querySelectorAll('[data-card-3d]').forEach(scene => {
  const body = scene.querySelector('.project-card-3d');
  let frame = null;
  let pointerInside = false;
  const enabled = () => cardMotion.matches && !cardReducedMotion.matches;
  const reset = () => {
    pointerInside = false;
    if (frame !== null) window.cancelAnimationFrame(frame);
    frame = null;
    scene.classList.remove('is-interacting');
    body.style.removeProperty('--card-rotate-x');
    body.style.removeProperty('--card-rotate-y');
  };
  resetProjectCards.push(reset);
  scene.addEventListener('pointerenter', event => {
    if (!enabled() || event.pointerType === 'touch') return;
    pointerInside = true;
    scene.classList.add('is-interacting');
  });
  scene.addEventListener('pointermove', event => {
    if (!enabled() || event.pointerType === 'touch') return;
    const { left, top, width, height } = scene.getBoundingClientRect();
    if (!width || !height) return;
    pointerInside = true;
    const rotateY = (event.clientX - left - width / 2) / 25;
    const rotateX = (event.clientY - top - height / 2) / 25;
    if (frame !== null) window.cancelAnimationFrame(frame);
    frame = window.requestAnimationFrame(() => {
      scene.classList.add('is-interacting');
      body.style.setProperty('--card-rotate-x', `${rotateX}deg`);
      body.style.setProperty('--card-rotate-y', `${rotateY}deg`);
      frame = null;
    });
  });
  scene.addEventListener('pointerleave', () => { pointerInside = false; reset(); });
  scene.addEventListener('pointercancel', () => { pointerInside = false; reset(); });
  scene.addEventListener('focusin', () => {
    if (enabled()) scene.classList.add('is-interacting');
  });
  scene.addEventListener('focusout', event => {
    if (!pointerInside && !scene.contains(event.relatedTarget)) reset();
  });
});
const resetAllProjectCards = () => resetProjectCards.forEach(reset => reset());
cardMotion.addEventListener('change', resetAllProjectCards);
cardReducedMotion.addEventListener('change', resetAllProjectCards);
window.addEventListener('hashchange', resetAllProjectCards);
window.addEventListener('blur', resetAllProjectCards);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) resetAllProjectCards();
});
