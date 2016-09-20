import {GameboardComponent} from "./gameboard.component";

describe("gameboard", ()=> {
  it("should drop a piece in column 1 and have it go to the bottom", ()=> {
    let gameboard: GameboardComponent = new GameboardComponent();
    spyOn(gameboard, 'drawPiece');
    gameboard.dropInColumn(1);
    expect(gameboard.drawPiece).toHaveBeenCalledWith(1, 6);
  });
  it("should drop a second piece in column 1 and draw it in row 5", ()=> {
    let gameboard: GameboardComponent = new GameboardComponent();
    spyOn(gameboard, 'drawPiece');
    gameboard.dropInColumn(1);
    gameboard.dropInColumn(1);
    expect(gameboard.drawPiece).toHaveBeenCalledWith(1, 5);
  });
  it("should drop a third piece in column 1 and draw it in row 4", ()=> {
    let gameboard: GameboardComponent = new GameboardComponent();
    spyOn(gameboard, 'drawPiece');
    gameboard.dropInColumn(1);
    gameboard.dropInColumn(1);
    gameboard.dropInColumn(1);
    expect(gameboard.drawPiece).toHaveBeenCalledWith(1, 4);
  });
});
describe("winning conditions", ()=> {
  it("should declare red the winner with a bottom row connect 4", ()=> {
    let gameboard: GameboardComponent = new GameboardComponent();
    spyOn(gameboard, 'drawPiece');
    spyOn(gameboard, 'declareWinner');
    gameboard.dropInColumn(1);
    gameboard.dropInColumn(1);
    gameboard.dropInColumn(2);
    gameboard.dropInColumn(2);
    gameboard.dropInColumn(3);
    gameboard.dropInColumn(3);
    gameboard.dropInColumn(4);
    expect(gameboard.declareWinner).toHaveBeenCalledWith("red");
  });
  it("should declare red the winner with a second to bottom row connect 4", ()=> {
    let gameboard: GameboardComponent = new GameboardComponent();
    spyOn(gameboard, 'drawPiece');
    spyOn(gameboard, 'declareWinner');
      gameboard.dropInColumn(1);
      gameboard.dropInColumn(1);
      gameboard.dropInColumn(2);
      gameboard.dropInColumn(2);
      gameboard.dropInColumn(3);
      gameboard.dropInColumn(3);
      gameboard.dropInColumn(5);
      gameboard.dropInColumn(4);
      gameboard.dropInColumn(5);
      gameboard.dropInColumn(4);
    expect(gameboard.declareWinner).toHaveBeenCalledWith("black");
  });
  it("should declare red the winner a connect four in column 1", ()=> {
    let gameboard: GameboardComponent = new GameboardComponent();
    spyOn(gameboard, 'drawPiece');
    spyOn(gameboard, 'declareWinner');
    gameboard.dropInColumn(1);
    gameboard.dropInColumn(2);
    gameboard.dropInColumn(1);
    gameboard.dropInColumn(2);
    gameboard.dropInColumn(1);
    gameboard.dropInColumn(2);
    gameboard.dropInColumn(1);
    expect(gameboard.declareWinner).toHaveBeenCalledWith("red");
  });
  it("should declare black the winner with a connect four in column 1", ()=> {
    let gameboard: GameboardComponent = new GameboardComponent();
    spyOn(gameboard, 'drawPiece');
    spyOn(gameboard, 'declareWinner');
    gameboard.dropInColumn(1);
    gameboard.dropInColumn(2);
    gameboard.dropInColumn(1);
    gameboard.dropInColumn(2);
    gameboard.dropInColumn(1);
    gameboard.dropInColumn(2);
    gameboard.dropInColumn(3);
    gameboard.dropInColumn(2);
    expect(gameboard.declareWinner).toHaveBeenCalledWith("black");
  });
});
