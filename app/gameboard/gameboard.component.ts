import {Component, ViewChild, OnInit} from '@angular/core';

@Component({
  selector: 'gameboard',
  templateUrl: 'app/gameboard/gameboard.component.html',
  styleUrls: ['app/gameboard/gameboard.component.css']
})
export class GameboardComponent implements OnInit {

  state: any;
  context: CanvasRenderingContext2D;
  playersTurn: string = "red";
  grid: any = {1: [".",".",".",".",".",".","."], 2: [".",".",".",".",".",".","."], 3: [".",".",".",".",".",".","."], 4: [".",".",".",".",".",".","."], 5: [".",".",".",".",".",".","."], 6: [".",".",".",".",".",".","."]};

  @ViewChild("myCanvas") myCanvas: any;
  private winningPlayer: string ="";

  ngOnInit(): void {
    this.context = this.myCanvas.nativeElement.getContext("2d");
    this.drawBoard();
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
    while(this.pieceAlreadyInSlot(row, column)) {
      row--
    }
    this.trackPieceInGrid(column, row);
    this.drawPiece(column, row);
    this.changeTurn();
    this.checkForWinner(row, column);
    console.log(this.grid);
  }

  private pieceAlreadyInSlot(row: number, column: number) {
    return this.grid[row][column - 1] !== ".";
  }

  private changeTurn(): void {
    this.playersTurn = this.playersTurn === "red" ? "black": "red";
  }

  private trackPieceInGrid(column: number, row: number) {
    this.grid[row][column - 1] = this.playersTurn[0];
  }

  private drawBoard(): void {
    this.playersTurn = "white";
    for (let row: number = 6; row >= 0; row--){
        for (let column: number = 7; column > 0; column--){
            this.drawPiece(column, row)
        }
    }
    this.playersTurn = "red";
  }

  private checkForWinner(row: number, column: number) {
    this.checkRowsForWinner(row);
    this.checkColumnForWinner(column);
  }

  checkColumnForWinner(column: number) {
    let columnCollection = "";
    for (let row: number = 6; row > 0; row--){
      columnCollection += this.grid[row][column - 1]
    }
    if (columnCollection.includes("rrrr")){
      this.declareWinner("red");
    }
    if (columnCollection.includes("bbbb")){
      this.declareWinner("black");
    }
  }

  private checkRowsForWinner(row: number) {
      let bottomRow = this.grid[row].join("");
      if (bottomRow.includes("rrrr")) {
          this.declareWinner("red");
      }
      if (bottomRow.includes("bbbb")) {
          this.declareWinner("black");
      }
  }

  gameIsOver(): boolean {
    return this.winningPlayer.length > 0;
  }

  startNewGame() {
    this.drawBoard();
    this.grid = {1: [".",".",".",".",".",".","."], 2: [".",".",".",".",".",".","."], 3: [".",".",".",".",".",".","."], 4: [".",".",".",".",".",".","."], 5: [".",".",".",".",".",".","."], 6: [".",".",".",".",".",".","."]};
    this.winningPlayer = "";
  }

  declareWinner(playerColor: string) {
    this.winningPlayer = playerColor;
  }
}
