import { useState } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from './dialog'

describe('Dialog', () => {
  it('opens when trigger is clicked', async () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogTitle>Test Dialog</DialogTitle>
          <DialogDescription>Dialog description</DialogDescription>
          <p>Dialog content</p>
        </DialogContent>
      </Dialog>
    )

    expect(screen.queryByText('Dialog content')).not.toBeInTheDocument()

    await userEvent.click(screen.getByText('Open Dialog'))
    await waitFor(() => {
      expect(screen.getByText('Dialog content')).toBeInTheDocument()
    })
  })

  it('closes when close button is clicked', async () => {
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>Test</DialogTitle>
          <DialogDescription>Description</DialogDescription>
          <p>Content</p>
        </DialogContent>
      </Dialog>
    )

    await userEvent.click(screen.getByText('Open'))
    await waitFor(() => {
      expect(screen.getByText('Content')).toBeInTheDocument()
    })

    await userEvent.click(screen.getByRole('button', { name: /close/i }))
    await waitFor(() => {
      expect(screen.queryByText('Content')).not.toBeInTheDocument()
    })
  })

  it('renders dialog title', async () => {
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>My Title</DialogTitle>
          <DialogDescription>My description</DialogDescription>
        </DialogContent>
      </Dialog>
    )

    await userEvent.click(screen.getByText('Open'))
    await waitFor(() => {
      expect(screen.getByText('My Title')).toBeInTheDocument()
    })
  })

  it('renders dialog description', async () => {
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
          <DialogDescription>My description</DialogDescription>
        </DialogContent>
      </Dialog>
    )

    await userEvent.click(screen.getByText('Open'))
    await waitFor(() => {
      expect(screen.getByText('My description')).toBeInTheDocument()
    })
  })

  it('can hide close button', async () => {
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent showCloseButton={false}>
          <DialogTitle>No Close Button</DialogTitle>
          <DialogDescription>Description</DialogDescription>
        </DialogContent>
      </Dialog>
    )

    await userEvent.click(screen.getByText('Open'))
    await waitFor(() => {
      expect(screen.getByText('No Close Button')).toBeInTheDocument()
    })
    expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument()
  })

  it('can be controlled', async () => {
    const ControlledDialog = () => {
      const [open, setOpen] = useState(false)
      return (
        <>
          <button onClick={() => setOpen(true)}>External Open</button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
              <DialogTitle>Controlled</DialogTitle>
              <DialogDescription>Controlled dialog</DialogDescription>
            </DialogContent>
          </Dialog>
        </>
      )
    }

    render(<ControlledDialog />)

    expect(screen.queryByText('Controlled')).not.toBeInTheDocument()
    await userEvent.click(screen.getByText('External Open'))
    await waitFor(() => {
      expect(screen.getByText('Controlled')).toBeInTheDocument()
    })
  })
})

describe('DialogHeader', () => {
  it('renders children', () => {
    render(<DialogHeader>Header content</DialogHeader>)
    expect(screen.getByText('Header content')).toBeInTheDocument()
  })

  it('has correct data-slot', () => {
    render(<DialogHeader>Header</DialogHeader>)
    expect(screen.getByText('Header')).toHaveAttribute('data-slot', 'dialog-header')
  })
})

describe('DialogFooter', () => {
  it('renders children', () => {
    render(<DialogFooter>Footer content</DialogFooter>)
    expect(screen.getByText('Footer content')).toBeInTheDocument()
  })

  it('has correct data-slot', () => {
    render(<DialogFooter>Footer</DialogFooter>)
    expect(screen.getByText('Footer')).toHaveAttribute('data-slot', 'dialog-footer')
  })
})

describe('Dialog composition', () => {
  it('renders a complete dialog structure', async () => {
    render(
      <Dialog>
        <DialogTrigger>Open Full Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Dialog</DialogTitle>
            <DialogDescription>This is a full dialog example</DialogDescription>
          </DialogHeader>
          <div>Main content area</div>
          <DialogFooter>
            <DialogClose>Cancel</DialogClose>
            <button>Confirm</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )

    await userEvent.click(screen.getByText('Open Full Dialog'))

    await waitFor(() => {
      expect(screen.getByText('Complete Dialog')).toBeInTheDocument()
      expect(screen.getByText('This is a full dialog example')).toBeInTheDocument()
      expect(screen.getByText('Main content area')).toBeInTheDocument()
      expect(screen.getByText('Cancel')).toBeInTheDocument()
      expect(screen.getByText('Confirm')).toBeInTheDocument()
    })
  })
})
