import { Link } from 'react-router-dom'
import backIcon from './icon-back.svg'

type BackLinkProps = {
  to?: string
  label: string
  onClick?: () => void
}

export function BackLink({ to, label, onClick }: BackLinkProps) {
  const content = (
    <>
      <img
        alt=""
        aria-hidden="true"
        className="app-back-link__icon"
        src={backIcon}
      />
      <span>{label}</span>
    </>
  )

  if (to) {
    return (
      <Link className="app-back-link" to={to}>
        {content}
      </Link>
    )
  }

  return (
    <button className="app-back-link" type="button" onClick={onClick}>
      {content}
    </button>
  )
}
