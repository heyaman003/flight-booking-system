import { render, screen } from '@testing-library/react';
import Page from './page';

describe('Search Page', () => {
  it('renders the search form', () => {
    render(<Page />);
    expect(screen.getByPlaceholderText(/search airports/i)).toBeInTheDocument();
  });
}); 