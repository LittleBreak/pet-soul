import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { PetCard } from './pet-card'
import type { PetType } from '@/types'

const mockPet = {
  name: '小橘',
  avatarUrl: 'https://example.com/cat.jpg',
  breed: '橘猫',
  petType: 'cat' as PetType,
  personality: '高冷',
}

const mockPetWithoutAvatar = {
  name: '阿黄',
  breed: '柯基',
  petType: 'dog' as PetType,
}

describe('PetCard', () => {
  it('renders pet name', async () => {
    render(<PetCard pet={mockPet} />)

    // Name appears in the heading
    await waitFor(() => {
      const heading = screen.getByRole('heading', { level: 3 })
      expect(heading).toHaveTextContent('小橘')
    })
  })

  it('renders pet breed badge', () => {
    render(<PetCard pet={mockPet} />)

    expect(screen.getByText('橘猫')).toBeInTheDocument()
  })

  it('renders pet personality badge when provided', () => {
    render(<PetCard pet={mockPet} />)

    expect(screen.getByText('高冷')).toBeInTheDocument()
  })

  it('does not render personality badge when not provided', () => {
    render(<PetCard pet={mockPetWithoutAvatar} />)

    expect(screen.queryByText('高冷')).not.toBeInTheDocument()
  })

  it('renders avatar image when avatarUrl is provided', async () => {
    render(<PetCard pet={mockPet} />)

    // Avatar with image - wait for image to potentially render
    await waitFor(() => {
      const avatarContainer = document.querySelector('[data-slot="avatar"]')
      expect(avatarContainer).toBeInTheDocument()
    })
  })

  it('renders fallback initials when avatarUrl is not provided', async () => {
    render(<PetCard pet={mockPetWithoutAvatar} />)

    // Should show fallback with initials
    await waitFor(() => {
      const fallback = document.querySelector('[data-slot="avatar-fallback"]')
      expect(fallback).toBeInTheDocument()
      expect(fallback).toHaveTextContent('阿黄')
    })
  })

  it('renders cat icon for cat pet type', () => {
    render(<PetCard pet={mockPet} />)

    // Cat icon from lucide-react should be rendered - check for SVG
    const container = document.querySelector('[data-slot="pet-card"]')
    expect(container).toBeInTheDocument()
    // Cat icon is an SVG with lucide-cat class
    const catIcon = container?.querySelector('.lucide-cat')
    expect(catIcon).toBeInTheDocument()
  })

  it('renders dog icon for dog pet type', () => {
    render(<PetCard pet={mockPetWithoutAvatar} />)

    const container = document.querySelector('[data-slot="pet-card"]')
    expect(container).toBeInTheDocument()
    // Dog icon is an SVG with lucide-dog class
    const dogIcon = container?.querySelector('.lucide-dog')
    expect(dogIcon).toBeInTheDocument()
  })

  it('renders emoji for other pet types', () => {
    const rabbitPet = {
      name: '兔兔',
      breed: '荷兰垂耳兔',
      petType: 'rabbit' as PetType,
    }

    render(<PetCard pet={rabbitPet} />)

    expect(screen.getByText('🐰')).toBeInTheDocument()
  })

  it('has data-slot attribute', async () => {
    render(<PetCard pet={mockPet} />)

    await waitFor(() => {
      const card = document.querySelector('[data-slot="pet-card"]')
      expect(card).toBeInTheDocument()
    })
  })

  it('applies custom className', async () => {
    render(<PetCard pet={mockPet} className="custom-class" />)

    await waitFor(() => {
      const card = document.querySelector('[data-slot="pet-card"]')
      expect(card).toHaveClass('custom-class')
    })
  })

  it('renders hamster emoji', () => {
    const hamsterPet = {
      name: '仓仓',
      breed: '金丝熊',
      petType: 'hamster' as PetType,
    }

    render(<PetCard pet={hamsterPet} />)

    expect(screen.getByText('🐹')).toBeInTheDocument()
  })

  it('renders bird emoji', () => {
    const birdPet = {
      name: '小鸟',
      breed: '虎皮鹦鹉',
      petType: 'bird' as PetType,
    }

    render(<PetCard pet={birdPet} />)

    expect(screen.getByText('🐦')).toBeInTheDocument()
  })

  it('renders other emoji for unknown pet type', () => {
    const otherPet = {
      name: '小龟',
      breed: '巴西龟',
      petType: 'other' as PetType,
    }

    render(<PetCard pet={otherPet} />)

    expect(screen.getByText('🐾')).toBeInTheDocument()
  })

  it('generates correct initials from pet name', async () => {
    const pet = {
      name: 'AB',
      breed: '测试',
      petType: 'cat' as PetType,
    }

    render(<PetCard pet={pet} />)

    // Check that the fallback shows initials in the avatar
    await waitFor(() => {
      const fallback = document.querySelector('[data-slot="avatar-fallback"]')
      expect(fallback).toBeInTheDocument()
      expect(fallback).toHaveTextContent('AB')
    })
  })
})
