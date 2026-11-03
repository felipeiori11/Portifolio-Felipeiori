// Horizontal Floating Dock. Hit areas and bar height remain stable during magnification.
(() => {
  const dock = document.querySelector('.floating-dock');
  if (!dock) return;
  const rail = dock.querySelector('.dock-rail');
  const links = [...dock.querySelectorAll('.dock-item')];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(any-hover: hover) and (any-pointer: fine)');
  const states = links.map(link => ({link, value: 0, target: 0, velocity: 0}));
  let animation = null;
  let previousTime = 0;

  function step(time) {
    const elapsed = Math.min(Math.max((time - previousTime) / 1000, .001), .064);
    previousTime = time;
    const steps = Math.ceil(elapsed / (1 / 240));
    const dt = elapsed / steps;
    let moving = false;
    states.forEach(state => {
      for (let i = 0; i < steps; i++) {
        const acceleration = (150 * (state.target - state.value) - 12 * state.velocity) / .1;
        state.velocity += acceleration * dt;
        state.value += state.velocity * dt;
      }
      if (Math.abs(state.target - state.value) < .0001 && Math.abs(state.velocity) < .0001) {
        state.value = state.target;
        state.velocity = 0;
      } else moving = true;
      state.link.style.setProperty('--dock-grow', state.value.toFixed(5));
    });
    animation = moving ? requestAnimationFrame(step) : null;
  }
  function animate() {
    if (animation !== null) return;
    previousTime = performance.now();
    animation = requestAnimationFrame(step);
  }
  function reset(immediate = false) {
    states.forEach(state => {state.target = 0;});
    if (!immediate && !reduced.matches) {animate(); return;}
    if (animation !== null) cancelAnimationFrame(animation);
    animation = null;
    states.forEach(state => {
      state.value = 0;
      state.velocity = 0;
      state.link.style.removeProperty('--dock-grow');
    });
  }
  function magnify(clientX) {
    if (reduced.matches) return;
    states.forEach(state => {
      const bounds = state.link.getBoundingClientRect();
      state.target = Math.max(0, 1 - Math.abs(clientX - bounds.left - bounds.width / 2) / 150);
    });
    animate();
  }
  function reveal(link, center = false) {
    if (rail.scrollWidth > rail.clientWidth) link?.scrollIntoView({block: 'nearest', inline: center ? 'center' : 'nearest', behavior: 'instant'});
  }
  links.forEach((link, index) => {
    for (const eventName of ['pointerenter', 'pointermove']) {
      link.addEventListener(eventName, event => {
        if (event.pointerType !== 'touch') magnify(event.clientX);
      });
    }
    link.addEventListener('pointerleave', () => reset());
    link.addEventListener('focus', () => {
      reveal(link);
      if (!finePointer.matches) return;
      const bounds = link.getBoundingClientRect();
      magnify(bounds.left + bounds.width / 2);
    });
    link.addEventListener('blur', event => {if (!dock.contains(event.relatedTarget)) reset();});
    link.addEventListener('click', () => reset(true));
    link.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? links.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + links.length) % links.length;
      links[next].focus({preventScroll: true});
    });
  });
  rail.addEventListener('pointerleave', () => reset());
  rail.addEventListener('pointercancel', () => reset(true));
  rail.addEventListener('scroll', () => reset(true), {passive: true});
  rail.addEventListener('wheel', event => {
    if (event.ctrlKey || rail.scrollWidth <= rail.clientWidth || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
    event.preventDefault();
    rail.scrollLeft += event.deltaY;
  }, {passive: false});
  const refresh = () => {reset(true); reveal(dock.querySelector('[aria-current="page"]'), true);};
  reduced.addEventListener('change', refresh);
  finePointer.addEventListener('change', refresh);
  window.addEventListener('resize', refresh);
  window.addEventListener('hashchange', refresh);
  window.addEventListener('blur', () => reset(true));
  document.addEventListener('visibilitychange', () => {if (document.hidden) reset(true);});
  reveal(dock.querySelector('[aria-current="page"]'), true);
})();
