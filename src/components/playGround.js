import React, {useState, useEffect, useCallback} from 'react';
import {Chess} from 'chess.js';
import Chessboard from 'chessboardjsx';
import farward from './assets/f.png';
import backward from './assets/b.png';
const PlayGround = () => {
  const [state, setState] = useState({
    fen: 'start',
    pieceSquare: '',
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
  const [start, setStart] = useState({
    A: true,
    B: false,
  });
  const [browser, setBrowser] = useState(true);
  const [newGame, setNewGame] = useState(new Chess());

  const saveForward = (state) => {
    localStorage.setItem('currentGameState', JSON.stringify(state));
    localStorage.setItem('currentGameStart', JSON.stringify(start));
  };
  const saveBackward = () => {
    localStorage.setItem('pastGameState', JSON.stringify(state));
    localStorage.setItem('pastGameStart', JSON.stringify(start));
  };
  const getForward = useCallback(() => {
    const gamer = JSON.parse(localStorage.getItem('currentGame'));
    const starter = JSON.parse(localStorage.getItem('currentGameStart'));
    if (gamer && starter) {
      setState({...state, ...gamer});
      setNewGame(new Chess(gamer.fen));
      setStart({...start, ...starter});
    }
    setBrowser(false);
  }, [state, start]);

  const getBackward = () => {
    const gamer = JSON.parse(localStorage.getItem('pastGame'));
    const starter = JSON.parse(localStorage.getItem('pastGameStart'));

    if (gamer && starter) {
      setState({...state, ...gamer});
      setNewGame(new Chess(gamer.fen));

      setStart({...start, ...starter});
    }
  };
  const onSquareClick = (square) => {
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
    saveForward({
      ...state,
      fen: newGame.fen(),
      history: newGame.history({verbose: true}),
      pieceSquare: '',
    });
  };
  const timerA = useCallback(() => {
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

  useEffect(() => {
    if (browser) {
      getForward();
    }
    const interval = setInterval(() => {
      timerA(state);
      timerB(state);
    }, 1000);
    return () => clearInterval(interval);
  }, [state, browser, getForward, timerA, timerB]);
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
        transitionDuration={300}
        position={state.fen}
        boardStyle={{
          borderRadius: '5px',
          boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`,
        }}
        onSquareClick={onSquareClick}
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
};
export default PlayGround;
