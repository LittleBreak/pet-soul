"use client"

import * as React from "react"
import { useState } from "react"
import {
  Button,
  Input,
  Textarea,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Toaster,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Badge,
  Skeleton,
  Slider,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui"
import {
  PersonaCard,
  PetCard,
  CreditDisplay,
  ResultCard,
  PersonaSelector,
  ExportPanel,
  PhotoUploader,
  ResultCarousel,
  MemeEditor,
} from "@/components/business"
import { Logo } from "@/components/shared/logo"
import { PERSONAS, getPersonaList } from "@/lib/constants/personas"
import type { Monologue, PersonaId } from "@/types"
import { toast } from "sonner"
import { Heart, Settings, Upload, Sparkles, User, Bell } from "lucide-react"

// Mock data for business components
const mockMonologues: Monologue[] = [
  {
    id: "1",
    content: "哼，这就是你今天的工作表现？勉强及格。本喵允许你今天多睡五分钟。",
    personaId: "aloof-boss",
    tone: "高冷",
  },
  {
    id: "2",
    content: "看什么看？没见过这么优雅的喵吗？快去给我倒杯水，跪着！",
    personaId: "aloof-boss",
    tone: "傲娇",
  },
  {
    id: "3",
    content: "今天的阳光不错，允许你陪我晒太阳。但是距离保持一米以上。",
    personaId: "aloof-boss",
    tone: "霸道",
  },
]

export default function DesignSystemPage() {
  // State for UI components
  const [sliderValue, setSliderValue] = useState([50])
  const [loading, setLoading] = useState(false)

  // State for business components
  const [selectedPersonaId, setSelectedPersonaId] =
    React.useState<PersonaId>("aloof-boss")
  const [selectedResultIndex, setSelectedResultIndex] = React.useState(0)

  const handleLoadingClick = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster />

      {/* Navigation */}
      <nav
        className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        role="navigation"
        aria-label="Design system navigation"
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Logo size="default" aria-label="PetSoul Logo" />
            <nav className="hidden md:flex gap-4" aria-label="Component sections">
              <a
                href="#atoms"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Atoms
              </a>
              <a
                href="#molecules"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Molecules
              </a>
            </nav>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 space-y-16">
        {/* Header */}
        <header className="text-center space-y-4">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
            PetSoul Design System
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Complete component library preview - Phase 3. Includes atomic UI
            components and business molecules with multiple states.
          </p>
          <div className="flex flex-wrap justify-center gap-2 pt-4">
            <Badge>11 Atoms</Badge>
            <Badge variant="secondary">9 Molecules</Badge>
            <Badge variant="accent">Responsive</Badge>
            <Badge variant="outline">WCAG AA</Badge>
          </div>
        </header>

        {/* ============================================ */}
        {/* ATOMS (UI Components) */}
        {/* ============================================ */}
        <div id="atoms" className="space-y-12">
          <SectionHeader
            title="Atomic Components"
            description="Base UI building blocks from shadcn/ui with PetSoul customizations"
          />

          {/* Logo */}
          <Section title="Logo">
            <SubSection title="Variants">
              <div className="flex flex-wrap items-end gap-6">
                <Logo size="sm" aria-label="Small PetSoul logo" />
                <Logo size="default" aria-label="Default PetSoul logo" />
                <Logo size="lg" aria-label="Large PetSoul logo" />
                <Logo size="xl" aria-label="Extra large PetSoul logo" />
              </div>
            </SubSection>
            <SubSection title="Display Options">
              <div className="flex flex-wrap items-center gap-6">
                <Logo showText={false} aria-label="PetSoul icon only" />
                <Logo showIcon={false} aria-label="PetSoul text only" />
                <Logo aria-label="PetSoul full logo" />
              </div>
            </SubSection>
          </Section>

          {/* Buttons */}
          <Section title="Button">
            <SubSection title="Variants">
              <div className="flex flex-wrap gap-3">
                <Button variant="default" aria-label="Default button">
                  Default
                </Button>
                <Button variant="secondary" aria-label="Secondary button">
                  Secondary
                </Button>
                <Button variant="destructive" aria-label="Destructive button">
                  Destructive
                </Button>
                <Button variant="outline" aria-label="Outline button">
                  Outline
                </Button>
                <Button variant="ghost" aria-label="Ghost button">
                  Ghost
                </Button>
                <Button variant="link" aria-label="Link style button">
                  Link
                </Button>
              </div>
            </SubSection>

            <SubSection title="Sizes">
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon" aria-label="Icon button with heart">
                  <Heart className="size-4" />
                </Button>
                <Button size="icon-sm" aria-label="Small icon button with heart">
                  <Heart className="size-4" />
                </Button>
                <Button size="icon-lg" aria-label="Large icon button with heart">
                  <Heart className="size-5" />
                </Button>
              </div>
            </SubSection>

            <SubSection title="Rounded">
              <div className="flex flex-wrap gap-3">
                <Button rounded="xl">Rounded XL</Button>
                <Button rounded="2xl">Rounded 2XL</Button>
                <Button rounded="full">Rounded Full</Button>
              </div>
            </SubSection>

            <SubSection title="States">
              <div className="flex flex-wrap gap-3">
                <Button
                  loading={loading}
                  onClick={handleLoadingClick}
                  aria-busy={loading}
                >
                  {loading ? "Loading..." : "Click to Load"}
                </Button>
                <Button disabled aria-disabled="true">
                  Disabled
                </Button>
                <Button variant="secondary" loading aria-busy="true">
                  Always Loading
                </Button>
              </div>
            </SubSection>

            <SubSection title="With Icons">
              <div className="flex flex-wrap gap-3">
                <Button>
                  <Upload className="size-4" aria-hidden="true" />
                  Upload Photo
                </Button>
                <Button variant="secondary">
                  <Sparkles className="size-4" aria-hidden="true" />
                  Generate
                </Button>
                <Button variant="outline">
                  <Settings className="size-4" aria-hidden="true" />
                  Settings
                </Button>
              </div>
            </SubSection>
          </Section>

          {/* Input & Textarea */}
          <Section title="Input & Textarea">
            <SubSection title="Input States">
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <Input
                  placeholder="Default input"
                  aria-label="Default text input"
                />
                <Input
                  placeholder="Disabled input"
                  disabled
                  aria-label="Disabled text input"
                  aria-disabled="true"
                />
                <Input
                  placeholder="With error"
                  error
                  errorMessage="This field is required"
                  aria-invalid="true"
                  aria-describedby="input-error-1"
                />
                <Input
                  type="password"
                  placeholder="Password input"
                  aria-label="Password input"
                />
              </div>
            </SubSection>

            <SubSection title="Textarea">
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <Textarea
                  placeholder="Default textarea..."
                  aria-label="Default textarea"
                />
                <Textarea
                  placeholder="With error..."
                  error
                  errorMessage="Please enter at least 10 characters"
                  aria-invalid="true"
                />
              </div>
            </SubSection>
          </Section>

          {/* Card */}
          <Section title="Card">
            <SubSection title="Variants">
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Default Card</CardTitle>
                    <CardDescription>Standard card style</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      This is a default card with shadow.
                    </p>
                  </CardContent>
                </Card>

                <Card variant="glass">
                  <CardHeader>
                    <CardTitle>Glass Card</CardTitle>
                    <CardDescription>Glassmorphism style</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Backdrop blur effect.
                    </p>
                  </CardContent>
                </Card>

                <Card variant="outline">
                  <CardHeader>
                    <CardTitle>Outline Card</CardTitle>
                    <CardDescription>Border only</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Transparent background.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </SubSection>

            <SubSection title="Hover Effects">
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                <Card hover="lift" tabIndex={0} role="button" aria-label="Lift hover card">
                  <CardHeader>
                    <CardTitle>Lift Hover</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Hover to lift up
                    </p>
                  </CardContent>
                </Card>

                <Card hover="glow" tabIndex={0} role="button" aria-label="Glow hover card">
                  <CardHeader>
                    <CardTitle>Glow Hover</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Hover for glow effect
                    </p>
                  </CardContent>
                </Card>

                <Card hover="scale" tabIndex={0} role="button" aria-label="Scale hover card">
                  <CardHeader>
                    <CardTitle>Scale Hover</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Hover to scale up
                    </p>
                  </CardContent>
                </Card>
              </div>
            </SubSection>

            <SubSection title="Full Card">
              <Card className="max-w-md">
                <CardHeader>
                  <CardTitle>Complete Card Example</CardTitle>
                  <CardDescription>
                    A card with all sections including footer
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    This card demonstrates the full structure with header,
                    content, and footer.
                  </p>
                </CardContent>
                <CardFooter className="gap-2">
                  <Button variant="outline" size="sm">
                    Cancel
                  </Button>
                  <Button size="sm">Confirm</Button>
                </CardFooter>
              </Card>
            </SubSection>
          </Section>

          {/* Dialog */}
          <Section title="Dialog">
            <div className="flex flex-wrap gap-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Open Dialog</Button>
                </DialogTrigger>
                <DialogContent aria-describedby="dialog-description">
                  <DialogHeader>
                    <DialogTitle>Dialog Title</DialogTitle>
                    <DialogDescription id="dialog-description">
                      This is a dialog with backdrop blur effect. Click outside
                      or the X button to close.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Input
                      placeholder="Enter something..."
                      aria-label="Dialog input"
                    />
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button>Confirm</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">No Close Button</Button>
                </DialogTrigger>
                <DialogContent showCloseButton={false}>
                  <DialogHeader>
                    <DialogTitle>Custom Dialog</DialogTitle>
                    <DialogDescription>
                      This dialog has no close button. Click outside to close.
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          </Section>

          {/* Toast */}
          <Section title="Toast (Sonner)">
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={() => toast.success("Success! Operation completed.")}
                aria-label="Show success toast"
              >
                Success Toast
              </Button>
              <Button
                variant="outline"
                onClick={() => toast.error("Error! Something went wrong.")}
                aria-label="Show error toast"
              >
                Error Toast
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  toast.warning("Warning! Please check your input.")
                }
                aria-label="Show warning toast"
              >
                Warning Toast
              </Button>
              <Button
                variant="outline"
                onClick={() => toast.info("Info: Here is some information.")}
                aria-label="Show info toast"
              >
                Info Toast
              </Button>
              <Button
                variant="outline"
                onClick={() => toast.loading("Loading...", { duration: 2000 })}
                aria-label="Show loading toast"
              >
                Loading Toast
              </Button>
            </div>
          </Section>

          {/* Avatar */}
          <Section title="Avatar">
            <SubSection title="Sizes">
              <div className="flex flex-wrap items-end gap-4">
                <Avatar size="sm">
                  <AvatarImage
                    src="https://picsum.photos/seed/cat1/100"
                    alt="Small avatar of a cat"
                  />
                  <AvatarFallback>SM</AvatarFallback>
                </Avatar>
                <Avatar size="default">
                  <AvatarImage
                    src="https://picsum.photos/seed/cat2/100"
                    alt="Default avatar of a cat"
                  />
                  <AvatarFallback>DF</AvatarFallback>
                </Avatar>
                <Avatar size="lg">
                  <AvatarImage
                    src="https://picsum.photos/seed/cat3/100"
                    alt="Large avatar of a cat"
                  />
                  <AvatarFallback>LG</AvatarFallback>
                </Avatar>
                <Avatar size="xl">
                  <AvatarImage
                    src="https://picsum.photos/seed/cat4/100"
                    alt="Extra large avatar of a cat"
                  />
                  <AvatarFallback>XL</AvatarFallback>
                </Avatar>
                <Avatar size="2xl">
                  <AvatarImage
                    src="https://picsum.photos/seed/cat5/100"
                    alt="2XL avatar of a cat"
                  />
                  <AvatarFallback>2XL</AvatarFallback>
                </Avatar>
              </div>
            </SubSection>

            <SubSection title="Fallback">
              <div className="flex flex-wrap items-center gap-4">
                <Avatar size="lg">
                  <AvatarImage src="/invalid-url.jpg" alt="Avatar with fallback" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <Avatar size="lg">
                  <AvatarImage src="/invalid-url.jpg" alt="Avatar with icon fallback" />
                  <AvatarFallback>
                    <User className="size-5" aria-hidden="true" />
                  </AvatarFallback>
                </Avatar>
              </div>
            </SubSection>
          </Section>

          {/* Badge */}
          <Section title="Badge">
            <SubSection title="Variants">
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="accent">Accent</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="error">Error</Badge>
                <Badge variant="muted">Muted</Badge>
              </div>
            </SubSection>

            <SubSection title="Sizes">
              <div className="flex flex-wrap items-center gap-2">
                <Badge size="sm">Small</Badge>
                <Badge size="default">Default</Badge>
                <Badge size="lg">Large</Badge>
              </div>
            </SubSection>

            <SubSection title="With Icons">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">
                  <Sparkles className="size-3" aria-hidden="true" />
                  Premium
                </Badge>
                <Badge variant="success">
                  <Bell className="size-3" aria-hidden="true" />
                  Active
                </Badge>
              </div>
            </SubSection>
          </Section>

          {/* Skeleton */}
          <Section title="Skeleton">
            <SubSection title="Shimmer Animation (Default)">
              <div className="space-y-3 max-w-md" role="status" aria-label="Loading content">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </SubSection>

            <SubSection title="Pulse Animation">
              <div className="space-y-3 max-w-md" role="status" aria-label="Loading content">
                <Skeleton shimmer={false} className="h-4 w-3/4" />
                <Skeleton shimmer={false} className="h-4 w-1/2" />
              </div>
            </SubSection>

            <SubSection title="Card Skeleton">
              <Card className="max-w-sm" role="status" aria-label="Loading card">
                <CardHeader>
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-4 w-2/3" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-32 w-full rounded-xl" />
                </CardContent>
              </Card>
            </SubSection>
          </Section>

          {/* Slider */}
          <Section title="Slider">
            <SubSection title="Default">
              <div className="space-y-6 max-w-md">
                <div className="space-y-2">
                  <label
                    htmlFor="slider-default"
                    className="text-sm font-medium"
                  >
                    Value: {sliderValue[0]}
                  </label>
                  <Slider
                    id="slider-default"
                    value={sliderValue}
                    onValueChange={setSliderValue}
                    max={100}
                    step={1}
                    aria-label="Adjustable slider"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="slider-disabled"
                    className="text-sm font-medium"
                  >
                    Disabled
                  </label>
                  <Slider
                    id="slider-disabled"
                    defaultValue={[30]}
                    disabled
                    aria-label="Disabled slider"
                    aria-disabled="true"
                  />
                </div>
              </div>
            </SubSection>
          </Section>

          {/* Tabs */}
          <Section title="Tabs">
            <Tabs defaultValue="fonts" className="max-w-lg">
              <TabsList aria-label="Editor options">
                <TabsTrigger value="fonts">Fonts</TabsTrigger>
                <TabsTrigger value="filters">Filters</TabsTrigger>
                <TabsTrigger value="stickers">Stickers</TabsTrigger>
              </TabsList>
              <TabsContent value="fonts">
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">
                      Font selection panel content would go here.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="filters">
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">
                      Filter selection panel content would go here.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="stickers">
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">
                      Sticker selection panel content would go here.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </Section>
        </div>

        {/* ============================================ */}
        {/* MOLECULES (Business Components) */}
        {/* ============================================ */}
        <div id="molecules" className="space-y-12 pt-8 border-t">
          <SectionHeader
            title="Business Components"
            description="Feature-rich molecules built on atomic components for PetSoul functionality"
          />

          {/* PersonaCard */}
          <Section title="PersonaCard">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <PersonaCard
                persona={PERSONAS["aloof-boss"]}
                aria-label="Aloof boss persona card"
              />
              <PersonaCard
                persona={PERSONAS["chatty-auntie"]}
                selected
                aria-label="Chatty auntie persona card, selected"
              />
              <PersonaCard
                persona={{ ...PERSONAS["literary-youth"], isPremium: true }}
                onSelect={() => toast.info("Selected premium persona!")}
                aria-label="Literary youth premium persona card"
              />
            </div>
          </Section>

          {/* PetCard */}
          <Section title="PetCard">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
              <PetCard
                pet={{
                  name: "橘座",
                  breed: "橘猫",
                  petType: "cat",
                  personality: "高冷",
                }}
                aria-label="Pet card for 橘座 the cat"
              />
              <PetCard
                pet={{
                  name: "旺财",
                  avatarUrl: "https://placekitten.com/200/200",
                  breed: "柯基",
                  petType: "dog",
                  personality: "活泼",
                }}
                aria-label="Pet card for 旺财 the dog"
              />
            </div>
          </Section>

          {/* CreditDisplay */}
          <Section title="CreditDisplay">
            <div className="space-y-4 max-w-md">
              <SubSection title="Inline Variant">
                <div className="flex flex-wrap gap-4">
                  <CreditDisplay
                    used={2}
                    total={5}
                    variant="inline"
                    aria-label="2 of 5 credits used"
                  />
                  <CreditDisplay
                    used={4}
                    total={5}
                    variant="inline"
                    aria-label="4 of 5 credits used"
                  />
                  <CreditDisplay
                    used={5}
                    total={5}
                    variant="inline"
                    aria-label="5 of 5 credits used, depleted"
                  />
                  <CreditDisplay
                    used={0}
                    total={5}
                    isPremium
                    variant="inline"
                    aria-label="Premium user, unlimited credits"
                  />
                </div>
              </SubSection>
              <SubSection title="Detailed Variant">
                <div className="space-y-3">
                  <CreditDisplay
                    used={2}
                    total={5}
                    variant="detailed"
                    aria-label="Credit display showing 2 of 5 used"
                  />
                  <CreditDisplay
                    used={4}
                    total={5}
                    variant="detailed"
                    aria-label="Credit display showing 4 of 5 used, low"
                  />
                  <CreditDisplay
                    used={0}
                    total={5}
                    isPremium
                    variant="detailed"
                    aria-label="Premium credit display"
                  />
                </div>
              </SubSection>
            </div>
          </Section>

          {/* ResultCard */}
          <Section title="ResultCard">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockMonologues.map((monologue, index) => (
                <ResultCard
                  key={monologue.id}
                  result={monologue}
                  selected={index === 0}
                  onSelect={() => toast.success(`Selected result ${index + 1}`)}
                  aria-label={`Result card ${index + 1}${index === 0 ? ", selected" : ""}`}
                />
              ))}
            </div>
          </Section>

          {/* PersonaSelector */}
          <Section title="PersonaSelector">
            <PersonaSelector
              personas={getPersonaList()}
              selectedId={selectedPersonaId}
              onSelect={setSelectedPersonaId}
              aria-label="Persona selection grid"
            />
          </Section>

          {/* ExportPanel */}
          <Section title="ExportPanel">
            <div className="max-w-md">
              <ExportPanel
                onDownload={() => {
                  toast.success("Downloading image...")
                }}
                onShare={(platform) => {
                  toast.info(`Sharing to ${platform}...`)
                }}
                aria-label="Export and share options"
              />
            </div>
          </Section>

          {/* PhotoUploader */}
          <Section title="PhotoUploader">
            <div className="max-w-md">
              <PhotoUploader
                onFileSelect={(file, processed) =>
                  toast.success(`File selected: ${file.name}`)
                }
                onError={(error) => toast.error(`Error: ${error}`)}
                aria-label="Photo upload dropzone"
              />
            </div>
          </Section>

          {/* ResultCarousel */}
          <Section title="ResultCarousel">
            <div className="max-w-md">
              <ResultCarousel
                results={mockMonologues}
                currentIndex={selectedResultIndex}
                onSelectResult={setSelectedResultIndex}
                aria-label="Result carousel with navigation"
              />
            </div>
          </Section>

          {/* MemeEditor */}
          <Section title="MemeEditor">
            <div className="max-w-md">
              <MemeEditor
                imageUrl="https://placekitten.com/400/400"
                text="本喵今天心情不错！"
                showWatermark
                onExport={(dataUrl) =>
                  toast.success("Meme exported successfully!")
                }
                aria-label="Meme editor with image and text controls"
              />
            </div>
          </Section>
        </div>

        {/* Footer */}
        <footer className="border-t pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            PetSoul Design System - Phase 3 Component Library
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Responsive: 375px (mobile) · 768px (tablet) · 1024px+ (desktop)
          </p>
        </footer>
      </main>
    </div>
  )
}

// Helper Components
function SectionHeader({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="space-y-2">
      <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
        {title}
      </h2>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-6" aria-labelledby={`section-${title.toLowerCase().replace(/\s+/g, "-")}`}>
      <h3
        id={`section-${title.toLowerCase().replace(/\s+/g, "-")}`}
        className="font-heading text-xl font-semibold text-foreground"
      >
        {title}
      </h3>
      <div className="space-y-6">{children}</div>
    </section>
  )
}

function SubSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
      {children}
    </div>
  )
}
