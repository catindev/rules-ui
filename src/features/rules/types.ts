export type RulesPackage = {
  flowId: string
  flowVersion: string
  artifactSetId: string
  artifactSetVersion: string
  name: string
  description: string
  hasFieldContract: boolean
}

export type RulesDiagnostic = {
  level: 'warning' | 'error'
  code: string
  message: string
  field?: string
  artifactId?: string
}

export type ScenarioSummary = {
  pipelineId: string
  title: string
  description: string
  entrypoint: boolean
  strict: boolean
  flowId: string
  flowVersion: string
  artifactSetId: string
  artifactSetVersion: string
}

export type FieldPresentation = {
  field: string
  title: string
  description: string
  isContext: boolean
}

export type RulePresentation = {
  title: string
  description: string
  role?: string | null
  level?: string | null
  fields?: FieldPresentation[]
  fieldTitle?: string | null
  operatorTitle?: string | null
  operatorDescription?: string | null
  dictionaryTitle?: string | null
}

export type ConditionWhenNode =
  | {
      kind: 'predicate'
      artifactId: string
      title: string
      fieldTitle?: string | null
      operatorTitle?: string | null
      missing?: boolean
    }
  | {
      kind: 'group'
      mode: 'all' | 'any'
      title: string
      children: ConditionWhenNode[]
    }
  | {
      kind: 'unknown'
      title: string
      raw?: unknown
    }

export type RulesTreeNode = {
  kind: 'pipeline' | 'condition' | 'rule' | 'dictionary' | 'missing' | string
  artifactId: string
  title: string
  description?: string
  isLibrary?: boolean
  raw?: unknown
  ref?: boolean
  cycle?: boolean
  missing?: boolean
  role?: string | null
  level?: string | null
  field?: string | null
  fields?: string[]
  fieldTitle?: string | null
  operator?: string | null
  operatorTitle?: string | null
  dictionaryId?: string | null
  dictionaryTitle?: string | null
  code?: string | null
  message?: string | null
  presentation?: RulePresentation
  when?: unknown
  whenTree?: ConditionWhenNode | null
  whenRefs?: string[]
  steps?: RulesTreeNode[]
  entries?: unknown[]
  entrypoint?: boolean
  strict?: boolean
  requiredContext?: string[]
}

export type ScenarioResponse = {
  package: RulesPackage
  scenario: {
    pipelineId: string
    title: string
    description: string
    entrypoint: boolean
    strict: boolean
    requiredContext: string[]
  } | null
  tree: RulesTreeNode
  diagnostics: RulesDiagnostic[]
}

export type ArtifactResponse = {
  package: RulesPackage
  artifact: Record<string, unknown> | null
  node?: RulesTreeNode
  presentation: RulePresentation
  related: {
    dictionaries: Array<{ artifactId: string; title: string }>
    usedBy: Array<{ artifactId: string; kind: string; title: string }>
  }
  diagnostics: RulesDiagnostic[]
}

export type PackagesResponse = {
  packages: RulesPackage[]
  defaultPackage: {
    flowId: string
    flowVersion: string
  }
}

export type ScenariosResponse = {
  package: RulesPackage
  scenarios: ScenarioSummary[]
  diagnostics: RulesDiagnostic[]
}

export type RulesIssue = {
  kind: 'ISSUE'
  level: 'WARNING' | 'ERROR' | 'EXCEPTION'
  code: string
  message: string
  field?: string | null
  ruleId: string
  pipelineId?: string
  expected?: unknown
  actual?: unknown
  meta?: Record<string, unknown>
}

export type RulesTraceEvent = {
  kind: 'TRACE'
  artifactType: string
  artifactId: string | null
  step: string
  at: string
  outcome: string
  details?: Record<string, unknown>
  input?: unknown
  output?: unknown
}

export type EvaluateRulesResult = {
  status: 'OK' | 'OK_WITH_WARNINGS' | 'ERROR' | 'EXCEPTION' | 'ABORT'
  control: 'CONTINUE' | 'STOP'
  issues: RulesIssue[]
  trace?: RulesTraceEvent[]
  error?: { code: string; message: string; details?: Record<string, unknown> | null }
}
