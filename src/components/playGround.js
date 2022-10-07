import React, {useState, useEffect, useCallback} from 'react';
import {Chess} from 'chess.js';
import Chessboard from 'chessboardjsx';
import GameOver from './util/gameOver';
import farward from './assets/f.png';
import backward from './assets/b.png';
import {squareStyling} from './util/stylingGame';
const PlayGround = () => {
  /*
   * Declaring state variables for chessboardjs
   */
  const [state, setState] = useState({
    fen: 'start',
    dropSquareStyle: {},
    squareStyles: {},
    pieceSquare: '',
    square: '',
    history: [],
    gameA: {
      min: 9,
      sec: 59,
    },
    gameB: {
      min: 9,
      sec: 59,
    },
  });
  /*
   * Declaring start variable for timer
   */
  const [start, setStart] = useState({
    A: true, // A for player white
    B: false, // B for player black
  });
  /*
   * Cache browser records once for this
   * we need to store that
   */
  const [browser, setBrowser] = useState(true);
  const [newGame, setNewGame] = useState(new Chess());
  const removeHighlightSquare = () => {
    setState({
      ...state,
      squareStyles: squareStyling({
        pieceSquare: state.pieceSquare,
        history: state.history,
      }),
    });
  };
  const highlightSquare = (sourceSquare, squaresToHighlight) => {
    const highlightStyles = [sourceSquare, ...squaresToHighlight].reduce(
      (a, c) => {
        return {
          ...a,
          ...{
            [c]: {
              background:
                'radial-gradient(circle, #fffc00 36%, transparent 40%)',
              borderRadius: '50%',
            },
          },
          ...squareStyling({
            history: state.history,
            pieceSquare: state.pieceSquare,
          }),
        };
      },
      {}
    );
    setState({
      ...state,
      squareStyles: {...state.squareStyles, ...highlightStyles},
    });
  };
  const onMouseOverSquare = (square) => {
    let moves = newGame.moves({
      square: square,
      verbose: true,
    });

    if (moves.length === 0) {
      return;
    }

    let squaresToHighlight = [];
    for (var i = 0; i < moves.length; i++) {
      squaresToHighlight.push(moves[i].to);
    }

    highlightSquare(square, squaresToHighlight);
  };
  const onMouseOutSquare = (square) => {
    removeHighlightSquare(square);
  };

  const saveForward = (state) => {
    //a function to save the game record forward
    localStorage.setItem('currentGameState', JSON.stringify(state));
    localStorage.setItem(
      'currentGameStart',
      JSON.stringify({
        A: start.A ? false : true,
        B: start.B ? false : true,
      })
    );
  };
  const saveBackward = () => {
    //a function to save the game record backward
    localStorage.setItem('pastGameState', JSON.stringify(state));
    localStorage.setItem('pastGameStart', JSON.stringify(start));
  };
  const getForward = useCallback(() => {
    //memorised callback to get the game record
    const gamer = JSON.parse(localStorage.getItem('currentGameState'));
    const starter = JSON.parse(localStorage.getItem('currentGameStart'));
    if (gamer && starter) {
      setState({...state, ...gamer});
      setNewGame(new Chess(gamer.fen));
      setStart({...start, ...starter});
    }
    setBrowser(false);
  }, [state, start]);

  const getBackward = () => {
    //get game record backward

    const gamer = JSON.parse(localStorage.getItem('pastGameState'));
    const starter = JSON.parse(localStorage.getItem('pastGameStart'));

    if (gamer && starter) {
      setState({...state, ...gamer});
      setNewGame(new Chess(gamer.fen));

      setStart({...start, ...starter});
    }
  };
  const onSquareClick = (square) => {
    //configure game with legal move

    saveBackward();
    setState({
      ...state,
      pieceSquare: square,
    });
    let move = newGame.move({
      from: state.pieceSquare,
      to: square,
    });
    if (move === null) {
      return;
    }
    setStart({
      A: move.color === 'w' ? false : true,
      B: move.color === 'b' ? false : true,
    });

    setState({
      ...state,
      fen: newGame.fen(),
      history: newGame.history({verbose: true}),
      pieceSquare: '',
    });
    // save record fall forward
    saveForward({
      ...state,
      fen: newGame.fen(),
      history: newGame.history({verbose: true}),
      pieceSquare: '',
    });
  };
  const timerA = useCallback(() => {
    //memorized timer for player A
    if (start.A) {
      if (state.gameA.sec === 0) {
        if (state.gameA.min > 0) {
          setState({
            ...state,
            gameA: {
              min: state.gameA.min - 1,
              sec: 59,
            },
          });
        }
      } else {
        setState({
          ...state,
          gameA: {
            min: state.gameA.min,
            sec: state.gameA.sec - 1,
          },
        });
      }
    }
  }, [state, start]);
  const timerB = useCallback(() => {
    //memorized timer for player B
    if (start.B) {
      if (state.gameB.sec === 0) {
        if (state.gameB.min > 0) {
          setState({
            ...state,
            gameB: {
              min: state.gameB.min - 1,
              sec: 59,
            },
          });
        }
      } else {
        setState({
          ...state,
          gameB: {
            min: state.gameB.min,
            sec: state.gameB.sec - 1,
          },
        });
      }
    }
  }, [state, start]);
  const reset = () => {
    setState({
      ...state,
      fen: 'start',
      gameA: {
        min: 9,
        sec: 59,
      },
      gameB: {
        min: 9,
        sec: 59,
      },
    });
    localStorage.removeItem('currentGameState');
    localStorage.removeItem('currentGameStart');
    localStorage.removeItem('pastGameState');
    localStorage.removeItem('pastGameStart');
    window.location.reload();
  };
  const isOver = () => {
    const over = newGame.isGameOver();
    if (over) {
      if (start.A) {
        setState({
          ...state,
          gameA: {
            min: 0,
            sec: 0,
          },
        });
      }
      if (start.B) {
        console.log('hey1');
        setState({
          ...state,
          gameB: {
            min: 0,
            sec: 0,
          },
        });
      }
    }
  };
  useEffect(() => {
    isOver();
    if (browser) {
      getForward();
    }
    const interval = setInterval(() => {
      timerA(state);
      timerB(state);
    }, 1000);

    return () => clearInterval(interval);
  }, [state, browser, getForward, timerA, timerB]);
  if (
    (state.gameA.min === 0 && state.gameA.sec === 0) ||
    (state.gameB.min === 0 && state.gameB.sec === 0)
  ) {
    return (
      <>
        <GameOver reset={reset} winner={state.gameA.min === 0 ? 'B' : 'A'} />
      </>
    );
  } else {
    return (
      <div className="game_Area" data-testid="game_Area">
        <div className="timers">
          <h3>Timers</h3>
          <div className="left-right">
            <div>
              Player A: {state.gameA.min}min:{state.gameA.sec}sec
            </div>
            <div>
              Player B: {state.gameB.min}min:{state.gameB.sec}sec
            </div>
          </div>
        </div>
        <Chessboard
          id="humanVsHuman"
          width={320}
          calcWidth={() => {}}
          draggable={false}
          undo={true}
          transitionDuration={300}
          position={state.fen}
          boardStyle={{
            borderRadius: '5px',
            boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`,
          }}
          onSquareClick={onSquareClick}
          onMouseOverSquare={onMouseOverSquare}
          onMouseOutSquare={onMouseOutSquare}
          squareStyles={state.squareStyles}
        />
        <div className="b-top-left">
          <div>
            <button data-testid="primary_buttons" onClick={() => getForward()}>
              <img src={farward} alt="farward" />
            </button>
          </div>
          <div>
            <button data-testid="primary_buttons" onClick={() => getBackward()}>
              <img src={backward} alt="backward" />
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default PlayGround;
