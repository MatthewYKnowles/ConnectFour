import {Injectable} from "@angular/core";

@Injectable()
export class GameboardService {
  private context: CanvasRenderingContext2D;

  setContext(canvasContext: CanvasRenderingContext2D) {
    this.context = canvasContext;
  }

  getContext() {
    return this.context;
  }
  drawPiece(column: number, row: number, color: string) {
    let ctx = this.context;
    let radius = 45;
    let startAngle = 0;
    let finishAngle = 2 * Math.PI;
    let yAxisCenterPoint = (row) * 100 - 50;
    let xAxisCenterPoint = column * 100 - 50;
    ctx.beginPath();
    ctx.arc(xAxisCenterPoint, yAxisCenterPoint, radius, startAngle, finishAngle);
    ctx.fillStyle = color;
    ctx.fill();
  }
}
