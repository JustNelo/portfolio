// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
export interface PersonalInfo {
  firstName: string
  lastName: string
  bio: string[]
  bioMuted: string
  ctaText: string
  ctaHref: string
}

export interface Social {
  name: string
  href: string
}

export interface Skill {
  category: string
  items: string[]
}

export interface Experience {
  title: string
  company: string
  period: string
  description: string
}

export interface Education {
  degree: string
  school: string
  period: string
  description: string
}

export type TimelineItem = Experience | Education

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
export const personalInfo: PersonalInfo = {
  firstName: 'LÉON',
  lastName: 'GALLET',
  bio: [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  ],
  bioMuted: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  ctaText: 'Lorem Ipsum',
  ctaHref: 'mailto:contact@example.com',
}

export const socials: Social[] = [
  { name: 'Email', href: 'mailto:contact@example.com' },
  { name: 'LinkedIn', href: '#' },
  { name: 'GitHub', href: '#' },
]

export const skills: Skill[] = [
  { category: 'Frontend', items: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'] },
  { category: 'Backend', items: ['Node.js', 'Python', 'PostgreSQL', 'MongoDB'] },
  { category: 'Tools', items: ['Git', 'Docker', 'Figma', 'VS Code'] },
  { category: 'Languages', items: ['HTML', 'CSS', 'JavaScript', 'PHP', 'Java', 'C#'] },
]

export const experiences: Experience[] = [
  { 
    title: 'Senior Developer', 
    company: 'Tech Company', 
    period: '2022 - Present',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  },
  { 
    title: 'Full Stack Developer', 
    company: 'Startup Inc', 
    period: '2020 - 2022',
    description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
  },
  { 
    title: 'Junior Developer', 
    company: 'Digital Agency', 
    period: '2018 - 2020',
    description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
  },
]

export const education: Education[] = [
  {
    degree: 'Master in Computer Science',
    school: 'University of Technology',
    period: '2016 - 2018',
    description: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  },
  {
    degree: 'Bachelor in Software Engineering',
    school: 'Engineering School',
    period: '2013 - 2020',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.'
  },
]
