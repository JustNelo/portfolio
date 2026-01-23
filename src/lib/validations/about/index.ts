/**
 * About section validation - Re-exports all schemas, types, and transforms.
 * For new code, prefer importing from specific files:
 * - @/lib/validations/about/schemas
 * - @/lib/validations/about/types
 * - @/lib/validations/about/transforms
 */

// Schemas
export {
  profileSchema,
  socialSchema,
  updateSocialSchema,
  skillSchema,
  updateSkillSchema,
  experienceSchema,
  educationSchema,
  timelineSchema,
  updateExperienceSchema,
  updateEducationSchema,
  updateTimelineSchema,
  type ProfileFormData,
  type SocialFormData,
  type UpdateSocialFormData,
  type SkillFormData,
  type UpdateSkillFormData,
  type ExperienceFormData,
  type EducationFormData,
  type TimelineFormData,
  type UpdateTimelineFormData,
} from './schemas'

// Types
export type {
  ProfileRow,
  SocialRow,
  SkillRow,
  TimelineRow,
  Profile,
  Social,
  Skill,
  Experience,
  Education,
  TimelineItem,
} from './types'

// Transforms
export {
  transformProfile,
  transformSocial,
  transformSkill,
  transformTimeline,
} from './transforms'
