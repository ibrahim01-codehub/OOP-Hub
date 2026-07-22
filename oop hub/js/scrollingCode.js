/* ==========================================================================
   HERO CODE PANEL — auto-scrolling snippet

   Fills #hero-code-output with a small code sample and scrolls it upward
   forever at a steady, readable pace. Self-starting: just include this
   script after the page's HTML (a <script> tag anywhere, or pasted into
   an existing file) and it runs on its own — no function to call, no
   setup step.

   No CSS changes needed. It reuses the existing .code-panel-code font/
   color/white-space rules and sets the one extra property it needs
   (overflow: hidden on the panel body, so the second copy clips instead
   of showing a scrollbar) directly from here.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
  var codeOutput = document.getElementById('hero-code-output');
  if (!codeOutput) return;

  // A small, complete example — matches the "Car.js" tab already shown
  // in the panel header, and the same Car example used elsewhere on
  // the site (brand / color / speed, drive / brake / honk).
  var snippet = [
    'class Car {',
    '  constructor(brand, color) {',
    '    this.brand = brand;',
    '    this.color = color;',
    '    this.speed = 0;',
    '  }',
    '',
    '  drive() {',
    '    this.speed += 10;',
    '  }',
    '',
    '  brake() {',
    '    this.speed = 0;',
    '  }',
    '',
    '  honk() {',
    '    console.log("Beep beep!");',
    '  }',
    '}',
    '',
    'const myCar = new Car("Toyota", "Red");',
    'myCar.drive();'
  ].join('\n');

  // Respect visitors who've asked for less motion — show the snippet
  // as still, readable code instead of animating it.
  var prefersReducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    codeOutput.textContent = snippet;
    return;
  }

  codeOutput.style.display = 'block';

  // Two identical copies stacked back-to-back. Once the first copy has
  // scrolled fully out of view, the second sits exactly where the first
  // started, so the reset is invisible and the loop never visibly jumps.
  var track = document.createElement('div');
  var blockA = document.createElement('div');
  blockA.textContent = snippet;
  var blockB = blockA.cloneNode(true);
  track.appendChild(blockA);
  track.appendChild(blockB);
  codeOutput.appendChild(track);

  // Clip the overflowing second copy instead of showing a scrollbar.
  var viewport = codeOutput.closest('.code-panel-body') || codeOutput.parentElement;
  if (viewport) viewport.style.overflow = 'hidden';

  var SPEED = 28; // pixels per second — tune this for faster/slower scroll
  var offset = 0;
  var blockHeight = 0;
  var lastTime = null;

  function measure() {
    blockHeight = blockA.getBoundingClientRect().height;
  }
  measure();
  window.addEventListener('resize', measure);
  // Re-measure once the web font has actually loaded, in case the
  // fallback font it swapped in briefly had different line heights.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(measure);
  }

  function tick(time) {
    if (lastTime === null) lastTime = time;
    var deltaSeconds = (time - lastTime) / 1000;
    lastTime = time;

    offset += SPEED * deltaSeconds;
    if (blockHeight > 0 && offset >= blockHeight) {
      offset -= blockHeight;
    }

    track.style.transform = 'translateY(-' + offset.toFixed(1) + 'px)';
    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
});