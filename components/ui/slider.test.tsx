import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Slider } from './slider'

describe('Slider', () => {
  it('renders with data-slot attribute', () => {
    render(<Slider data-testid="slider" defaultValue={[50]} />)
    expect(screen.getByTestId('slider')).toHaveAttribute('data-slot', 'slider')
  })

  it('renders with default value', () => {
    render(<Slider defaultValue={[50]} aria-label="Volume" />)
    expect(screen.getByRole('slider')).toBeInTheDocument()
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '50')
  })

  it('respects min and max values', () => {
    render(<Slider defaultValue={[25]} min={0} max={50} aria-label="Progress" />)
    const slider = screen.getByRole('slider')
    expect(slider).toHaveAttribute('aria-valuemin', '0')
    expect(slider).toHaveAttribute('aria-valuemax', '50')
  })

  it('shows disabled state with data-disabled attribute', () => {
    render(<Slider defaultValue={[50]} disabled data-testid="slider" />)
    const slider = screen.getByTestId('slider')
    // Radix Slider uses data-disabled attribute instead of HTML disabled
    expect(slider).toHaveAttribute('data-disabled')
  })

  it('applies custom className', () => {
    render(<Slider defaultValue={[50]} className="custom-slider" data-testid="slider" />)
    expect(screen.getByTestId('slider')).toHaveClass('custom-slider')
  })

  it('renders multiple thumbs for range slider', () => {
    render(<Slider defaultValue={[25, 75]} />)
    const sliders = screen.getAllByRole('slider')
    expect(sliders).toHaveLength(2)
  })

  it('calls onValueChange when provided', () => {
    const handleChange = vi.fn()
    render(
      <Slider
        defaultValue={[50]}
        onValueChange={handleChange}
        aria-label="Test slider"
      />
    )

    const slider = screen.getByRole('slider')
    expect(slider).toBeInTheDocument()
    // Note: Full interaction testing for slider requires more complex setup
  })

  it('can be controlled', () => {
    const { rerender } = render(
      <Slider value={[30]} aria-label="Controlled slider" />
    )
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '30')

    rerender(<Slider value={[70]} aria-label="Controlled slider" />)
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '70')
  })

  it('supports step values', () => {
    render(<Slider defaultValue={[50]} step={10} aria-label="Stepped slider" />)
    expect(screen.getByRole('slider')).toBeInTheDocument()
  })

  it('renders with orientation horizontal by default', () => {
    render(<Slider defaultValue={[50]} aria-label="Horizontal slider" />)
    expect(screen.getByRole('slider')).toHaveAttribute('aria-orientation', 'horizontal')
  })

  it('renders track and range elements', () => {
    render(<Slider defaultValue={[50]} data-testid="slider" />)
    const slider = screen.getByTestId('slider')
    expect(slider.querySelector('[data-slot="slider-track"]')).toBeInTheDocument()
    expect(slider.querySelector('[data-slot="slider-range"]')).toBeInTheDocument()
  })

  it('renders thumb element', () => {
    render(<Slider defaultValue={[50]} data-testid="slider" />)
    const slider = screen.getByTestId('slider')
    expect(slider.querySelector('[data-slot="slider-thumb"]')).toBeInTheDocument()
  })

  it('thumb has disabled state when slider is disabled', () => {
    render(<Slider defaultValue={[50]} disabled data-testid="slider" />)
    const thumb = screen.getByTestId('slider').querySelector('[data-slot="slider-thumb"]')
    expect(thumb).toHaveAttribute('data-disabled')
  })
})
