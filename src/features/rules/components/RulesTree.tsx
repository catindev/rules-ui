import { Link } from "react-router-dom";
import { useState } from "react";
import type { RulesTreeNode } from "../types";
import { cn } from "../../../shared/lib/cn";
import { Icon } from "./Icon";
import { ConditionInlineBlock } from "./ConditionBlock";
import { artifactIconName, artifactUrl } from "./artifactDisplay";

function levelClass(level?: string | null) {
  if (!level) return "";
  return `rules-level--${level.toLowerCase()}`;
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={cn("rules-tree__chevron", open && "rules-tree__chevron--open")}
      viewBox="0 0 16 16"
      aria-hidden="true"
    >
      <path d="M6 3.75 10.25 8 6 12.25" />
    </svg>
  );
}

function RuleDetails({ node }: { node: RulesTreeNode }) {
  const fields = node.presentation?.fields || [];
  return (
    <div className="rules-tree__details">
      {fields.map((field) => (
        <span key={field.field} className="rules-kv">
          <span>поле</span>
          <code title={field.field}>{field.title}</code>
        </span>
      ))}
      {node.operator ? (
        <span className="rules-kv">
          <span>оператор</span>
          <code>{node.operatorTitle || node.operator}</code>
        </span>
      ) : null}
      {node.dictionaryId ? (
        <span className="rules-kv">
          <span>справочник</span>
          <code>{node.dictionaryTitle || node.dictionaryId}</code>
        </span>
      ) : null}
    </div>
  );
}

function TreeNode({
  node,
  depth,
  isRoot = false,
}: {
  node: RulesTreeNode;
  depth: number;
  isRoot?: boolean;
}) {
  const hasChildren = Boolean(node.steps?.length);
  const [open, setOpen] = useState(isRoot);
  const link = artifactUrl(node.artifactId);

  if (node.kind === "condition") {
    return (
      <li className="rules-tree__item rules-tree__item--condition">
        <ConditionInlineBlock node={node} />
      </li>
    );
  }

  if (node.kind === "rule" || node.kind === "dictionary" || node.missing) {
    return (
      <li className={cn("rules-tree__item", `rules-tree__item--${node.kind}`)}>
        <Link className="rules-tree__row rules-tree__row--leaf" to={link}>
          <Icon name={artifactIconName(node)} className="rules-tree__icon" />
          <span className="rules-tree__main">
            <span className="rules-tree__title">{node.title}</span>
            <span className="rules-tree__id">{node.artifactId}</span>
            {node.kind === "rule" ? <RuleDetails node={node} /> : null}
          </span>
          {node.level ? (
            <span className={cn("rules-level", levelClass(node.level))}>
              {node.level}
            </span>
          ) : null}
        </Link>
      </li>
    );
  }

  return (
    <li
      className={cn(
        "rules-tree__item",
        `rules-tree__item--${node.kind}`,
        open && "rules-tree__item--open",
      )}
    >
      <div className="rules-tree__row">
        <button
          className="rules-tree__toggle"
          type="button"
          onClick={() => setOpen((current) => !current)}
          aria-expanded={open}
          disabled={!hasChildren}
        >
          {hasChildren ? <ChevronIcon open={open} /> : null}
        </button>
        <Icon name={artifactIconName(node)} className="rules-tree__icon" />
        <Link className="rules-tree__main" to={link}>
          <span className="rules-tree__title">{node.title}</span>
          <span className="rules-tree__id">{node.artifactId}</span>
        </Link>
        {node.strict ? (
          <span className="rules-badge rules-badge--danger">strict</span>
        ) : null}
        {node.ref ? <span className="rules-badge">ref</span> : null}
      </div>
      {open && hasChildren ? (
        <ul className="rules-tree rules-tree--nested">
          {node.steps?.map((child, index) => (
            <TreeNode
              key={`${child.kind}-${child.artifactId}-${depth}-${index}`}
              node={child}
              depth={depth + 1}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function RulesTree({
  root,
  showRoot = true,
}: {
  root: RulesTreeNode;
  showRoot?: boolean;
}) {
  const nodes = showRoot ? [root] : root.steps || [];

  return (
    <ul className="rules-tree">
      {nodes.map((node, index) => (
        <TreeNode
          key={`${node.kind}-${node.artifactId}-${index}`}
          node={node}
          depth={0}
          isRoot={showRoot && index === 0}
        />
      ))}
    </ul>
  );
}
