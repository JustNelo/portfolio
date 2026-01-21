'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { deleteProject, type ProjectWithMedias } from '@/lib/actions/project'
import { toast } from '../../_components/Toaster'

interface ProjectsTableProps {
  projects: ProjectWithMedias[]
}

export default function ProjectsTable({ projects: initialProjects }: ProjectsTableProps) {
  const [projects, setProjects] = useState(initialProjects)
  const [isPending, startTransition] = useTransition()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = (project: ProjectWithMedias) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${project.title}" ?`)) {
      return
    }

    setDeletingId(project.id)
    startTransition(async () => {
      const result = await deleteProject(project.id)

      if (result.success) {
        toast('success', result.message)
        setProjects((prev) => prev.filter((p) => p.id !== project.id))
      } else {
        toast('error', result.message)
      }

      setDeletingId(null)
    })
  }

  if (projects.length === 0) {
    return (
      <div className="bg-card border border-border-medium p-12 text-center">
        <div className="space-y-4">
          <svg
            className="w-12 h-12 mx-auto text-muted"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <p className="font-mono text-sm text-muted">Aucun projet pour le moment</p>
          <Link
            href="/admin/projects/new"
            className="inline-block px-6 py-3 bg-primary text-background font-mono text-xs uppercase tracking-widest hover:bg-primary/90 transition-colors"
          >
            Créer votre premier projet
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border-medium overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border-medium">
            <th className="text-left p-4 font-mono text-[10px] text-muted uppercase tracking-widest">
              Projet
            </th>
            <th className="text-left p-4 font-mono text-[10px] text-muted uppercase tracking-widest hidden md:table-cell">
              Catégorie
            </th>
            <th className="text-left p-4 font-mono text-[10px] text-muted uppercase tracking-widest hidden lg:table-cell">
              Année
            </th>
            <th className="text-left p-4 font-mono text-[10px] text-muted uppercase tracking-widest hidden sm:table-cell">
              Médias
            </th>
            <th className="text-right p-4 font-mono text-[10px] text-muted uppercase tracking-widest">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr
              key={project.id}
              className={`border-b border-border-medium last:border-0 hover:bg-primary/5 transition-colors ${
                deletingId === project.id ? 'opacity-50' : ''
              }`}
            >
              <td className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-10 bg-background/50 overflow-hidden shrink-0">
                    {project.project_medias[0] ? (
                      <Image
                        src={project.project_medias[0].url}
                        alt={project.title}
                        width={64}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-mono text-[8px] text-muted">N/A</span>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-mono text-sm text-primary truncate">{project.title}</p>
                    <p className="font-mono text-[10px] text-muted truncate">/{project.slug}</p>
                  </div>
                </div>
              </td>
              <td className="p-4 hidden md:table-cell">
                <span className="font-mono text-xs text-muted">{project.category}</span>
              </td>
              <td className="p-4 hidden lg:table-cell">
                <span className="font-mono text-xs text-muted">{project.year}</span>
              </td>
              <td className="p-4 hidden sm:table-cell">
                <span className="font-mono text-xs text-muted">
                  {project.project_medias.length} fichier(s)
                </span>
              </td>
              <td className="p-4">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/projects/${project.slug}`}
                    target="_blank"
                    className="p-2 font-mono text-xs text-muted hover:text-primary transition-colors"
                    title="Voir"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </Link>
                  <Link
                    href={`/admin/projects/${project.id}`}
                    className="p-2 font-mono text-xs text-muted hover:text-primary transition-colors"
                    title="Éditer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </Link>
                  <button
                    onClick={() => handleDelete(project)}
                    disabled={isPending}
                    className="p-2 font-mono text-xs text-muted hover:text-red-500 transition-colors disabled:opacity-50"
                    title="Supprimer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
