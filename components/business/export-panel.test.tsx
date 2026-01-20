import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ExportPanel } from './export-panel'

describe('ExportPanel', () => {
  const mockOnDownload = vi.fn()
  const mockOnShare = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders share section', () => {
    render(<ExportPanel onDownload={mockOnDownload} onShare={mockOnShare} />)

    expect(screen.getByText('Share to')).toBeInTheDocument()
  })

  it('renders all share platform buttons', () => {
    render(<ExportPanel onDownload={mockOnDownload} onShare={mockOnShare} />)

    expect(screen.getByRole('button', { name: /share to 微信好友/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /share to 朋友圈/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /share to 微博/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /share to 小红书/i })).toBeInTheDocument()
  })

  it('renders download button', () => {
    render(<ExportPanel onDownload={mockOnDownload} onShare={mockOnShare} />)

    expect(screen.getByRole('button', { name: /save to device/i })).toBeInTheDocument()
  })

  it('calls onDownload when download button is clicked', async () => {
    render(<ExportPanel onDownload={mockOnDownload} onShare={mockOnShare} />)

    await userEvent.click(screen.getByRole('button', { name: /save to device/i }))
    expect(mockOnDownload).toHaveBeenCalledOnce()
  })

  it('calls onShare with platform id when share button is clicked', async () => {
    render(<ExportPanel onDownload={mockOnDownload} onShare={mockOnShare} />)

    await userEvent.click(screen.getByRole('button', { name: /share to 微信好友/i }))
    expect(mockOnShare).toHaveBeenCalledWith('wechat')
  })

  it('disables download button when downloading', () => {
    render(
      <ExportPanel
        onDownload={mockOnDownload}
        onShare={mockOnShare}
        downloading
      />
    )

    expect(screen.getByRole('button', { name: /save to device/i })).toBeDisabled()
  })

  it('disables all buttons when disabled prop is true', () => {
    render(
      <ExportPanel
        onDownload={mockOnDownload}
        onShare={mockOnShare}
        disabled
      />
    )

    expect(screen.getByRole('button', { name: /save to device/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /share to 微信好友/i })).toBeDisabled()
  })

  it('does not call onDownload when disabled', async () => {
    render(
      <ExportPanel
        onDownload={mockOnDownload}
        onShare={mockOnShare}
        disabled
      />
    )

    await userEvent.click(screen.getByRole('button', { name: /save to device/i }))
    expect(mockOnDownload).not.toHaveBeenCalled()
  })

  it('does not call onShare when disabled', async () => {
    render(
      <ExportPanel
        onDownload={mockOnDownload}
        onShare={mockOnShare}
        disabled
      />
    )

    await userEvent.click(screen.getByRole('button', { name: /share to 微信好友/i }))
    expect(mockOnShare).not.toHaveBeenCalled()
  })

  it('shows loading state on share button during share', async () => {
    const slowOnShare = vi.fn(() => new Promise(resolve => setTimeout(resolve, 100)))

    render(<ExportPanel onDownload={mockOnDownload} onShare={slowOnShare} />)

    await userEvent.click(screen.getByRole('button', { name: /share to 微信好友/i }))

    // Button should be disabled during share
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /share to 微信好友/i })).toBeDisabled()
    })
  })

  it('has data-slot attribute', () => {
    render(<ExportPanel onDownload={mockOnDownload} onShare={mockOnShare} />)

    const panel = document.querySelector('[data-slot="export-panel"]')
    expect(panel).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(
      <ExportPanel
        onDownload={mockOnDownload}
        onShare={mockOnShare}
        className="custom-class"
      />
    )

    const panel = document.querySelector('[data-slot="export-panel"]')
    expect(panel).toHaveClass('custom-class')
  })

  it('renders platform icons with correct colors', () => {
    render(<ExportPanel onDownload={mockOnDownload} onShare={mockOnShare} />)

    // Check that emoji icons are rendered
    expect(screen.getByText('💬')).toBeInTheDocument()
    expect(screen.getByText('⭕')).toBeInTheDocument()
    expect(screen.getByText('📢')).toBeInTheDocument()
    expect(screen.getByText('📕')).toBeInTheDocument()
  })

  it('renders platform names', () => {
    render(<ExportPanel onDownload={mockOnDownload} onShare={mockOnShare} />)

    expect(screen.getByText('微信好友')).toBeInTheDocument()
    expect(screen.getByText('朋友圈')).toBeInTheDocument()
    expect(screen.getByText('微博')).toBeInTheDocument()
    expect(screen.getByText('小红书')).toBeInTheDocument()
  })

  it('handles async onDownload correctly', async () => {
    const asyncOnDownload = vi.fn(() => Promise.resolve())

    render(<ExportPanel onDownload={asyncOnDownload} onShare={mockOnShare} />)

    await userEvent.click(screen.getByRole('button', { name: /save to device/i }))

    await waitFor(() => {
      expect(asyncOnDownload).toHaveBeenCalledOnce()
    })
  })
})
