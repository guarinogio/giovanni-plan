#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

if [ ! -f "$ROOT_DIR/vite.config.js" ]; then
  echo "No se encontró vite.config.js en este directorio. Ejecuta este script desde la raíz del proyecto."
  exit 1
fi

FILES_TO_DELETE=(
  "src/pages/PlanPage.jsx"
  "src/pages/SessionPage.jsx"
  "src/pages/MobilePlanGiovanni.jsx"
  "src/state/PlanStore.jsx"
  "src/plan/PlanText.jsx"
  "src/components/cards/HeavyLiftCard.jsx"
  "src/components/cards/AccessoryCard.jsx"
  "src/components/cards/AccessoryPairCard.jsx"
  "src/components/cards/DoubleProgCard.jsx"
  "src/components/timer/RestTimer.jsx"
  "src/components/timer/RestTimerControl.jsx"
  "src/components/Stepper.jsx"
  "src/components/layout/Header.jsx"
  "src/App.css"
)

DIRS_TO_DELETE=(
  "dev-dist"
)

echo "Borrando archivos obsoletos..."
for f in "${FILES_TO_DELETE[@]}"; do
  if [ -f "$ROOT_DIR/$f" ]; then
    rm -f "$ROOT_DIR/$f"
    echo "✓ $f"
  else
    echo "- (no existe) $f"
  fi
done

echo "Borrando directorios obsoletos..."
for d in "${DIRS_TO_DELETE[@]}"; do
  if [ -d "$ROOT_DIR/$d" ]; then
    rm -rf "$ROOT_DIR/$d"
    echo "✓ $d"
  else
    echo "- (no existe) $d"
  fi
done

echo "Limpieza completada."
