import React from 'react';
const GameOver = ({winner, reset}) => {
  return (
    <div>
      <h4>Game Over Player {winner} wins</h4>
      <br></br>
      <button className="secondary_Buttton" onClick={() => reset()}>
        Reset
      </button>
    </div>
  );
};

export default GameOver;
