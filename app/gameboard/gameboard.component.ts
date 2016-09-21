import {Component, ViewChild, OnInit} from '@angular/core';

@Component({
  selector: 'gameboard',
  templateUrl: 'app/gameboard/gameboard.component.html',
  styleUrls: ['app/gameboard/gameboard.component.css']
})
export class GameboardComponent implements OnInit {
  private redsTurnState: State;
  private blacksTurnState: State;
  private gameOverState: State;
  private state: State;
  private context: CanvasRenderingContext2D;

  playersTurn: string = "red";
  grid: any = {1: [".",".",".",".",".",".","."], 2: [".",".",".",".",".",".","."], 3: [".",".",".",".",".",".","."], 4: [".",".",".",".",".",".","."], 5: [".",".",".",".",".",".","."], 6: [".",".",".",".",".",".","."]};
  @ViewChild("myCanvas") myCanvas: any;
  private winningPlayer: string ="";

  constructor() {
    this.redsTurnState = new RedsTurnState();
    this.blacksTurnState = new BlacksTurnState();
    this.gameOverState = new GameOverState();
    this.state = this.redsTurnState;
  }

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
    this.checkForWinner(row, column);
    this.changeTurn();
  }

  private pieceAlreadyInSlot(row: number, column: number) {
    return this.grid[row][column - 1] !== ".";
  }

  private changeTurn(): void {
    this.playersTurn = this.playersTurn === "red" ? "black": "red";
    this.state = this.state === this.redsTurnState ? this.blacksTurnState : this.redsTurnState;
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
    this.checkRowForWinner(this.grid[row].join(""));
    this.checkColumnForWinner(column);
    this.checkUpRightDiagonalForWinner(row, column);
    this.checkDownRightDiagonalForWinner(row, column);
  }

  checkUpRightDiagonalForWinner(row: number, column: number) {
    let currentDiagonalAsString = "";
    let currentRow = row;
    let currentColumn = column;
    while (currentRow < 6 && currentColumn > 1) {
      currentRow ++;
      currentColumn --;
    }

    while(currentRow >= 1 && currentColumn <= 7){
      currentDiagonalAsString += this.grid[currentRow][currentColumn - 1];
      currentRow--;
      currentColumn++;
    }
    if (this.state.checkStringForWinner(currentDiagonalAsString)){
      this.declareWinner(this.state.getPlayerColor());
    }
  }

  checkDownRightDiagonalForWinner(row: number, column: number) {
    let currentDiagonalAsString = "";
    let currentRow = row;
    let currentColumn = column;
    while (currentRow > 1 && currentColumn > 1) {
      currentRow --;
      currentColumn --;
    }

    while(currentRow <= 6 && currentColumn <= 7){
      currentDiagonalAsString += this.grid[currentRow][currentColumn - 1];
      currentRow++;
      currentColumn++;
    }
    if (this.state.checkStringForWinner(currentDiagonalAsString)){
      this.declareWinner(this.state.getPlayerColor());
    }
  }

  private checkColumnForWinner(column: number) {
    let columnCollection = "";
    for (let row: number = 6; row > 0; row--){
      columnCollection += this.grid[row][column - 1]
    }
    if (this.state.checkStringForWinner(columnCollection)){
      this.declareWinner(this.state.getPlayerColor());
    }
  }

  private checkRowForWinner(row: string) {
      if (this.state.checkStringForWinner(row)) {
          this.declareWinner(this.state.getPlayerColor());
      }
  }

  gameIsOver(): boolean {
    return this.winningPlayer.length > 0;
  }

  startNewGame() {
    this.drawBoard();
    this.grid = {1: [".",".",".",".",".",".","."], 2: [".",".",".",".",".",".","."], 3: [".",".",".",".",".",".","."], 4: [".",".",".",".",".",".","."], 5: [".",".",".",".",".",".","."], 6: [".",".",".",".",".",".","."]};
    this.winningPlayer = "";
    this.state = this.redsTurnState;
  }

  declareWinner(playerColor: string) {
    this.winningPlayer = playerColor;
  }
}

export interface State {
  checkStringForWinner(row: string): any;
  getPlayerColor(): string;

}

class GameOverState implements State {
  getPlayerColor(): string {
    return null;
  }
  checkStringForWinner(row: string): any {
    return null;
  }

}

abstract class PlayersTurn {
  protected playerColor: string;
  protected winningString: string;
  checkStringForWinner(row: string): boolean {
    return row.includes(this.winningString);
  }
  getPlayerColor(): string {
    return this.playerColor;
  }
}

export class RedsTurnState extends PlayersTurn implements State {
  playerColor: string = "red";
  winningString: string = "rrrr";

}
export class BlacksTurnState extends PlayersTurn implements State {
  playerColor: string = "black";
  winningString: string = "bbbb";
}

class Grid {
  grid: any;
  constructor() {
    this.grid = {
      1: [".",".",".",".",".",".","."],
      2: [".",".",".",".",".",".","."],
      3: [".",".",".",".",".",".","."],
      4: [".",".",".",".",".",".","."],
      5: [".",".",".",".",".",".","."],
      6: [".",".",".",".",".",".","."]
    };
  }
  getGrid(): any {
    return this.grid;
  }
}
