import {Component, ViewChild, OnInit} from '@angular/core';

@Component({
  selector: 'gameboard',
  templateUrl: 'app/gameboard/gameboard.component.html',
  styleUrls: ['app/gameboard/gameboard.component.css']
})
export class GameboardComponent implements OnInit {
  private grid: Grid;
  private redsTurnState: State;
  private blacksTurnState: State;
  private gameOverState: State;
  private state: State;

  private context: CanvasRenderingContext2D;
  playersTurn: string = "red";
  @ViewChild("myCanvas") myCanvas: any;
  private winningPlayer: string ="";

  constructor() {
    this.grid = new Grid();
    this.redsTurnState = new RedsTurnState();
    this.blacksTurnState = new BlacksTurnState();
    this.gameOverState = new GameOverState();
    this.state = this.redsTurnState;
  }

  ngOnInit(): void {
    this.context = this.myCanvas.nativeElement.getContext("2d");
    this.drawBoard();
  }

  drawBoard(): void {
    for (let row: number = 6; row >= 0; row--) {
      for (let column: number = 7; column > 0; column--) {
        this.drawPiece(column, row, "white")
      }
    }
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

  dropInColumn(column: number) {
    let row = 6;
    while(this.grid.pieceAlreadyInSlot(row, column)) {
      row--
    }
    this.grid.addPiece(column, row, this.state.getPlayerColor());
    this.drawPiece(column, row, this.state.getPlayerColor());
    let connectedStrings: string[] = this.grid.getConnectedStrings(row, column);
    this.checkForWinner(connectedStrings);
    this.changeTurn();
  }

  private changeTurn(): void {
    this.playersTurn = this.playersTurn === "red" ? "black": "red";
    this.state = this.state === this.redsTurnState ? this.blacksTurnState : this.redsTurnState;
  }

  gameIsOver(): boolean {
    return this.winningPlayer.length > 0;
  }

  startNewGame() {
    this.drawBoard();
    this.grid = new Grid();
    this.winningPlayer = "";
    this.state = this.redsTurnState;
  }

  declareWinner(playerColor: string) {
    this.winningPlayer = playerColor;
  }

  private checkForWinner(connectedStrings: string[]) {
    let winningStrings = connectedStrings.filter((connectedLine: string) => {return this.state.checkStringForWinner(connectedLine)}, this);

    if (winningStrings.length > 0){
      this.declareWinner(this.state.getPlayerColor());
    }
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
  checkStringForWinner(connectedString: string): boolean {
    return connectedString.includes(this.winningString);
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

  addPiece(column: number, row: number, playerColor: string) {
    this.grid[row][column - 1] = playerColor[0];
  }

  pieceAlreadyInSlot(row: number, column: number) {
    return this.grid[row][column - 1] !== ".";
  }

  getConnectedStrings(row: number, column: number) {
    let connectedStringsArray: string[] = [];
    connectedStringsArray.push(this.getRow(row));
    connectedStringsArray.push(this.getColumn(column));
    connectedStringsArray.push(this.getUpRightDiagonal(row, column));
    connectedStringsArray.push(this.getDownRightDiagonal(row, column));
    return connectedStringsArray;
  }

  private getRow(row: number) {
    return this.grid[row].join("");
  }

  private getColumn(column: number) {
    let columnCollection = "";
    for (let row: number = 6; row > 0; row--){
      columnCollection += this.grid[row][column - 1]
    }
    return columnCollection;
  }

  private getUpRightDiagonal(row: number, column: number) {
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
    return currentDiagonalAsString;
  }

  private getDownRightDiagonal(row: number, column: number) {
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
    return currentDiagonalAsString;
  }
}
