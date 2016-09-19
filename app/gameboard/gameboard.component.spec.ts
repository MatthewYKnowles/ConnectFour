import {GameboardComponent} from "./gameboard.component";
describe("gameboard", ()=> {
  it("should drop a piece in column 1 and have it go to the bottom", ()=> {
    let gameBoard: GameboardComponent = new GameboardComponent();
    spyOn(gameBoard, 'drawPiece');
    gameBoard.dropInColumn(1);
    expect(gameBoard.drawPiece).toHaveBeenCalledWith(1, 6);
  });
  it("should drop a second piece in column 1 and draw it in row 6", ()=> {
    let gameBoard: GameboardComponent = new GameboardComponent();
    spyOn(gameBoard, 'drawPiece');
    gameBoard.dropInColumn(1);
    gameBoard.dropInColumn(1);
    expect(gameBoard.drawPiece).toHaveBeenCalledWith(1, 5);
  });
});
