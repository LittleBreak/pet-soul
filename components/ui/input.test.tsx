import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Input } from './input'

describe('Input', () => {
  it('renders with placeholder', () => {
    render(<Input placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('accepts and displays input value', async () => {
    render(<Input placeholder="Enter text" />)
    const input = screen.getByPlaceholderText('Enter text')

    await userEvent.type(input, 'Hello World')
    expect(input).toHaveValue('Hello World')
  })

  it('can be disabled', () => {
    render(<Input disabled placeholder="Disabled" />)
    expect(screen.getByPlaceholderText('Disabled')).toBeDisabled()
  })

  it('shows error state with aria-invalid', () => {
    render(<Input error placeholder="Error input" />)
    expect(screen.getByPlaceholderText('Error input')).toHaveAttribute('aria-invalid', 'true')
  })

  it('displays error message when error is true', () => {
    render(<Input error errorMessage="This field is required" />)
    expect(screen.getByText('This field is required')).toBeInTheDocument()
  })

  it('does not show error message without error prop', () => {
    render(<Input errorMessage="This field is required" />)
    expect(screen.queryByText('This field is required')).not.toBeInTheDocument()
  })

  it('handles onChange events', async () => {
    const handleChange = vi.fn()
    render(<Input onChange={handleChange} placeholder="Test" />)

    await userEvent.type(screen.getByPlaceholderText('Test'), 'a')
    expect(handleChange).toHaveBeenCalled()
  })

  it('applies custom className', () => {
    render(<Input className="custom-class" placeholder="Custom" />)
    expect(screen.getByPlaceholderText('Custom')).toHaveClass('custom-class')
  })

  it('supports different input types', () => {
    render(<Input type="password" placeholder="Password" />)
    expect(screen.getByPlaceholderText('Password')).toHaveAttribute('type', 'password')
  })

  it('renders with data-slot attribute', () => {
    render(<Input placeholder="Test" />)
    expect(screen.getByPlaceholderText('Test')).toHaveAttribute('data-slot', 'input')
  })
})
