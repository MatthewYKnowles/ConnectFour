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
  columnIsFull: boolean;

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

  clickOnCanvas(event: MouseEvent) {
    this.columnIsFull = false;
    this.state.dropInColumn(event);
  }

  setState(newState: State) {
    this.state = newState;
  }
}

export interface State {
  dropInColumn(event: MouseEvent): any;
  startNewGame(): void;
  getDivWidth(id: string): string;
}

class GameOverState implements State {
  constructor(private gameboardComponent: GameboardComponent) {

  }

  startNewGame() {
    this.gameboardComponent.gameboardService.drawBoard();
    this.gameboardComponent.grid = new Grid();
    this.gameboardComponent.winningPlayer = "";
    this.gameboardComponent.setState(this.gameboardComponent.redsTurnState);
  }

  dropInColumn(event: MouseEvent): any {
    return null;
  }
  getDivWidth(id: string): string {
    return null;
  }
}

abstract class PlayersTurn {
  protected playerColor: string;
  protected winningString: string;
  protected gameboardComponent: GameboardComponent;

  dropInColumn(event: MouseEvent) {
    let column = Math.floor(event.offsetX / 100) + 1;
    let row = this.gameboardComponent.grid.calculateRow(column);
    if (row > 0){
      console.log(row);
      this.gameboardComponent.grid.addPiece(column, row, this.playerColor);
      this.gameboardComponent.gameboardService.drawPiece(column, row, this.playerColor);
      let connectedStrings: string[] = this.gameboardComponent.grid.getConnectedStrings(row, column);
      if (this.checkForWinner(connectedStrings).length > 0) {this.setGameOverState();}
      else {this.changeTurn()}
    }
    else {this.gameboardComponent.columnIsFull = true;}

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
  abstract getDivWidth(id: string): string;

  startNewGame(): void {return null;}
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

  getDivWidth(id: string): string {
    console.log(id);
    return id === "redPlayer" ? "300px" : "100px";
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

  getDivWidth(id: string): string {
    return id === "blackPlayer" ? "300px" : "100px";
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


  calculateRow(column: number) {
    let row = 6;
    while (row > 0 && this.pieceAlreadyInSlot(row, column)) {
      row--
    }
    return row;
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
