import type { RulesTreeNode } from '../types'
import type { IconName } from './Icon'

export function artifactUrl(artifactId: string) {
  return `/artifacts/${encodeURIComponent(artifactId)}`
}

export function artifactKindLabel(kind: string) {
  if (kind === 'rule') return 'Правило'
  if (kind === 'condition') return 'Условие'
  if (kind === 'dictionary') return 'Справочник'
  if (kind === 'pipeline') return 'Сценарий'
  return 'Артефакт'
}

export function artifactIconName(node: Pick<RulesTreeNode, 'kind' | 'isLibrary'>): IconName {
  if (node.kind === 'pipeline') return node.isLibrary ? 'pipelineLibrary' : 'pipeline'
  if (node.kind === 'condition') return node.isLibrary ? 'conditionLibrary' : 'condition'
  if (node.kind === 'dictionary') return 'dictionary'
  return node.isLibrary ? 'ruleLibrary' : 'rule'
}
