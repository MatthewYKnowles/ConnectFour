import {GameboardComponent, Grid, RedsTurnState} from "./gameboard.component";
import {GameboardRenderService} from "./gameboard.render.service";

describe("gameboard", ()=> {
  let gameboardRenderService: GameboardRenderService;
  let gameboardComponent: GameboardComponent;
  let grid: Grid;
  let redPlayerTurn: RedsTurnState;
  beforeEach(()=> {
    gameboardRenderService = new GameboardRenderService();
    gameboardComponent = new GameboardComponent(gameboardRenderService);
    grid = new Grid();
    redPlayerTurn = new RedsTurnState(gameboardComponent, grid, gameboardRenderService);
  });
  it("should click in column 1 and have it drop in column 1", ()=> {
    spyOn(redPlayerTurn, 'dropInColumn');
    let event: MouseEvent = <MouseEvent>{
      offsetX: 0
    };
    redPlayerTurn.tryToDropInColumn(event);
    expect(redPlayerTurn.dropInColumn).toHaveBeenCalledWith(6, 1);
  });
  it("should drop in column 2 and have a piece dropped in column 2", ()=> {
    spyOn(redPlayerTurn, 'dropInColumn');
    let event: MouseEvent = <MouseEvent>{
      offsetX: 100
    };
    redPlayerTurn.tryToDropInColumn(event);
    expect(redPlayerTurn.dropInColumn).toHaveBeenCalledWith(6, 2);
  });
});

describe("Grid", ()=> {
  let grid: Grid;
  beforeEach(()=> {
    grid = new Grid();
  });
  it("should return row 6 by default", ()=> {
    expect(grid.calculateRow(1)).toEqual(6);
  });
  it("should return row 5 after a piece has already been dropped", ()=> {
    grid.addPiece(1, 6, "red");
    expect(grid.calculateRow(1)).toEqual(5);
  });
  it("should return row 0 when the column is full", ()=> {
    grid.addPiece(1, 6, "red");
    grid.addPiece(1, 5, "black");
    grid.addPiece(1, 4, "red");
    grid.addPiece(1, 3, "black");
    grid.addPiece(1, 2, "red");
    grid.addPiece(1, 1, "black");
    expect(grid.calculateRow(1)).toEqual(0);
  });
  it("should return draw when the top of every column is full", ()=> {
    grid.grid[1] = ["b","r","b","r","b","r","b"];
    expect(grid.checkForDraw()).toBeTruthy();
  });
  it("should not return a draw when there are still empty slots", ()=> {
    grid.grid[1] = ["b","r","b",".","b","r","."];
    expect(grid.checkForDraw()).toBeFalsy();
  });
});

