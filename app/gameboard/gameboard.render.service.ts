import {Injectable} from "@angular/core";

@Injectable()
export class GameboardRenderService {
  private context: CanvasRenderingContext2D;

  setContext(canvasContext: CanvasRenderingContext2D) {
    this.context = canvasContext;
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

  drawBoard(): void {
    this.drawBackground();
    for (let row: number = 6; row >= 0; row--) {
      for (let column: number = 7; column > 0; column--) {
        this.drawPiece(column, row, "white")
      }
    }
  }

  private drawBackground() {
    let ctx = this.context;
    ctx.fillStyle = "#e6e600";
    ctx.fillRect(0, 0, 700, 600)
  }
}
