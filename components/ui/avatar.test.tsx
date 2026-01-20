import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Avatar, AvatarImage, AvatarFallback } from './avatar'

describe('Avatar', () => {
  it('renders with data-slot attribute', () => {
    render(
      <Avatar data-testid="avatar">
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    )
    expect(screen.getByTestId('avatar')).toHaveAttribute('data-slot', 'avatar')
  })

  it('applies custom className', () => {
    render(
      <Avatar className="custom-class" data-testid="avatar">
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    )
    expect(screen.getByTestId('avatar')).toHaveClass('custom-class')
  })

  it('renders with different sizes', () => {
    const { rerender } = render(
      <Avatar size="sm" data-testid="avatar">
        <AvatarFallback>SM</AvatarFallback>
      </Avatar>
    )
    expect(screen.getByTestId('avatar')).toHaveClass('size-8')

    rerender(
      <Avatar size="lg" data-testid="avatar">
        <AvatarFallback>LG</AvatarFallback>
      </Avatar>
    )
    expect(screen.getByTestId('avatar')).toHaveClass('size-12')

    rerender(
      <Avatar size="xl" data-testid="avatar">
        <AvatarFallback>XL</AvatarFallback>
      </Avatar>
    )
    expect(screen.getByTestId('avatar')).toHaveClass('size-16')

    rerender(
      <Avatar size="2xl" data-testid="avatar">
        <AvatarFallback>2XL</AvatarFallback>
      </Avatar>
    )
    expect(screen.getByTestId('avatar')).toHaveClass('size-24')
  })

  it('renders with default size', () => {
    render(
      <Avatar data-testid="avatar">
        <AvatarFallback>DF</AvatarFallback>
      </Avatar>
    )
    expect(screen.getByTestId('avatar')).toHaveClass('size-10')
  })
})

describe('AvatarFallback', () => {
  it('renders fallback text', () => {
    render(
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    )
    expect(screen.getByText('JD')).toBeInTheDocument()
  })

  it('has correct data-slot', () => {
    render(
      <Avatar>
        <AvatarFallback>FB</AvatarFallback>
      </Avatar>
    )
    expect(screen.getByText('FB')).toHaveAttribute('data-slot', 'avatar-fallback')
  })

  it('applies custom className', () => {
    render(
      <Avatar>
        <AvatarFallback className="custom-fallback">CF</AvatarFallback>
      </Avatar>
    )
    expect(screen.getByText('CF')).toHaveClass('custom-fallback')
  })
})

describe('AvatarImage', () => {
  // Note: Radix Avatar delays rendering AvatarImage until the image loads
  // In jsdom, images don't actually load, so we test the structure differently

  it('renders inside Avatar component', () => {
    render(
      <Avatar data-testid="avatar">
        <AvatarImage src="/test-image.jpg" alt="Test user" />
        <AvatarFallback>TU</AvatarFallback>
      </Avatar>
    )
    // Avatar container renders
    expect(screen.getByTestId('avatar')).toBeInTheDocument()
    // Fallback is shown while image loads (default behavior in jsdom)
    expect(screen.getByText('TU')).toBeInTheDocument()
  })

  it('accepts src and alt props', () => {
    // Verify the component accepts these props without error
    render(
      <Avatar>
        <AvatarImage src="/test.jpg" alt="Test" />
        <AvatarFallback>T</AvatarFallback>
      </Avatar>
    )
    expect(screen.getByText('T')).toBeInTheDocument()
  })
})

describe('Avatar composition', () => {
  it('renders avatar with fallback', () => {
    render(
      <Avatar data-testid="avatar">
        <AvatarImage src="/user.jpg" alt="John Doe" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    )

    expect(screen.getByTestId('avatar')).toBeInTheDocument()
    // Fallback is visible while image loads
    expect(screen.getByText('JD')).toBeInTheDocument()
  })

  it('renders with only fallback', () => {
    render(
      <Avatar>
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
    )
    expect(screen.getByText('AB')).toBeInTheDocument()
  })
})
