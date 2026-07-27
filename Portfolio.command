#!/bin/bash
# Double-clic → lance le portfolio (Astro, navigateur).
# Fermer cette fenêtre ou Ctrl-C arrête le serveur.
# Le lanceur vit DANS le projet : chemin relatif, il suit si le dossier est déplacé.
PROJ="$(cd "$(dirname "$0")" && pwd)"

# Un .command lancé depuis le Finder n'hérite PAS du PATH du shell (~/.zshrc non lu).
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"

cd "$PROJ" || { echo "✗ Projet introuvable : $PROJ"; read -r -p "Entrée pour fermer…"; exit 1; }

if ! command -v npm >/dev/null 2>&1; then
  echo "✗ npm introuvable. Installe Node.js (brew install node) puis relance."
  read -r -p "Entrée pour fermer…"; exit 1
fi

printf '\n  Portfolio Yuno15 — Astro\n\n'

if [ ! -d node_modules ]; then
  echo "→ première fois : installation des dépendances…"
  npm install || { echo "✗ npm install a échoué."; read -r -p "Entrée pour fermer…"; exit 1; }
fi

echo "→ démarrage du serveur, le navigateur va s'ouvrir…"
echo
exec npm run dev -- --open
