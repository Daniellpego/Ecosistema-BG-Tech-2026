import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from '../badge';

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>Novo</Badge>);
    expect(screen.getByText('Novo')).toBeInTheDocument();
  });

  it('applies success variant', () => {
    render(<Badge variant="success">OK</Badge>);
    expect(screen.getByText('OK').className).toMatch(/bg-success\/10/);
  });

  it('renders icon when provided', () => {
    render(
      <Badge icon={<span data-testid="dot">●</span>}>Ativo</Badge>,
    );
    expect(screen.getByTestId('dot')).toBeInTheDocument();
  });
});
