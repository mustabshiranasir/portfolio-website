export default class WOW {
  defaults = {
    boxClass: 'wow',
    animateClass: 'animated',
    offset: 0,
    mobile: true,
    live: true,
    callback: null,
    scrollContainer: null,
    resetAnimation: true,
  };

  constructor(options = {}) {
    this.start = this.start.bind(this);
    this.resetAnimation = this.resetAnimation.bind(this);
    this.scrollHandler = this.scrollHandler.bind(this);
    this.scrollCallback = this.scrollCallback.bind(this);
    this.scrolled = true;
    this.config = { ...this.defaults, ...options };
    if (options.scrollContainer) {
      this.config.scrollContainer = document.querySelector(options.scrollContainer);
    }
    this.animationNameCache = new WeakMap();
  }

  init() {
    this.element = document.documentElement;
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
      this.start();
    } else {
      document.addEventListener('DOMContentLoaded', this.start);
    }
  }

  start() {
    this.stopped = false;
    this.boxes = Array.from(this.element.querySelectorAll(`.${this.config.boxClass}`));
    this.all = [...this.boxes];

    if (!this.disabled()) {
      this.boxes.forEach(box => this.applyStyle(box, true));
      const container = this.config.scrollContainer || window;
      container.addEventListener('scroll', this.scrollHandler);
      window.addEventListener('resize', this.scrollHandler);
      this.interval = setInterval(this.scrollCallback, 50);
    }

    if (this.config.live) {
      const observer = new MutationObserver(records => {
        records.forEach(record => {
          record.addedNodes.forEach(node => this.doSync(node));
        });
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }

  stop() {
    this.stopped = true;
    const container = this.config.scrollContainer || window;
    container.removeEventListener('scroll', this.scrollHandler);
    window.removeEventListener('resize', this.scrollHandler);
    clearInterval(this.interval);
  }

  doSync(element) {
    if (!element || element.nodeType !== 1) return;
    element = element.parentNode || element;
    const boxes = element.querySelectorAll(`.${this.config.boxClass}`);
    boxes.forEach(box => {
      if (!this.all.includes(box)) {
        this.boxes.push(box);
        this.all.push(box);
        if (!this.stopped && !this.disabled()) this.applyStyle(box, true);
        this.scrolled = true;
      }
    });
  }

  show(box) {
    this.applyStyle(box);
    box.classList.add(this.config.animateClass);
    if (this.config.callback) this.config.callback(box);
    if (this.config.resetAnimation) {
      ['animationend', 'oanimationend', 'webkitAnimationEnd', 'MSAnimationEnd'].forEach(evt => {
        box.addEventListener(evt, this.resetAnimation);
      });
    }
  }

  applyStyle(box, hidden) {
    const duration = box.getAttribute('data-wow-duration');
    const delay = box.getAttribute('data-wow-delay');
    const iteration = box.getAttribute('data-wow-iteration');
    box.style.visibility = hidden ? 'hidden' : 'visible';
    if (duration) box.style.animationDuration = duration;
    if (delay) box.style.animationDelay = delay;
    if (iteration) box.style.animationIterationCount = iteration;
    box.style.animationName = hidden ? 'none' : this.cachedAnimationName(box) || box.style.animationName;
  }

  resetAnimation(event) {
    if (event.type.toLowerCase().includes('animationend')) {
      const target = event.target || event.srcElement;
      target.classList.remove(this.config.animateClass);
    }
  }

  scrollHandler() { this.scrolled = true; }

  scrollCallback() {
    if (!this.scrolled) return;
    this.scrolled = false;
    this.boxes = this.boxes.filter(box => {
      if (this.isVisible(box)) {
        this.show(box);
        return false;
      }
      return true;
    });
    if (!this.boxes.length && !this.config.live) this.stop();
  }

  offsetTop(element) {
    let top = 0;
    while (element) {
      top += element.offsetTop || 0;
      element = element.offsetParent;
    }
    return top;
  }

  isVisible(box) {
    const offset = parseInt(box.getAttribute('data-wow-offset') || this.config.offset, 10);
    const viewTop = this.config.scrollContainer ? this.config.scrollContainer.scrollTop : window.pageYOffset;
    const viewBottom = viewTop + Math.min(document.documentElement.clientHeight, window.innerHeight) - offset;
    const top = this.offsetTop(box);
    const bottom = top + box.clientHeight;
    return top <= viewBottom && bottom >= viewTop;
  }

  cachedAnimationName(box) {
    if (!this.animationNameCache.has(box)) {
      const style = window.getComputedStyle(box);
      const name = style.getPropertyValue('animation-name') || '';
      this.animationNameCache.set(box, name);
    }
    return this.animationNameCache.get(box);
  }

  disabled() {
    return !this.config.mobile && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }


}

