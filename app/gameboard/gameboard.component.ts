import {Component, ViewChild, OnInit} from '@angular/core';
import {GameboardRenderService} from "./gameboard.render.service";

@Component({
  selector: 'gameboard',
  templateUrl: 'app/gameboard/gameboard.component.html',
  styleUrls: ['app/gameboard/gameboard.component.css']
})
export class GameboardComponent implements OnInit {
  gameboardRenderService: GameboardRenderService;
  redsTurnState: State;
  blacksTurnState: State;
  gameOverState: State;
  state: State;
  @ViewChild("myCanvas") myCanvas: any;

  constructor(gameboardRenderService: GameboardRenderService) {
    this.gameboardRenderService = gameboardRenderService;
    let grid = new Grid();
    this.redsTurnState = new RedsTurnState(this, grid, this.gameboardRenderService);
    this.blacksTurnState = new BlacksTurnState(this, grid, this.gameboardRenderService);
    this.gameOverState = new GameOverState(this, grid, this.gameboardRenderService);
    this.state = this.redsTurnState;
  }

  ngOnInit(): void {
    this.gameboardRenderService.setContext(this.myCanvas.nativeElement.getContext("2d"));
    this.gameboardRenderService.drawBoard();
  }

  setState(newState: State) {
    this.state = newState;
  }
}

export interface State {
  border: string;
  winningPlayer: string;
  isADraw: boolean;
  columnIsFull: boolean;
  newGameText: string;
  tryToDropInColumn(event: MouseEvent): any;
  startNewGame(): void;
  clickOnCanvas(event: MouseEvent): void;
}

class GameOverState implements State {
  newGameText: string = "New Game";
  columnIsFull: boolean;
  isADraw: boolean = false;
  winningPlayer: string ="";
  border: string;
  constructor(private gameboardComponent: GameboardComponent, private grid: Grid, private gameboardRenderService: GameboardRenderService) {
  }

  startNewGame() {
    this.gameboardRenderService.drawBoard();
    this.grid.resetGrid();
    this.winningPlayer = "";
    this.isADraw = false;
    this.gameboardComponent.setState(this.gameboardComponent.redsTurnState);
  }

  tryToDropInColumn(event: MouseEvent): any {
    return null;
  }

  clickOnCanvas(event: MouseEvent): void {}
}

abstract class PlayersTurn {
  protected playerColor: string;
  protected winningString: string;
  protected gameboardComponent: GameboardComponent;
  protected gameboardRenderService: GameboardRenderService;
  protected grid: Grid;
  newGameText: string = "Restart Game";
  columnIsFull: boolean;
  isADraw: boolean = false;
  winningPlayer: string ="";
  border: string;

  clickOnCanvas(event: MouseEvent) {
    this.columnIsFull = false;
    this.tryToDropInColumn(event);
  }

  tryToDropInColumn(event: MouseEvent) {
    let column = Math.floor(event.offsetX / 100) + 1;
    let row = this.grid.calculateRow(column);
    row > 0 ? this.dropInColumn(row, column) : this.columnIsFull = true;
  }

  dropInColumn(row: number, column: number) {
    this.grid.addPiece(column, row, this.playerColor);
    this.gameboardRenderService.drawPiece(column, row, this.playerColor);
    this.changeState(row, column);
  }

  private changeState(row: number, column: number) {
    let connectedStrings: string[] = this.grid.getConnectedStrings(row, column);
    if (this.checkForWinner(connectedStrings).length > 0 || this.grid.checkForDraw()) {
      this.setGameOverState();
    }
    else {
      this.columnIsFull = false;
      this.changeTurn()
    }
  }
  startNewGame() {
    this.gameboardRenderService.drawBoard();
    this.grid.resetGrid();
    this.winningPlayer = "";
    this.isADraw = false;
    this.columnIsFull = false;
    this.gameboardComponent.setState(this.gameboardComponent.redsTurnState);
  }

  private setGameOverState() {
    this.gameboardComponent.setState(this.gameboardComponent.gameOverState);
    this.gameboardComponent.state.winningPlayer = this.playerColor;
    this.gameboardComponent.state.border = this.border;
    if(this.grid.checkForDraw()){this.gameboardComponent.state.isADraw = true;}
  }

  checkStringForWinner(connectedString: string): boolean {
    return connectedString.includes(this.winningString);
  }
  checkForWinner(connectedStrings: string[]): string[] {
    return connectedStrings.filter((connectedLine: string) => {return this.checkStringForWinner(connectedLine)}, this);
  }

  abstract changeTurn(): void;
}

export class RedsTurnState extends PlayersTurn implements State {
  border: string = "15px solid red";
  playerColor: string = "red";
  winningString: string = "rrrr";

  constructor(gameboardComponent: GameboardComponent, grid: Grid, gameboardRenderService: GameboardRenderService) {
    super();
    this.gameboardComponent = gameboardComponent;
    this.grid = grid;
    this.gameboardRenderService = gameboardRenderService;
  }

  changeTurn(): void {
    this.gameboardComponent.setState(this.gameboardComponent.blacksTurnState)
  }
}

export class BlacksTurnState extends PlayersTurn implements State {
  border: string = "15px solid black";
  playerColor: string = "black";
  winningString: string = "bbbb";

  constructor(gameboardComponent: GameboardComponent, grid: Grid, gameboardRenderService: GameboardRenderService) {
    super();
    this.gameboardComponent = gameboardComponent;
    this.grid = grid;
    this.gameboardRenderService = gameboardRenderService;
  }

  changeTurn(): void {
    this.gameboardComponent.setState(this.gameboardComponent.redsTurnState)
  }
}

export class Grid {
  grid: any;
  constructor() {
    this.resetGrid();
  }
  getGrid(): any {
    return this.grid;
  }

  resetGrid(): void {
    this.grid = {
      1: [".",".",".",".",".",".","."],
      2: [".",".",".",".",".",".","."],
      3: [".",".",".",".",".",".","."],
      4: [".",".",".",".",".",".","."],
      5: [".",".",".",".",".",".","."],
      6: [".",".",".",".",".",".","."]
    };
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

  checkForDraw() {
    return !this.grid[1].includes(".")
  }
}
