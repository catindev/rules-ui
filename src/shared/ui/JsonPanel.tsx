import JsonView from '@uiw/react-json-view'

type JsonPanelProps = {
  value: unknown
  emptyMessage?: string
  collapsed?: boolean | number
}

export function JsonPanel({
  value,
  emptyMessage = 'Нет данных',
  collapsed = 2,
}: JsonPanelProps) {
  if (value == null) return <p className="app-empty-text">{emptyMessage}</p>

  return (
    <div className="app-json-panel">
      <JsonView value={value} collapsed={collapsed} displayDataTypes={false} />
    </div>
  )
}
