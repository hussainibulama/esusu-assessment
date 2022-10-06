import {render, screen} from '@testing-library/react';
import App from './App';
import PlayGround from './components/playGround';

test('renders text on the screen and check if game area exist', () => {
  render(<App />);
  const welcomeText = screen.getByText(/Chess Game/i);
  const timer = screen.getByText(/Timers/i);
  const playerA = screen.getByText(/Player A/i);
  const playerB = screen.getByText(/Player B/i);
  const game_Area = screen.getByTestId(/game_Area/i);
  expect(welcomeText).toBeInTheDocument();
  expect(timer).toBeInTheDocument();
  expect(playerA).toBeInTheDocument();
  expect(playerB).toBeInTheDocument();
  expect(game_Area).toBeInTheDocument();
});
test('renders button on the screen', () => {
  render(<PlayGround />);
  const Button = screen.getAllByTestId(/buttons/i);
  expect(Button[0]).toBeInTheDocument();
  expect(Button.length).toBe(2);
});

test('renders pieces when position is provided', () => {
  render(<PlayGround />);
  const piece1 = screen.getByTestId('wQ-d1');
  const piece2 = screen.getByTestId('bN-b8');

  expect(piece1).toBeInTheDocument();
  expect(piece2).toBeInTheDocument();
});
test('renders white and black square on the screen', () => {
  render(<PlayGround />);
  const whiteSquare = screen.getAllByTestId('white-square');
  const blackSquare = screen.getAllByTestId('black-square');
  expect(whiteSquare[0]).toBeInTheDocument();
  expect(whiteSquare[0]).toHaveAttribute('style');
  expect(blackSquare[0]).toBeInTheDocument();
  expect(blackSquare[0]).toHaveAttribute('style');
});
