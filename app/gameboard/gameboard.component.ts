import {Component, ViewChild, OnInit} from '@angular/core';
import {GameboardService} from "./gameboard.service";

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
  @ViewChild("myCanvas") myCanvas: any;
  private winningPlayer: string ="";
  constructor(private gameboardService: GameboardService) {
    this.grid = new Grid();
    this.redsTurnState = new RedsTurnState();
    this.blacksTurnState = new BlacksTurnState();
    this.gameOverState = new GameOverState();
    this.state = this.redsTurnState;
  }

  ngOnInit(): void {
    this.context = this.myCanvas.nativeElement.getContext("2d");
    this.gameboardService.setContext(this.context);
    console.log(this.gameboardService.getContext());
    this.drawBoard();
  }

  drawBoard(): void {
    for (let row: number = 6; row >= 0; row--) {
      for (let column: number = 7; column > 0; column--) {
        this.gameboardService.drawPiece(column, row, "white")
      }
    }
  }


  dropInColumn(column: number) {
    let row = 6;
    while(this.grid.pieceAlreadyInSlot(row, column)) {
      row--
    }
    this.grid.addPiece(column, row, this.state.getPlayerColor());
    this.gameboardService.drawPiece(column, row, this.state.getPlayerColor());
    let connectedStrings: string[] = this.grid.getConnectedStrings(row, column);
    this.winningPlayer = this.state.checkForWinner(connectedStrings);
    if (this.gameIsOver()) {this.declareWinner(this.winningPlayer)}
    this.changeTurn();
  }

  gameIsOver() {
    return this.winningPlayer.length > 0;
  }

  private changeTurn(): void {
    this.state = this.state === this.redsTurnState ? this.blacksTurnState : this.redsTurnState;
  }

  startNewGame() {
    this.drawBoard();
    this.grid = new Grid();
    this.winningPlayer = "";
    this.state = this.redsTurnState;
  }

  declareWinner(winningPlayer: string) {

  }
}

// export class Graphics implements OnInit {
//   private context: CanvasRenderingContext2D;
//   @ViewChild("myCanvas") myCanvas: any;
//
//   ngOnInit(): void {
//     this.context = this.myCanvas.nativeElement.getContext("2d");
//   }
//   getContext() {
//     return this.context;
//   }
// }

export interface State {
  checkStringForWinner(row: string): any;
  getPlayerColor(): string;
  checkForWinner(connectedStrings: string[]): string;
}

class GameOverState implements State {
  getPlayerColor(): string {
    return null;
  }
  checkStringForWinner(row: string): any {
    return null;
  }
  checkForWinner(connectedStrings: string[]): string {
    return "";
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
  checkForWinner(connectedStrings: string[]): string {
    let returnString = "";
    let winningStrings = connectedStrings.filter((connectedLine: string) => {return this.checkStringForWinner(connectedLine)}, this);
    if (winningStrings.length > 0){
      returnString += this.getPlayerColor();
    }
    return returnString
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

// export class GameCoordinates {
//   private column;
//   private row;
//
//   constructor(column: number, row: number) {
//     this.column = column;
//     this.row = row;
//   }
// }
