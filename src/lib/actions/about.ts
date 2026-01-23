/**
 * About section actions - Re-exports all domain-specific actions for backward compatibility.
 * For new code, prefer importing from the specific domain files directly:
 * - @/lib/actions/profile
 * - @/lib/actions/social
 * - @/lib/actions/skills
 * - @/lib/actions/timeline
 */

// Profile actions
export { getProfile, updateProfile } from './profile'

// Social actions
export { getSocials, addSocial, updateSocial, deleteSocial } from './social'

// Skills actions
export { getSkills, addSkill, updateSkill, deleteSkill } from './skills'

// Timeline actions
export {
  getTimeline,
  getExperiences,
  getEducation,
  addTimelineItem,
  updateTimelineItem,
  deleteTimelineItem,
} from './timeline'