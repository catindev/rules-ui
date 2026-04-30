import pipelineIcon from '../../../assets/icons/icon-pipeline.svg'
import ruleIcon from '../../../assets/icons/icon-rule.svg'
import conditionIcon from '../../../assets/icons/icon-condition.svg'
import dictionaryIcon from '../../../assets/icons/big-dictionary.svg'

const iconMap = {
  pipeline: pipelineIcon,
  pipelineLibrary: pipelineIcon,
  rule: ruleIcon,
  ruleLibrary: ruleIcon,
  condition: conditionIcon,
  conditionLibrary: conditionIcon,
  dictionary: dictionaryIcon,
}

export type IconName = keyof typeof iconMap

type IconProps = {
  name: IconName
  className?: string
}

export function Icon({ name, className }: IconProps) {
  return (
    <img
      alt=""
      aria-hidden="true"
      className={className || 'rules-icon'}
      src={iconMap[name]}
    />
  )
}
