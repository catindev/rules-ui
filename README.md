# Rules UI

SPA-инструмент для локальной и стендовой работы с пакетом правил `@processengine/rules`.

## Локальная разработка

```bash
npm install
npm run dev
```

По умолчанию UI обращается к процессору на `http://localhost:3000`. Адрес можно поменять в интерфейсе или через env:

```bash
VITE_PROCESSOR_BASE_URL=http://localhost:3001 npm run dev
```

## Сборка

Локальная сборка:

```bash
npm run build
```

Сборка для встраивания в процессор по `/rules`:

```bash
npm run build:processor
```

Готовый processor-bundle нужно положить в:

```text
{папка с кодом процессора}/rules-ui
```
