import type {
  ProfileRow,
  SocialRow,
  SkillRow,
  TimelineRow,
  Profile,
  Social,
  Skill,
  TimelineItem,
} from './types'

// ─────────────────────────────────────────────────────────────────────────────
// TRANSFORM FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────
export function transformProfile(row: ProfileRow): Profile {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    bio: row.bio,
    bioMuted: row.bio_muted || '',
    ctaText: row.cta_text || '',
    ctaHref: row.cta_href || '',
    bioEn: row.bio_en || [],
    bioMutedEn: row.bio_muted_en || '',
    ctaTextEn: row.cta_text_en || '',
  }
}

export function transformSocial(row: SocialRow): Social {
  return {
    id: row.id,
    name: row.name,
    href: row.href,
    order: row.order,
  }
}

export function transformSkill(row: SkillRow): Skill {
  return {
    id: row.id,
    category: row.category,
    items: row.items,
    order: row.order,
    categoryEn: row.category_en || '',
  }
}

export function transformTimeline(row: TimelineRow): TimelineItem {
  if (row.type === 'experience') {
    return {
      id: row.id,
      type: 'experience',
      title: row.title!,
      company: row.company!,
      period: row.period,
      description: row.description || '',
      order: row.order,
      titleEn: row.title_en || '',
      descriptionEn: row.description_en || '',
    }
  }
  return {
    id: row.id,
    type: 'education',
    degree: row.degree!,
    school: row.school!,
    period: row.period,
    description: row.description || '',
    order: row.order,
    degreeEn: row.degree_en || '',
    descriptionEn: row.description_en || '',
  }
}
