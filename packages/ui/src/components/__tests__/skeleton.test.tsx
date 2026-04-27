import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Skeleton } from '../skeleton';

describe('Skeleton', () => {
  it('renders a single skeleton with aria-busy', () => {
    render(<Skeleton data-testid="sk" />);
    const sk = screen.getByTestId('sk');
    expect(sk).toHaveAttribute('aria-busy', 'true');
    expect(sk.className).toMatch(/animate-pulse/);
  });

  it('applies the requested variant', () => {
    render(<Skeleton variant="circular" data-testid="sk" />);
    expect(screen.getByTestId('sk').className).toMatch(/rounded-full/);
  });

  it('renders multiple lines for variant="text" with lines>1', () => {
    const { container } = render(<Skeleton variant="text" lines={3} />);
    const wrapper = container.firstElementChild;
    expect(wrapper).not.toBeNull();
    expect(wrapper?.children.length).toBe(3);
  });
});
