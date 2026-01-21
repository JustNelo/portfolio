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
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-12 text-center">
        <div className="space-y-4">
          <svg
            className="w-12 h-12 mx-auto text-white/30"
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
          <p className="font-mono text-sm text-white/60">Aucun projet pour le moment</p>
          <Link
            href="/admin/projects/new"
            className="inline-block px-6 py-3 bg-primary/90 backdrop-blur-sm text-background font-mono text-xs uppercase tracking-widest hover:bg-primary rounded-lg transition-all duration-300"
          >
            Créer votre premier projet
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left p-4 font-mono text-[10px] text-white/50 uppercase tracking-widest">
                Projet
              </th>
              <th className="text-left p-4 font-mono text-[10px] text-white/50 uppercase tracking-widest">
                Catégorie
              </th>
              <th className="text-left p-4 font-mono text-[10px] text-white/50 uppercase tracking-widest">
                Année
              </th>
              <th className="text-left p-4 font-mono text-[10px] text-white/50 uppercase tracking-widest">
                Médias
              </th>
              <th className="text-right p-4 font-mono text-[10px] text-white/50 uppercase tracking-widest">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr
                key={project.id}
                className={`border-b border-white/5 last:border-0 hover:bg-white/5 transition-all duration-200 ${
                  deletingId === project.id ? 'opacity-50' : ''
                }`}
              >
                <td className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-10 bg-black/30 rounded-lg overflow-hidden shrink-0">
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
                          <span className="font-mono text-[8px] text-white/30">N/A</span>
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-mono text-sm text-white/90 truncate">{project.title}</p>
                      <p className="font-mono text-[10px] text-white/40 truncate">/{project.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="font-mono text-xs text-white/60 px-2 py-1 bg-white/5 rounded">{project.category}</span>
                </td>
                <td className="p-4">
                  <span className="font-mono text-xs text-white/60">{project.year}</span>
                </td>
                <td className="p-4">
                  <span className="font-mono text-xs text-white/60">
                    {project.project_medias.length} fichier(s)
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/projects/${project.slug}`}
                      target="_blank"
                      className="p-2.5 text-white/40 hover:text-primary hover:bg-white/5 rounded-lg transition-all duration-200"
                      title="Voir"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </Link>
                    <Link
                      href={`/admin/projects/${project.id}`}
                      className="p-2.5 text-white/40 hover:text-primary hover:bg-white/5 rounded-lg transition-all duration-200"
                      title="Éditer"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </Link>
                    <button
                      onClick={() => handleDelete(project)}
                      disabled={isPending}
                      className="p-2.5 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200 disabled:opacity-50"
                      title="Supprimer"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile/Tablet Card View */}
      <div className="lg:hidden space-y-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 transition-all duration-200 ${
              deletingId === project.id ? 'opacity-50' : ''
            }`}
          >
            <div className="flex gap-4">
              {/* Thumbnail */}
              <div className="w-20 h-14 sm:w-24 sm:h-16 bg-black/30 rounded-lg overflow-hidden shrink-0">
                {project.project_medias[0] ? (
                  <Image
                    src={project.project_medias[0].url}
                    alt={project.title}
                    width={96}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="font-mono text-[8px] text-white/30">N/A</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-mono text-sm text-white/90 truncate">{project.title}</h3>
                <p className="font-mono text-[10px] text-white/40 truncate mt-0.5">/{project.slug}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="font-mono text-[10px] text-white/50 px-2 py-0.5 bg-white/5 rounded">
                    {project.category}
                  </span>
                  <span className="font-mono text-[10px] text-white/40">{project.year}</span>
                  <span className="font-mono text-[10px] text-white/40">
                    · {project.project_medias.length} média(s)
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-1 mt-3 pt-3 border-t border-white/5">
              <Link
                href={`/projects/${project.slug}`}
                target="_blank"
                className="flex items-center gap-1.5 px-3 py-2 text-white/50 hover:text-primary hover:bg-white/5 rounded-lg transition-all duration-200 font-mono text-[10px] uppercase"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Voir
              </Link>
              <Link
                href={`/admin/projects/${project.id}`}
                className="flex items-center gap-1.5 px-3 py-2 text-white/50 hover:text-primary hover:bg-white/5 rounded-lg transition-all duration-200 font-mono text-[10px] uppercase"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Éditer
              </Link>
              <button
                onClick={() => handleDelete(project)}
                disabled={isPending}
                className="flex items-center gap-1.5 px-3 py-2 text-white/50 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200 font-mono text-[10px] uppercase disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Suppr.
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
