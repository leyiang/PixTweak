import type { Vec } from '@/core/Vec';
import { defineStore } from 'pinia'
import { useCanvasStore } from './CanvasStore';

export const useBrushStore = defineStore('brush-store', {
    state: () => {
        return {
            drawings: [] as Vec[],
            lineWidth: 30,
            color: "#FFFFFF",
        }
    },

    actions: {
        renderDrawings(ctx: CanvasRenderingContext2D, drawOnMask = false) {
            const drawingPoints = this.drawings;
            const canvasStore = useCanvasStore();
            const scale = 1 / canvasStore.scale;

            ctx.beginPath();

            for (let i = 1; i < drawingPoints.length; i++) {
                const prev = drawingPoints[i - 1];
                const current = drawingPoints[i];

                if (i === 1) {
                    ctx.moveTo(prev.x * scale, prev.y * scale);
                    ctx.lineTo(current.x * scale, current.y * scale);
                } else {
                    const start = drawingPoints[i - 2];
                    const lastX = (start.x + prev.x) / 2;
                    const lastY = (start.y + prev.y) / 2;

                    const x = (prev.x + current.x) / 2;
                    const y = (prev.y + current.y) / 2;
                    ctx.moveTo(lastX * scale, lastY * scale);
                    ctx.quadraticCurveTo(prev.x * scale, prev.y * scale, x * scale, y * scale);
                }
            }

            ctx.lineCap = 'round';
            ctx.lineJoin = "round";
            ctx.strokeStyle = this.color;
            ctx.lineWidth = this.lineWidth;

            // stimulate photoshop mask
            // white to show things
            // black to hide things
            if (drawOnMask) {
                if (this.color === "#FFFFFF") {
                    ctx.globalCompositeOperation = "destination-out";
                }
            }

            ctx.stroke();
            ctx.globalCompositeOperation = "source-over";
        },

        increaseBrusSize(factor = 5) {
            this.lineWidth += factor;
        },

        decreaseBrusSize(factor = 5) {
            this.lineWidth -= factor;
        },

        switchBlackWhiteColor() {
            if (this.color === "#FFFFFF") {
                this.color = "#000000";
            } else {
                this.color = "#FFFFFF";
            }
        }
    },
})