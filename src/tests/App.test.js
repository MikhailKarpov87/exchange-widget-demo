import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders revolut element', () => {
  render(<App />);
  const linkElement = screen.getByText(/revolut/i);
  expect(linkElement).toBeInTheDocument();
});
