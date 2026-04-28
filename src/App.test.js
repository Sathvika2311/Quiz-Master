import { render, screen } from '@testing-library/react';
import App from './App';

test('renders quizmaster login or home link', () => {
  render(<App />);
  const linkElement = screen.getByText(/quizmaster/i);
  expect(linkElement).toBeInTheDocument();
});
