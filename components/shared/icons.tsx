/**
 * Icons Collection
 * Centralized export of Lucide React icons used throughout PetSoul
 * Based on: docs/tech/phase-3-components-tasks.md (Task 5.1)
 */

// Re-export all icons from lucide-react for tree-shaking
// Only the icons actually imported in the codebase will be bundled

// Navigation & UI
export {
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  Home,
  Settings,
  User,
  LogOut,
  ExternalLink,
} from "lucide-react"

// Actions
export {
  Plus,
  Minus,
  Check,
  Copy,
  Trash2,
  Edit,
  Edit2,
  Edit3,
  Save,
  Undo,
  Redo,
  RefreshCw,
  RotateCcw,
  RotateCw,
} from "lucide-react"

// Media & Upload
export {
  Upload,
  Download,
  Image,
  Camera,
  ImagePlus,
  FileImage,
  Sparkles,
} from "lucide-react"

// Share & Social
export {
  Share,
  Share2,
  Link,
  Link2,
  QrCode,
  Mail,
  MessageCircle,
  Send,
} from "lucide-react"

// Status & Feedback
export {
  Loader2,
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from "lucide-react"

// Pet & Persona Related
export {
  Cat,
  Dog,
  Heart,
  Star,
  Crown,
  Zap,
  Flame,
  Coffee,
  Smile,
  Frown,
  Meh,
} from "lucide-react"

// Meme Editor
export {
  Type,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
  Wand2,
  SlidersHorizontal,
  Move,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from "lucide-react"

// Misc
export {
  Search,
  Filter,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Calendar,
  Clock,
  Gift,
  CreditCard,
  CircleDollarSign,
} from "lucide-react"

// Type export for icon components
export type { LucideIcon, LucideProps } from "lucide-react"
