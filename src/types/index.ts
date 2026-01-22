/**
 * Centralized type definitions for the portfolio application.
 * Import types from here to ensure consistency across components.
 */

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION TYPES
// ─────────────────────────────────────────────────────────────────────────────

/** Direction for FadeIn animation */
export type FadeDirection = 'up' | 'down' | 'left' | 'right' | 'none'

/** Polymorphic element types for text components */
export type TextElement = 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'div'

/** Polymorphic element types for container components */
export type ContainerElement = 'div' | 'section' | 'article' | 'span' | 'li' | 'ul'

// ─────────────────────────────────────────────────────────────────────────────
// THREE.JS TYPES
// ─────────────────────────────────────────────────────────────────────────────

/** Quality levels for adaptive rendering */
export type QualityLevel = 'low' | 'medium' | 'high'

// ─────────────────────────────────────────────────────────────────────────────
// RE-EXPORTS FROM DATA
// ─────────────────────────────────────────────────────────────────────────────

export type {
  Profile,
  Social,
  Skill,
  Experience,
  Education,
  TimelineItem
} from '@/lib/validations/about'

// ─────────────────────────────────────────────────────────────────────────────
// SUPABASE / PROJECT TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type { 
  Project, 
  ProjectInsert, 
  ProjectUpdate,
  ProjectMedia,
  ProjectMediaInsert,
  ProjectMediaUpdate,
  MediaType
} from './project'
