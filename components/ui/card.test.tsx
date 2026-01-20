import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './card'

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Card content</Card>)
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<Card className="custom-class">Content</Card>)
    expect(screen.getByText('Content')).toHaveClass('custom-class')
  })

  it('renders with data-slot attribute', () => {
    render(<Card>Content</Card>)
    expect(screen.getByText('Content')).toHaveAttribute('data-slot', 'card')
  })

  it('renders with different variants', () => {
    const { rerender } = render(<Card variant="glass">Glass</Card>)
    expect(screen.getByText('Glass')).toBeInTheDocument()

    rerender(<Card variant="outline">Outline</Card>)
    expect(screen.getByText('Outline')).toBeInTheDocument()
  })

  it('renders with hover effects', () => {
    const { rerender } = render(<Card hover="lift">Lift</Card>)
    expect(screen.getByText('Lift')).toBeInTheDocument()

    rerender(<Card hover="glow">Glow</Card>)
    expect(screen.getByText('Glow')).toBeInTheDocument()

    rerender(<Card hover="scale">Scale</Card>)
    expect(screen.getByText('Scale')).toBeInTheDocument()
  })
})

describe('CardHeader', () => {
  it('renders children', () => {
    render(<CardHeader>Header content</CardHeader>)
    expect(screen.getByText('Header content')).toBeInTheDocument()
  })

  it('renders with data-slot attribute', () => {
    render(<CardHeader>Header</CardHeader>)
    expect(screen.getByText('Header')).toHaveAttribute('data-slot', 'card-header')
  })
})

describe('CardTitle', () => {
  it('renders as h3', () => {
    render(<CardTitle>Title</CardTitle>)
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Title')
  })

  it('renders with data-slot attribute', () => {
    render(<CardTitle>Title</CardTitle>)
    expect(screen.getByText('Title')).toHaveAttribute('data-slot', 'card-title')
  })
})

describe('CardDescription', () => {
  it('renders children', () => {
    render(<CardDescription>Description text</CardDescription>)
    expect(screen.getByText('Description text')).toBeInTheDocument()
  })

  it('renders with data-slot attribute', () => {
    render(<CardDescription>Description</CardDescription>)
    expect(screen.getByText('Description')).toHaveAttribute('data-slot', 'card-description')
  })
})

describe('CardContent', () => {
  it('renders children', () => {
    render(<CardContent>Main content</CardContent>)
    expect(screen.getByText('Main content')).toBeInTheDocument()
  })

  it('renders with data-slot attribute', () => {
    render(<CardContent>Content</CardContent>)
    expect(screen.getByText('Content')).toHaveAttribute('data-slot', 'card-content')
  })
})

describe('CardFooter', () => {
  it('renders children', () => {
    render(<CardFooter>Footer content</CardFooter>)
    expect(screen.getByText('Footer content')).toBeInTheDocument()
  })

  it('renders with data-slot attribute', () => {
    render(<CardFooter>Footer</CardFooter>)
    expect(screen.getByText('Footer')).toHaveAttribute('data-slot', 'card-footer')
  })
})

describe('Card composition', () => {
  it('renders a complete card', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card description</CardDescription>
        </CardHeader>
        <CardContent>Main content here</CardContent>
        <CardFooter>Footer actions</CardFooter>
      </Card>
    )

    expect(screen.getByRole('heading', { name: 'Card Title' })).toBeInTheDocument()
    expect(screen.getByText('Card description')).toBeInTheDocument()
    expect(screen.getByText('Main content here')).toBeInTheDocument()
    expect(screen.getByText('Footer actions')).toBeInTheDocument()
  })
})
