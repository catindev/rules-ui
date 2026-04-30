import { Link, useLocation } from "react-router-dom";
import { isLocalMode } from "../lib/mode";
import { ServerControl } from "./ServerControl";

type AppToolbarProps = {
  onServerChange: (value: string) => void;
};

function sectionLabel(pathname: string) {
  if (pathname.includes("/artifacts/")) return "Артефакт";
  if (pathname.includes("/scenarios/") && pathname.endsWith("/playground"))
    return "Проверка";
  if (pathname.includes("/scenarios/")) return "Сценарий";
  return "Сценарии";
}

export function AppToolbar({ onServerChange }: AppToolbarProps) {
  const { pathname } = useLocation();

  return (
    <header className="app-toolbar">
      <Link className="app-toolbar__brand" to="/">
        <span className="app-toolbar__brand-mark" aria-hidden="true">
          R
        </span>
        <span className="app-toolbar__brand-text">Движок правил</span>
      </Link>
      <div className="app-toolbar__breadcrumbs" aria-label="Навигация">
        <span className="app-toolbar__crumb">
          Бенефициары номинальных счетов
        </span>
        <span className="app-toolbar__crumb-separator" aria-hidden="true">
          /
        </span>
        <span className="app-toolbar__crumb app-toolbar__crumb--current">
          {sectionLabel(pathname)}
        </span>
      </div>
      <div className="app-toolbar__actions">
        {isLocalMode ? <ServerControl onChange={onServerChange} /> : null}
      </div>
    </header>
  );
}
