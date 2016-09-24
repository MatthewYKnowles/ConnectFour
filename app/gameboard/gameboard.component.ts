import {Component, ViewChild, OnInit} from '@angular/core';
import {GameboardService} from "./gameboard.service";

@Component({
  selector: 'gameboard',
  templateUrl: 'app/gameboard/gameboard.component.html',
  styleUrls: ['app/gameboard/gameboard.component.css']
})
export class GameboardComponent implements OnInit {
  gameboardService: GameboardService;
  grid: Grid;
  redsTurnState: State;
  blacksTurnState: State;
  gameOverState: State;
  state: State;

  @ViewChild("myCanvas") myCanvas: any;
  winningPlayer: string ="";

  constructor(gameboardService: GameboardService) {
    this.gameboardService = gameboardService;
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

  setState(newState: State) {
    this.state = newState;
  }
}

export interface State {
  dropInColumn(column: number): any;
  startNewGame(): void;
}

class GameOverState implements State {
  constructor(private gameboardComponent: GameboardComponent) {

  }

  startNewGame() {
    this.gameboardComponent.gameboardService.drawBoard();
    this.gameboardComponent.grid = new Grid();
    this.gameboardComponent.winningPlayer = "";
    this.gameboardComponent.state = this.gameboardComponent.redsTurnState;
  }

  dropInColumn(column: number): any {
    return null;
  }
}

abstract class PlayersTurn {
  protected playerColor: string;
  protected winningString: string;
  protected gameboardComponent: GameboardComponent;

  dropInColumn(column: number) {
    let row = 6;
    while(this.gameboardComponent.grid.pieceAlreadyInSlot(row, column)) {
      row--
    }
    this.gameboardComponent.grid.addPiece(column, row, this.playerColor);
    this.gameboardComponent.gameboardService.drawPiece(column, row, this.playerColor);
    let connectedStrings: string[] = this.gameboardComponent.grid.getConnectedStrings(row, column);
    if (this.checkForWinner(connectedStrings).length > 0) {this.setGameOverState();}
    else {this.changeTurn()}
  }

  private setGameOverState() {
    this.gameboardComponent.setState(this.gameboardComponent.gameOverState);
    this.gameboardComponent.winningPlayer = this.playerColor;
  }

  checkStringForWinner(connectedString: string): boolean {
    return connectedString.includes(this.winningString);
  }
  checkForWinner(connectedStrings: string[]): string[] {
    return connectedStrings.filter((connectedLine: string) => {return this.checkStringForWinner(connectedLine)}, this);
  }

  abstract changeTurn(): void;

  startNewGame(): void {
    return null;
  }
}

export class RedsTurnState extends PlayersTurn implements State {
  playerColor: string = "red";
  winningString: string = "rrrr";

  constructor(gameboardComponent: GameboardComponent) {
    super();
    this.gameboardComponent = gameboardComponent;
  }

  changeTurn(): void {
    this.gameboardComponent.setState(this.gameboardComponent.blacksTurnState)
  }
}

export class BlacksTurnState extends PlayersTurn implements State {
  playerColor: string = "black";
  winningString: string = "bbbb";

  constructor(gameboardComponent: GameboardComponent) {
    super();
    this.gameboardComponent = gameboardComponent;
  }

  changeTurn(): void {
    this.gameboardComponent.setState(this.gameboardComponent.redsTurnState)
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
