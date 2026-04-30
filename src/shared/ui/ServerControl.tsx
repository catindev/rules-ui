import { FormEvent, useState } from 'react'
import {
  defaultProcessorBaseUrl,
  getStoredProcessorBaseUrl,
  setStoredProcessorBaseUrl,
} from '../api/processor-client'

type ServerControlProps = {
  onChange: (value: string) => void
}

export function ServerControl({ onChange }: ServerControlProps) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(getStoredProcessorBaseUrl())

  function submit(event: FormEvent) {
    event.preventDefault()
    setStoredProcessorBaseUrl(value || defaultProcessorBaseUrl())
    onChange(value || defaultProcessorBaseUrl())
    setEditing(false)
  }

  if (editing) {
    return (
      <form className="app-server-control__form" onSubmit={submit}>
        <label className="app-server-control app-server-control--editing">
          <span className="app-server-control__label">Сервер процессора</span>
          <input
            className="app-server-control__input"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onBlur={submit}
            autoFocus
            placeholder="http://localhost:3000"
          />
        </label>
      </form>
    )
  }

  return (
    <button className="app-server-control" type="button" onClick={() => setEditing(true)}>
      <span className="app-server-control__label">Сервер процессора</span>
      <span className="app-server-control__value">{value || 'same-origin'}</span>
    </button>
  )
}
