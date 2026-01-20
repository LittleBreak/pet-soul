import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Textarea } from './textarea'

describe('Textarea', () => {
  it('renders with placeholder', () => {
    render(<Textarea placeholder="Enter description" />)
    expect(screen.getByPlaceholderText('Enter description')).toBeInTheDocument()
  })

  it('accepts and displays input value', async () => {
    render(<Textarea placeholder="Enter text" />)
    const textarea = screen.getByPlaceholderText('Enter text')

    await userEvent.type(textarea, 'Hello World')
    expect(textarea).toHaveValue('Hello World')
  })

  it('can be disabled', () => {
    render(<Textarea disabled placeholder="Disabled" />)
    expect(screen.getByPlaceholderText('Disabled')).toBeDisabled()
  })

  it('shows error state with aria-invalid', () => {
    render(<Textarea error placeholder="Error textarea" />)
    expect(screen.getByPlaceholderText('Error textarea')).toHaveAttribute('aria-invalid', 'true')
  })

  it('displays error message when error is true', () => {
    render(<Textarea error errorMessage="Description is required" />)
    expect(screen.getByText('Description is required')).toBeInTheDocument()
  })

  it('does not show error message without error prop', () => {
    render(<Textarea errorMessage="Description is required" />)
    expect(screen.queryByText('Description is required')).not.toBeInTheDocument()
  })

  it('handles onChange events', async () => {
    const handleChange = vi.fn()
    render(<Textarea onChange={handleChange} placeholder="Test" />)

    await userEvent.type(screen.getByPlaceholderText('Test'), 'a')
    expect(handleChange).toHaveBeenCalled()
  })

  it('applies custom className', () => {
    render(<Textarea className="custom-class" placeholder="Custom" />)
    expect(screen.getByPlaceholderText('Custom')).toHaveClass('custom-class')
  })

  it('renders with data-slot attribute', () => {
    render(<Textarea placeholder="Test" />)
    expect(screen.getByPlaceholderText('Test')).toHaveAttribute('data-slot', 'textarea')
  })
})
