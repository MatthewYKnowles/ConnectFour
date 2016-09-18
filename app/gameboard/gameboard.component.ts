import {Component, ViewChild, AfterViewInit} from '@angular/core';

@Component({
  selector: 'gameboard',
  templateUrl: 'app/gameboard/gameboard.component.html'
})
export class GameboardComponent implements AfterViewInit {

  context: CanvasRenderingContext2D;
  playersTurn: string = "red";

  @ViewChild("myCanvas") myCanvas: any;

  ngAfterViewInit(): void {
    console.log(this.myCanvas);
    this.context = this.myCanvas.nativeElement.getContext("2d");
    this.drawPiece(1, 7);
    this.drawPiece(2, 7);
    this.drawPiece(1, 6);
    this.drawPiece(1, 5);
  }

  drawPiece(column: number, row: number) {
    let ctx = this.context;
    let radius = 45;
    let startAngle = 0;
    let finishAngle = 2 * Math.PI;
    let yAxisCenterPoint = (row - 1) * 100 - 50;
    let xAxisCenterPoint = column * 100 - 50;
    ctx.beginPath();
    ctx.arc(xAxisCenterPoint, yAxisCenterPoint, radius, startAngle, finishAngle);
    ctx.fillStyle = this.playersTurn;
    ctx.fill();
    this.changeTurn();
  }
  changeTurn(): void {
    this.playersTurn = this.playersTurn === "red" ? "black": "red";
  }
}
