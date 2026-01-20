// Business Components (Molecules)
// Based on: docs/tech/phase-3-components-zh.md

// Phase 1: Simple Components
export { PersonaCard, type PersonaCardProps } from "./persona-card"
export { PetCard, type PetCardProps } from "./pet-card"
export {
  CreditDisplay,
  creditDisplayVariants,
  type CreditDisplayProps,
} from "./credit-display"
export { ResultCard, type ResultCardProps } from "./result-card"

// Phase 2: Container Components
export { PersonaSelector, type PersonaSelectorProps } from "./persona-selector"
export { ExportPanel, type ExportPanelProps } from "./export-panel"

// Phase 3: Complex Components (with external dependencies)
export {
  PhotoUploader,
  type PhotoUploaderProps,
  type ProcessedImage,
} from "./photo-uploader"
export { ResultCarousel, type ResultCarouselProps } from "./result-carousel"
export { MemeEditor, type MemeEditorProps } from "./meme-editor"
