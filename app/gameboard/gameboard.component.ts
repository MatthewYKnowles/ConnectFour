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

  @ViewChild("myCanvas") myCanvas: any;
  private winningPlayer: string ="";

  constructor(private gameboardService: GameboardService) {
    this.grid = new Grid();
    this.redsTurnState = new RedsTurnState(this);
    this.blacksTurnState = new BlacksTurnState(this);
    this.gameOverState = new GameOverState(this);
    this.state = this.redsTurnState;
  }

  ngOnInit(): void {
    this.gameboardService.setContext(this.myCanvas.nativeElement.getContext("2d"));
    this.gameboardService.drawBoard();
  }

  drawPiece(column: number, row: number, color: string) {
    this.gameboardService.drawPiece(column, row, color);
  }

  private changeTurn(): void {
    this.state = this.state === this.redsTurnState ? this.blacksTurnState : this.redsTurnState;
  }

  startNewGame() {
    this.gameboardService.drawBoard();
    this.grid = new Grid();
    this.winningPlayer = "";
    this.state = this.redsTurnState;
  }
}

export interface State {
  checkStringForWinner(row: string): any;
  getPlayerColor(): string;
  checkForWinner(connectedStrings: string[]): string;
  dropInColumn(column: number): any;
}

class GameOverState implements State {

  constructor(private gameboardComponent: GameboardComponent) {

  }
  dropInColumn(column: number) {
    return null;
  }
  getPlayerColor(): string {
    return null;
  }
  checkStringForWinner(row: string): any {
    return null;
  }
  checkForWinner(connectedStrings: string[]): string {
    return null;
  }
}

abstract class PlayersTurn {
  protected playerColor: string;
  protected winningString: string;
  private gameboardComponent;

  dropInColumn(column: number) {
    let row = 6;
    while(this.gameboardComponent.grid.pieceAlreadyInSlot(row, column)) {
      row--
    }
    this.gameboardComponent.grid.addPiece(column, row, this.playerColor);
    this.gameboardComponent.drawPiece(column, row, this.playerColor);
    let connectedStrings: string[] = this.gameboardComponent.grid.getConnectedStrings(row, column);
    this.gameboardComponent.winningPlayer = this.checkForWinner(connectedStrings);
    if (this.gameboardComponent.winningPlayer.length > 0) {this.gameboardComponent.state = this.gameboardComponent.gameOverState}
    else {this.gameboardComponent.changeTurn();}
  }

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

  constructor(private gameboardComponent: GameboardComponent) {
    super();
    this.gameboardComponent = gameboardComponent;
  }

}
export class BlacksTurnState extends PlayersTurn implements State {
  playerColor: string = "black";
  winningString: string = "bbbb";

  constructor(private gameboardComponent: GameboardComponent) {
    super();
    this.gameboardComponent = gameboardComponent;
  }
}

export class Grid {
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
