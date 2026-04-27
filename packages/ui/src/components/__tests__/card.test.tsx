import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../card';

describe('Card', () => {
  it('composes header, title, description and content', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Receitas do mês</CardTitle>
          <CardDescription>Atualizado agora</CardDescription>
        </CardHeader>
        <CardContent>R$ 12.345</CardContent>
      </Card>,
    );

    expect(screen.getByRole('heading', { name: /receitas do mês/i })).toBeInTheDocument();
    expect(screen.getByText(/atualizado agora/i)).toBeInTheDocument();
    expect(screen.getByText(/r\$ 12\.345/i)).toBeInTheDocument();
  });

  it('renders as <article> when as="article"', () => {
    const { container } = render(<Card as="article">x</Card>);
    expect(container.querySelector('article')).not.toBeNull();
  });

  it('applies elevated tone classes', () => {
    const { container } = render(<Card tone="elevated">x</Card>);
    expect(container.firstElementChild?.className).toMatch(/shadow-card/);
  });
});
