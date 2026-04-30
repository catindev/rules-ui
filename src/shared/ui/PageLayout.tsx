import type { ReactNode } from 'react'
import { AppToolbar } from './AppToolbar'

type PageLayoutProps = {
  children: ReactNode
  onServerChange: (value: string) => void
}

export function PageLayout({ children, onServerChange }: PageLayoutProps) {
  return (
    <main className="app-page">
      <div className="app-shell-frame">
        <AppToolbar onServerChange={onServerChange} />
        <section className="app-shell">{children}</section>
      </div>
    </main>
  )
}