// describe("winning conditions", ()=> {
//   it("should declare red the winner with a bottom row connect 4", ()=> {
//     let gameboard: GameboardComponent = new GameboardComponent(null);
//     spyOn(gameboard, 'drawPiece');
//     spyOn(gameboard, 'declareWinner');
//     gameboard.tryToDropInColumn(1);
//     gameboard.tryToDropInColumn(1);
//     gameboard.tryToDropInColumn(2);
//     gameboard.tryToDropInColumn(2);
//     gameboard.tryToDropInColumn(3);
//     gameboard.tryToDropInColumn(3);
//     gameboard.tryToDropInColumn(4);
//     expect(gameboard.declareWinner).toHaveBeenCalledWith("red");
//   });
//   it("should declare red the winner with a second to bottom row connect 4", ()=> {
//     let gameboard: GameboardComponent = new GameboardComponent(null);
//     spyOn(gameboard, 'drawPiece');
//     spyOn(gameboard, 'declareWinner');
//       gameboard.tryToDropInColumn(1);
//       gameboard.tryToDropInColumn(1);
//       gameboard.tryToDropInColumn(2);
//       gameboard.tryToDropInColumn(2);
//       gameboard.tryToDropInColumn(3);
//       gameboard.tryToDropInColumn(3);
//       gameboard.tryToDropInColumn(5);
//       gameboard.tryToDropInColumn(4);
//       gameboard.tryToDropInColumn(5);
//       gameboard.tryToDropInColumn(4);
//     expect(gameboard.declareWinner).toHaveBeenCalledWith("black");
//   });
//   it("should declare red the winner a connect four in column 1", ()=> {
//     let gameboard: GameboardComponent = new GameboardComponent(null);
//     spyOn(gameboard, 'drawPiece');
//     spyOn(gameboard, 'declareWinner');
//     gameboard.tryToDropInColumn(1);
//     gameboard.tryToDropInColumn(2);
//     gameboard.tryToDropInColumn(1);
//     gameboard.tryToDropInColumn(2);
//     gameboard.tryToDropInColumn(1);
//     gameboard.tryToDropInColumn(2);
//     gameboard.tryToDropInColumn(1);
//     expect(gameboard.declareWinner).toHaveBeenCalledWith("red");
//   });
//   it("should declare black the winner with a connect four in column 1", ()=> {
//     let gameboard: GameboardComponent = new GameboardComponent(null);
//     spyOn(gameboard, 'drawPiece');
//     spyOn(gameboard, 'declareWinner');
//     gameboard.tryToDropInColumn(1);
//     gameboard.tryToDropInColumn(2);
//     gameboard.tryToDropInColumn(1);
//     gameboard.tryToDropInColumn(2);
//     gameboard.tryToDropInColumn(1);
//     gameboard.tryToDropInColumn(2);
//     gameboard.tryToDropInColumn(3);
//     gameboard.tryToDropInColumn(2);
//     expect(gameboard.declareWinner).toHaveBeenCalledWith("black");
//   });
//   it("should declare red the winner with a connect four in a up right diagonal", ()=> {
//     let gameboard: GameboardComponent = new GameboardComponent(null);
//     spyOn(gameboard, 'drawPiece');
//     spyOn(gameboard, 'declareWinner');
//     gameboard.tryToDropInColumn(1);
//     gameboard.tryToDropInColumn(2);
//     gameboard.tryToDropInColumn(2);
//     gameboard.tryToDropInColumn(3);
//     gameboard.tryToDropInColumn(4);
//     gameboard.tryToDropInColumn(3);
//     gameboard.tryToDropInColumn(3);
//     gameboard.tryToDropInColumn(4);
//     gameboard.tryToDropInColumn(5);
//     gameboard.tryToDropInColumn(4);
//     gameboard.tryToDropInColumn(4);
//     expect(gameboard.declareWinner).toHaveBeenCalledWith("red");
//   });
//   it("should declare black the winner with a connect four in a up right diagonal in the upper right corner", ()=> {
//     let gameboard: GameboardComponent = new GameboardComponent(null);
//     spyOn(gameboard, 'drawPiece');
//     spyOn(gameboard, 'declareWinner');
//     gameboard.tryToDropInColumn(7);
//     gameboard.tryToDropInColumn(7);
//     gameboard.tryToDropInColumn(7);
//     gameboard.tryToDropInColumn(7);
//     gameboard.tryToDropInColumn(7);
//     gameboard.tryToDropInColumn(7);
//     gameboard.tryToDropInColumn(6);
//     gameboard.tryToDropInColumn(6);
//     gameboard.tryToDropInColumn(6);
//     gameboard.tryToDropInColumn(6);
//     gameboard.tryToDropInColumn(1);
//     gameboard.tryToDropInColumn(6);
//     gameboard.tryToDropInColumn(5);
//     gameboard.tryToDropInColumn(5);
//     gameboard.tryToDropInColumn(5);
//     gameboard.tryToDropInColumn(5);
//     gameboard.tryToDropInColumn(1);
//     gameboard.tryToDropInColumn(4);
//     gameboard.tryToDropInColumn(4);
//     gameboard.tryToDropInColumn(4);
//     expect(gameboard.declareWinner).toHaveBeenCalledWith("black");
//   });
//   it("should declare black the winner with a connect four in a down right diagonal in the upper left corner", ()=> {
//     let gameboard: GameboardComponent = new GameboardComponent(null);
//     spyOn(gameboard, 'drawPiece');
//     spyOn(gameboard, 'declareWinner');
//     gameboard.tryToDropInColumn(1);
//     gameboard.tryToDropInColumn(1);
//     gameboard.tryToDropInColumn(1);
//     gameboard.tryToDropInColumn(1);
//     gameboard.tryToDropInColumn(1);
//     gameboard.tryToDropInColumn(1);
//     gameboard.tryToDropInColumn(2);
//     gameboard.tryToDropInColumn(2);
//     gameboard.tryToDropInColumn(2);
//     gameboard.tryToDropInColumn(2);
//     gameboard.tryToDropInColumn(7);
//     gameboard.tryToDropInColumn(2);
//     gameboard.tryToDropInColumn(3);
//     gameboard.tryToDropInColumn(3);
//     gameboard.tryToDropInColumn(3);
//     gameboard.tryToDropInColumn(3);
//     gameboard.tryToDropInColumn(7);
//     gameboard.tryToDropInColumn(4);
//     gameboard.tryToDropInColumn(4);
//     gameboard.tryToDropInColumn(4);
//     expect(gameboard.declareWinner).toHaveBeenCalledWith("black");
//   });
// });
