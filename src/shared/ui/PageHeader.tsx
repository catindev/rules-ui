import type { ReactNode } from 'react'

type PageHeaderProps = {
  title: string
  subtitle?: ReactNode
  eyebrow?: string
}

export function PageHeader({ title, subtitle, eyebrow }: PageHeaderProps) {
  return (
    <header className="app-page-header">
      {eyebrow ? <div className="app-page-header__eyebrow">{eyebrow}</div> : null}
      <h1 className="app-page-header__title">{title}</h1>
      {subtitle ? <div className="app-page-header__subtitle">{subtitle}</div> : null}
    </header>
  )
}
