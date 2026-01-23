'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import {
  HomeIcon,
  ProjectsIcon,
  MediaIcon,
  UserIcon,
  SettingsIcon,
  MenuIcon,
  CloseIcon,
} from '@/components/icons'
import Image from 'next/image'
import logo from '@/public/Logo.svg'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  {
    label: 'Vue d\'ensemble',
    href: '/admin',
    icon: <HomeIcon />,
  },
  {
    label: 'Projets',
    href: '/admin/projects',
    icon: <ProjectsIcon />,
  },
  {
    label: 'Médias',
    href: '/admin/medias',
    icon: <MediaIcon />,
  },
  {
    label: 'À propos',
    href: '/admin/about',
    icon: <UserIcon />,
  },
  {
    label: 'Paramètres',
    href: '/admin/settings',
    icon: <SettingsIcon />,
  },
]

interface AdminSidebarProps {
  user: User
}

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile Header Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 lg:hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-black/40 backdrop-blur-xl border-b border-white/10">
          <Link href="/admin" className="block">
            <Image src={logo} alt="Logo" width={40} height={40} />
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-primary hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Desktop Sidebar + Mobile Slide-out Menu */}
      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-50 w-72
          bg-black/40 backdrop-blur-xl border-r border-white/10
          flex flex-col
          transition-transform duration-300 ease-out
          lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo - hidden on mobile (shown in header instead) */}
        <div className="p-6 border-b border-white/10 hidden lg:block">
          <Link href="/admin" className="group flex items-center justify-center">
            <Image src={logo} alt="Logo" width={100} height={100} />
          </Link>
        </div>

        {/* Mobile spacer for header */}
        <div className="h-14 lg:hidden" />

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3.5 rounded-lg font-mono text-xs uppercase tracking-widest
                transition-all duration-200
                ${isActive(item.href)
                  ? 'bg-primary/20 text-primary border border-primary/30 shadow-lg shadow-primary/10'
                  : 'text-white/60 hover:text-primary hover:bg-white/5 border border-transparent'
                }
              `}
            >
              <span className={isActive(item.href) ? 'text-primary' : 'text-white/40'}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User info */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5">
            <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
              <span className="font-mono text-sm text-primary uppercase">
                {user.email?.[0] || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-mono text-xs text-white/80 truncate">
                {user.email}
              </p>
            </div>
          </div>
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="w-full mt-3 px-4 py-2.5 rounded-lg font-mono text-[10px] text-white/50 uppercase tracking-widest hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 text-left"
            >
              Déconnexion
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
        <div className="flex items-center justify-around px-2 py-2 bg-black/60 backdrop-blur-xl border-t border-white/10">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all duration-200
                ${isActive(item.href)
                  ? 'text-primary bg-primary/10'
                  : 'text-white/50 hover:text-primary'
                }
              `}
            >
              {item.icon}
              <span className="font-mono text-[8px] uppercase tracking-wider">
                {item.label.split(' ')[0]}
              </span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Spacer for mobile header */}
      <div className="h-14 lg:hidden" />
    </>
  )
}
