"use client"

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
import { toast } from "sonner"
import { Heart, Settings, Upload, Sparkles, User, Bell } from "lucide-react"

export default function UITestPage() {
  const [sliderValue, setSliderValue] = useState([50])
  const [loading, setLoading] = useState(false)

  const handleLoadingClick = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <Toaster />

      <div className="mx-auto max-w-4xl space-y-12">
        {/* Header */}
        <header className="text-center">
          <h1 className="font-heading text-3xl font-bold text-foreground">
            PetSoul UI Components
          </h1>
          <p className="mt-2 text-muted-foreground">
            Design System Preview - Phase 3 Component Library
          </p>
        </header>

        {/* Buttons */}
        <Section title="Button">
          <SubSection title="Variants">
            <div className="flex flex-wrap gap-3">
              <Button variant="default">Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
          </SubSection>

          <SubSection title="Sizes">
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
              <Button size="icon"><Heart className="size-4" /></Button>
              <Button size="icon-sm"><Heart className="size-4" /></Button>
              <Button size="icon-lg"><Heart className="size-5" /></Button>
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
              <Button loading={loading} onClick={handleLoadingClick}>
                {loading ? "Loading..." : "Click to Load"}
              </Button>
              <Button disabled>Disabled</Button>
              <Button variant="secondary" loading>
                Always Loading
              </Button>
            </div>
          </SubSection>

          <SubSection title="With Icons">
            <div className="flex flex-wrap gap-3">
              <Button>
                <Upload className="size-4" />
                Upload Photo
              </Button>
              <Button variant="secondary">
                <Sparkles className="size-4" />
                Generate
              </Button>
              <Button variant="outline">
                <Settings className="size-4" />
                Settings
              </Button>
            </div>
          </SubSection>
        </Section>

        {/* Input & Textarea */}
        <Section title="Input & Textarea">
          <SubSection title="Input States">
            <div className="grid gap-4 md:grid-cols-2">
              <Input placeholder="Default input" />
              <Input placeholder="Disabled input" disabled />
              <Input placeholder="With error" error errorMessage="This field is required" />
              <Input type="password" placeholder="Password input" />
            </div>
          </SubSection>

          <SubSection title="Textarea">
            <div className="grid gap-4 md:grid-cols-2">
              <Textarea placeholder="Default textarea..." />
              <Textarea
                placeholder="With error..."
                error
                errorMessage="Please enter at least 10 characters"
              />
            </div>
          </SubSection>
        </Section>

        {/* Card */}
        <Section title="Card">
          <SubSection title="Variants">
            <div className="grid gap-4 md:grid-cols-3">
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
            <div className="grid gap-4 md:grid-cols-3">
              <Card hover="lift">
                <CardHeader>
                  <CardTitle>Lift Hover</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Hover to lift up</p>
                </CardContent>
              </Card>

              <Card hover="glow">
                <CardHeader>
                  <CardTitle>Glow Hover</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Hover for glow effect</p>
                </CardContent>
              </Card>

              <Card hover="scale">
                <CardHeader>
                  <CardTitle>Scale Hover</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Hover to scale up</p>
                </CardContent>
              </Card>
            </div>
          </SubSection>

          <SubSection title="Full Card">
            <Card>
              <CardHeader>
                <CardTitle>Complete Card Example</CardTitle>
                <CardDescription>
                  A card with all sections including footer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  This card demonstrates the full structure with header, content, and footer.
                </p>
              </CardContent>
              <CardFooter className="gap-2">
                <Button variant="outline" size="sm">Cancel</Button>
                <Button size="sm">Confirm</Button>
              </CardFooter>
            </Card>
          </SubSection>
        </Section>

        {/* Dialog */}
        <Section title="Dialog">
          <div className="flex gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button>Open Dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Dialog Title</DialogTitle>
                  <DialogDescription>
                    This is a dialog with backdrop blur effect. Click outside or the X button to close.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Input placeholder="Enter something..." />
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
            >
              Success Toast
            </Button>
            <Button
              variant="outline"
              onClick={() => toast.error("Error! Something went wrong.")}
            >
              Error Toast
            </Button>
            <Button
              variant="outline"
              onClick={() => toast.warning("Warning! Please check your input.")}
            >
              Warning Toast
            </Button>
            <Button
              variant="outline"
              onClick={() => toast.info("Info: Here is some information.")}
            >
              Info Toast
            </Button>
            <Button
              variant="outline"
              onClick={() => toast.loading("Loading...", { duration: 2000 })}
            >
              Loading Toast
            </Button>
          </div>
        </Section>

        {/* Avatar */}
        <Section title="Avatar">
          <SubSection title="Sizes">
            <div className="flex items-end gap-4">
              <Avatar size="sm">
                <AvatarImage src="https://picsum.photos/seed/cat1/100" alt="Avatar" />
                <AvatarFallback>SM</AvatarFallback>
              </Avatar>
              <Avatar size="default">
                <AvatarImage src="https://picsum.photos/seed/cat2/100" alt="Avatar" />
                <AvatarFallback>DF</AvatarFallback>
              </Avatar>
              <Avatar size="lg">
                <AvatarImage src="https://picsum.photos/seed/cat3/100" alt="Avatar" />
                <AvatarFallback>LG</AvatarFallback>
              </Avatar>
              <Avatar size="xl">
                <AvatarImage src="https://picsum.photos/seed/cat4/100" alt="Avatar" />
                <AvatarFallback>XL</AvatarFallback>
              </Avatar>
              <Avatar size="2xl">
                <AvatarImage src="https://picsum.photos/seed/cat5/100" alt="Avatar" />
                <AvatarFallback>2XL</AvatarFallback>
              </Avatar>
            </div>
          </SubSection>

          <SubSection title="Fallback">
            <div className="flex items-center gap-4">
              <Avatar size="lg">
                <AvatarImage src="/invalid-url.jpg" alt="Avatar" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <Avatar size="lg">
                <AvatarImage src="/invalid-url.jpg" alt="Avatar" />
                <AvatarFallback>
                  <User className="size-5" />
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
                <Sparkles className="size-3" />
                Premium
              </Badge>
              <Badge variant="success">
                <Bell className="size-3" />
                Active
              </Badge>
            </div>
          </SubSection>
        </Section>

        {/* Skeleton */}
        <Section title="Skeleton">
          <SubSection title="Shimmer Animation (Default)">
            <div className="space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </SubSection>

          <SubSection title="Pulse Animation">
            <div className="space-y-3">
              <Skeleton shimmer={false} className="h-4 w-3/4" />
              <Skeleton shimmer={false} className="h-4 w-1/2" />
            </div>
          </SubSection>

          <SubSection title="Card Skeleton">
            <Card>
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
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Value: {sliderValue[0]}
                </label>
                <Slider
                  value={sliderValue}
                  onValueChange={setSliderValue}
                  max={100}
                  step={1}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Disabled</label>
                <Slider defaultValue={[30]} disabled />
              </div>
            </div>
          </SubSection>
        </Section>

        {/* Tabs */}
        <Section title="Tabs">
          <Tabs defaultValue="fonts">
            <TabsList>
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

        {/* Footer */}
        <footer className="border-t pt-8 text-center text-sm text-muted-foreground">
          <p>PetSoul Design System - Phase 3 Component Library</p>
        </footer>
      </div>
    </div>
  )
}

// Helper Components
function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-6">
      <h2 className="font-heading text-2xl font-semibold text-foreground">
        {title}
      </h2>
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
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      {children}
    </div>
  )
}
