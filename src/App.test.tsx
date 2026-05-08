import { render, screen } from '@testing-library/react';
import { App } from './App';

describe('App', () => {
  it('shows repository, support, version, and commit links', () => {
    render(<App />);

    expect(screen.getByRole('link', { name: /star/i })).toHaveAttribute(
      'href',
      'https://github.com/baditaflorin/openphoto-studio'
    );
    expect(screen.getByRole('link', { name: /support/i })).toHaveAttribute(
      'href',
      'https://www.paypal.com/paypalme/florinbadita'
    );
    expect(screen.getByText(/v0.1.0/i)).toBeInTheDocument();
    expect(screen.getByText(/commit/i)).toBeInTheDocument();
    expect(screen.getByTestId('dropzone')).toBeInTheDocument();
  });
});
