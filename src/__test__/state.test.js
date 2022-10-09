import React from 'react';
import {render, screen, cleanup, fireEvent} from '@testing-library/react';
import PlayGround from '../components/playGround';
import {Chess} from 'chess.js';

afterEach(cleanup);
jest.useFakeTimers();
jest.spyOn(global, 'setInterval');
jest.spyOn(Object.getPrototypeOf(window.localStorage), 'setItem');
Object.setPrototypeOf(window.localStorage.setItem, jest.fn());

describe('Mocking Some Functionalities', () => {
  test('Mock redo button with cached data', async () => {
    const getForward = jest.fn();
    render(<Button onClick={getForward}>Redo</Button>);
    fireEvent.click(screen.getByText(/Redo/i));
    expect(getForward).toHaveBeenCalledTimes(1);
  });
  test('Mock undo button with cached data', async () => {
    const getBackward = jest.fn();
    render(<Button onClick={getBackward}>Undo</Button>);
    fireEvent.click(screen.getByText(/Undo/i));
    expect(getBackward).toHaveBeenCalledTimes(1);
  });

  test('Making sure timer is called for user stating times', () => {
    render(<PlayGround />);
    expect(setInterval).toHaveBeenCalled();
    expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function), 1000);
  });

  test('Mock save to localStorage upon game move', () => {
    const chess = new Chess();
    chess.move('e4');
    window.localStorage.setItem('cached-data', {fen: chess.fen()});
    expect(window.localStorage.setItem).toHaveBeenCalledWith('cached-data', {
      fen: chess.fen(),
    });
  });
});

const Button = ({onClick, children}) => (
  <button onClick={onClick}>{children}</button>
);
