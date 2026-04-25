import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-cursor-trail',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './cursor-trail.component.html',
  styleUrl: './cursor-trail.component.css'
})
export class CursorTrailComponent implements OnInit, OnDestroy {
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private raf!: number;

  private mouse   = { x: 0, y: 0 };
  private current = { x: 0, y: 0 };  // smoothed position
  private points: { x: number; y: number; age: number }[] = [];

  private mouseMoveHandler!: (e: MouseEvent) => void;
  private resizeHandler!: () => void;

  private readonly MAX_POINTS = 60;
  private readonly MAX_AGE    = 20;
  private readonly LERP       = 0.95;  // lower = smoother/longer lag, higher = snappier
  private readonly NEON_COLOR = '#ff0080'; // hot pink

  ngOnInit() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    this.canvas = document.getElementById('trail-canvas') as HTMLCanvasElement;
    this.ctx    = this.canvas.getContext('2d')!;
    this.resize();

    this.resizeHandler = () => this.resize();
    window.addEventListener('resize', this.resizeHandler);

    this.mouseMoveHandler = (e: MouseEvent) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    };

    window.addEventListener('mousemove', this.mouseMoveHandler);
    this.animate();
  }

  private resize() {
    this.canvas.width  = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  private animate() {
    // lerp current toward mouse every frame — fills gaps between mousemove events
    this.current.x += (this.mouse.x - this.current.x) * this.LERP;
    this.current.y += (this.mouse.y - this.current.y) * this.LERP;

    // only add a new point if moved enough (avoids duplicate points when idle)
    const last = this.points[this.points.length - 1];
    const dx   = last ? this.current.x - last.x : Infinity;
    const dy   = last ? this.current.y - last.y : Infinity;
    if (!last || Math.sqrt(dx * dx + dy * dy) > 1.5) {
      this.points.push({ x: this.current.x, y: this.current.y, age: 0 });
    }

    if (this.points.length > this.MAX_POINTS) this.points.shift();

    // age
    this.points.forEach(p => p.age++);
    this.points = this.points.filter(p => p.age < this.MAX_AGE);

    // draw
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.points.length < 2) {
      this.raf = requestAnimationFrame(() => this.animate());
      return;
    }

    // draw as a single smooth path using quadratic curves
    this.ctx.beginPath();
    this.ctx.moveTo(this.points[0].x, this.points[0].y);

    for (let i = 1; i < this.points.length - 1; i++) {
      // midpoint smoothing
      const mx = (this.points[i].x + this.points[i + 1].x) / 2;
      const my = (this.points[i].y + this.points[i + 1].y) / 2;
      this.ctx.quadraticCurveTo(this.points[i].x, this.points[i].y, mx, my);
    }

    // glow layer
    this.ctx.strokeStyle = this.NEON_COLOR;
    this.ctx.lineWidth   = 2.5;
    this.ctx.lineCap     = 'round';
    this.ctx.lineJoin    = 'round';
    this.ctx.globalAlpha = 0.9;
    this.ctx.shadowBlur  = 15;
    this.ctx.shadowColor = this.NEON_COLOR;
    this.ctx.stroke();

    // bright white core
    this.ctx.beginPath();
    this.ctx.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 1; i < this.points.length - 1; i++) {
      const mx = (this.points[i].x + this.points[i + 1].x) / 2;
      const my = (this.points[i].y + this.points[i + 1].y) / 2;
      this.ctx.quadraticCurveTo(this.points[i].x, this.points[i].y, mx, my);
    }
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth   = 0.8;
    this.ctx.globalAlpha = 0.6;
    this.ctx.shadowBlur  = 4;
    this.ctx.shadowColor = '#ffffff';
    this.ctx.stroke();

    // fade tail — redraw with gradient opacity per segment
    for (let i = 1; i < this.points.length; i++) {
      const life = 1 - this.points[i].age / this.MAX_AGE;
      const p    = this.points[i];
      const prev = this.points[i - 1];

      this.ctx.beginPath();
      this.ctx.moveTo(prev.x, prev.y);
      this.ctx.lineTo(p.x, p.y);
      this.ctx.strokeStyle = this.NEON_COLOR;
      this.ctx.lineWidth   = life * 2;
      this.ctx.globalAlpha = life * 0.4;
      this.ctx.shadowBlur  = 8;
      this.ctx.shadowColor = this.NEON_COLOR;
      this.ctx.stroke();
    }

    this.ctx.globalAlpha = 1;
    this.ctx.shadowBlur  = 0;
    this.raf = requestAnimationFrame(() => this.animate());
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.raf);
    window.removeEventListener('mousemove', this.mouseMoveHandler);
    window.removeEventListener('resize', this.resizeHandler);
  }
}
