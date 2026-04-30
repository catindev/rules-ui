import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import type { ConditionWhenNode, RulesTreeNode } from '../types'
import { cn } from '../../../shared/lib/cn'
import { Icon } from './Icon'
import { artifactIconName, artifactUrl } from './artifactDisplay'

function renderWhenNode(node: ConditionWhenNode, key: string, isRoot = false): ReactNode {
  if (isRoot && node.kind === 'group' && node.mode === 'all' && node.children.length === 1) {
    return node.children.map((child, index) => renderWhenNode(child, `${key}-${index}`))
  }

  if (node.kind === 'predicate') {
    return (
      <li key={key} className="condition-when__item condition-when__item--predicate">
        <span className="condition-when__bullet">•</span>
        {node.missing ? (
          <span className="condition-link condition-link--missing">{node.title}</span>
        ) : (
          <Link className="condition-link" to={artifactUrl(node.artifactId)}>
            {node.title}
          </Link>
        )}
      </li>
    )
  }

  if (node.kind === 'group') {
    return (
      <li
        key={key}
        className={cn('condition-when__item condition-when__item--group', `condition-when__item--${node.mode}`)}
      >
        <div className="condition-when__group-title">
          {node.mode === 'any' ? <span className="condition-logic-badge">ANY</span> : null}
          <strong>{node.title}</strong>
        </div>
        <ul className="condition-when condition-when--nested">
          {node.children.map((child, index) => renderWhenNode(child, `${key}-${index}`))}
        </ul>
      </li>
    )
  }

  return (
    <li key={key} className="condition-when__item condition-when__item--unknown">
      {node.title}
    </li>
  )
}

export function WhenTreeView({ tree }: { tree?: ConditionWhenNode | null }) {
  if (!tree) return <span className="condition-muted">Условие не задано</span>
  return <ul className="condition-when">{renderWhenNode(tree, 'when', true)}</ul>
}

function ConditionCheckItem({ node }: { node: RulesTreeNode }) {
  if (node.kind === 'condition') {
    return <ConditionInlineBlock node={node} />
  }

  const content = (
    <>
      <Icon name={artifactIconName(node)} className="condition-check__icon" />
      <span className="condition-check__title">{node.title}</span>
      {node.kind === 'rule' && node.level ? (
        <span className={cn('rules-level', `rules-level--${node.level.toLowerCase()}`)}>
          {node.level}
        </span>
      ) : null}
    </>
  )

  if (node.missing) {
    return <div className="condition-check condition-check--missing">{content}</div>
  }

  return (
    <Link className={cn('condition-check', `condition-check--${node.kind}`)} to={artifactUrl(node.artifactId)}>
      {content}
    </Link>
  )
}

export function ConditionChecksList({ steps }: { steps?: RulesTreeNode[] }) {
  if (!steps?.length) return <span className="condition-muted">Проверки не заданы</span>
  return (
    <div className="condition-checks-list">
      {steps.map((step, index) => (
        <ConditionCheckItem key={`${step.kind}-${step.artifactId}-${index}`} node={step} />
      ))}
    </div>
  )
}

export function ConditionInlineBlock({ node }: { node: RulesTreeNode }) {
  return (
    <div className="condition-inline-block">
      <Link className="condition-inline-block__title" to={artifactUrl(node.artifactId)}>
        <Icon name={artifactIconName(node)} className="condition-inline-block__icon" />
        <span>{node.title}</span>
      </Link>
      <div className="condition-inline-block__body">
        <div className="condition-section-label">ЕСЛИ:</div>
        <WhenTreeView tree={node.whenTree} />
        {node.steps?.length ? (
          <>
            <div className="condition-section-label">ПРОВЕРИТЬ:</div>
            <ConditionChecksList steps={node.steps} />
          </>
        ) : null}
      </div>
    </div>
  )
}

export function ConditionDetails({ node }: { node: RulesTreeNode }) {
  return (
    <div className="condition-detail">
      <section className="condition-card">
        <h2 className="condition-card__title">Когда выполняется условный блок</h2>
        <div className="condition-card__body">
          <WhenTreeView tree={node.whenTree} />
        </div>
      </section>
      <section className="condition-card">
        <h2 className="condition-card__title">Проверки:</h2>
        <div className="condition-card__body condition-card__body--checks">
          <ConditionChecksList steps={node.steps} />
        </div>
      </section>
    </div>
  )
}
