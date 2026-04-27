import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '../button';

describe('Button', () => {
  it('renders children and defaults to type=button', () => {
    render(<Button>Salvar</Button>);
    const btn = screen.getByRole('button', { name: /salvar/i });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute('type', 'button');
  });

  it('disables interaction when loading', () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Enviar
      </Button>,
    );
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute('aria-busy', 'true');
    expect(btn).toHaveAttribute('data-loading', 'true');
  });

  it('applies danger variant classes', () => {
    render(<Button variant="danger">Excluir</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toMatch(/bg-danger/);
  });

  it('respects asChild via Slot', () => {
    render(
      <Button asChild>
        <a href="/foo">Ir</a>
      </Button>,
    );
    const link = screen.getByRole('link', { name: /ir/i });
    expect(link).toHaveAttribute('href', '/foo');
  });

  it('forwards ref to the underlying button element', () => {
    const ref = { current: null as HTMLButtonElement | null };
    render(<Button ref={ref}>X</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
