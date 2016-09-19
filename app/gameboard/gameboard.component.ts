import {Component, ViewChild, AfterViewInit} from '@angular/core';

@Component({
  selector: 'gameboard',
  templateUrl: 'app/gameboard/gameboard.component.html',
  styleUrls: ['app/gameboard/gameboard.component.css']
})
export class GameboardComponent implements AfterViewInit {

  context: CanvasRenderingContext2D;
  playersTurn: string = "red";
  grid: any = {1: [".",".",".",".",".",".","."], 2: [".",".",".",".",".",".","."], 3: [".",".",".",".",".",".","."], 4: [".",".",".",".",".",".","."], 5: [".",".",".",".",".",".","."], 6: [".",".",".",".",".",".","."]};

  @ViewChild("myCanvas") myCanvas: any;

  ngAfterViewInit(): void {
    this.context = this.myCanvas.nativeElement.getContext("2d");
    this.dropInColumn(1);
    this.dropInColumn(1);
  }

  drawPiece(column: number, row: number) {
    let ctx = this.context;
    let radius = 45;
    let startAngle = 0;
    let finishAngle = 2 * Math.PI;
    let yAxisCenterPoint = (row) * 100 - 50;
    let xAxisCenterPoint = column * 100 - 50;
    ctx.beginPath();
    ctx.arc(xAxisCenterPoint, yAxisCenterPoint, radius, startAngle, finishAngle);
    ctx.fillStyle = this.playersTurn;
    ctx.fill();
  }

  dropInColumn(column: number) {
    let row = 6;
    if (this.grid[row][column - 1] !== ".") {
      row--;
    }
    this.trackPieceInGrid(column, row);
    this.drawPiece(column, row);
    this.changeTurn();
    console.log(this.grid);
  }
  changeTurn(): void {
    this.playersTurn = this.playersTurn === "red" ? "black": "red";
  }

  private trackPieceInGrid(column: number, row: number) {
    this.grid[row][column - 1] = this.playersTurn[0];
  }
}
