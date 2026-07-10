/**
 * Visualisation LiDAR simplifiée (simulation)
 * Affiche un scan polaire sur canvas
 */
class LidarVisualizer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.points = [];
    this.angle = 0;
    this.running = false;
    this._animId = null;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    if (!this.canvas) return;
    const wrap = this.canvas.parentElement;
    this.canvas.width = wrap.clientWidth - 16;
    this.canvas.height = Math.min(300, wrap.clientWidth - 16);
    this.draw();
  }

  start() {
    if (this.running) return;
    this.running = true;
    this._tick();
  }

  stop() {
    this.running = false;
    if (this._animId) cancelAnimationFrame(this._animId);
  }

  _tick() {
    if (!this.running) return;
    this.angle = (this.angle + 3) % 360;
    this._generateScan();
    this.draw();
    this._animId = requestAnimationFrame(() => this._tick());
  }

  _generateScan() {
    this.points = [];
    for (let a = 0; a < 360; a += 2) {
      let dist = 1.5 + Math.random() * 2;
      if (a > 30 && a < 60) dist = 0.4 + Math.random() * 0.3;
      if (a > 150 && a < 200) dist = 0.8 + Math.random() * 0.5;
      if (a > 280 && a < 320) dist = 1.0 + Math.random() * 0.8;
      this.points.push({ angle: a, distance: dist });
    }
  }

  draw() {
    if (!this.ctx) return;
    const { canvas, ctx } = this;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const maxR = Math.min(cx, cy) - 10;
    const scale = maxR / 4;

    ctx.fillStyle = '#0a1628';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(0,194,203,0.15)';
    ctx.lineWidth = 1;
    for (let r = 1; r <= 4; r++) {
      ctx.beginPath();
      ctx.arc(cx, cy, r * scale, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.strokeStyle = 'rgba(0,194,203,0.2)';
    ctx.beginPath();
    ctx.moveTo(cx, 0); ctx.lineTo(cx, canvas.height);
    ctx.moveTo(0, cy); ctx.lineTo(canvas.width, cy);
    ctx.stroke();

    ctx.fillStyle = '#00c2cb';
    this.points.forEach(p => {
      const rad = (p.angle - 90) * Math.PI / 180;
      const x = cx + Math.cos(rad) * p.distance * scale;
      const y = cy + Math.sin(rad) * p.distance * scale;
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(0,194,203,0.3)';
    const sweepRad = (this.angle - 90) * Math.PI / 180;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(sweepRad) * maxR, cy + Math.sin(sweepRad) * maxR);
    ctx.strokeStyle = 'rgba(0,194,203,0.5)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

window.LidarVisualizer = LidarVisualizer;
