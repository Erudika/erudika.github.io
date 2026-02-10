// =============================================================================
// Data Types
// =============================================================================

export interface CtaButton {
  label: string
  href: string
  tone?: 'primary' | 'ghost' | 'secondary'
}

export interface HeroBadge {
  label: string
  description: string
}

export interface HeroMediaCard {
  type: 'gradient-card'
  headline: string
  description: string
  sparkline: number[]
}

export interface HeroContent {
  eyebrow: string
  title: string
  subtitle: string
  badges: HeroBadge[]
  media: HeroMediaCard
  primaryCta: CtaButton
  secondaryCta: CtaButton
}

export interface ProjectHighlight {
  id: string
  name: string
  tagline: string
  category: 'Open Source' | 'Cloud' | 'Self-Hosted' | string
  cta: CtaButton
  signal?: string
}

export interface ProofMetric {
  label: string
  value: string
  description: string
}

export interface Testimonial {
  quote: string
  author: string
  role: string
  avatarColor?: string
}

export interface ProofPoints {
  metrics: ProofMetric[]
  testimonials: Testimonial[]
  pressQuotes: string[]
}

export interface QuickJumpChip {
  label: string
  description: string
  href: string
}

export interface TrustStatus {
  label: string
  href: string
  state: string
}

export interface TrustContact {
  email: string
  phone?: string
}

export interface LegalLink {
  label: string
  href: string
}

export interface TrustRail {
  company: string
  address: string
  vat?: string
  status: TrustStatus
  contact: TrustContact
  legalLinks: LegalLink[]
  footnote?: string
}

export interface MarketingFoundationData {
  hero: HeroContent
  projectHighlights: ProjectHighlight[]
  proofPoints: ProofPoints
  quickJumpChips: QuickJumpChip[]
  trustRail: TrustRail
}

// =============================================================================
// Component Props
// =============================================================================

export interface MarketingFoundationSectionProps {
  /** Structured data powering all hero, highlight, proof, and trust regions */
  data: MarketingFoundationData
  /** Triggered when the primary CTA in the hero is clicked */
  onPrimaryCta?: (cta: CtaButton) => void
  /** Triggered when the secondary CTA in the hero is clicked */
  onSecondaryCta?: (cta: CtaButton) => void
  /** Fired when a user selects a featured project card */
  onSelectProject?: (projectId: string) => void
  /** Called when a quick-jump chip is invoked to scroll to a section */
  onJumpToSection?: (href: string) => void
  /** Invoked when the user clicks the status badge */
  onViewStatus?: (status: TrustStatus) => void
  /** Invoked when the user chooses a trust/contact action */
  onContact?: (contact: TrustContact) => void
}
