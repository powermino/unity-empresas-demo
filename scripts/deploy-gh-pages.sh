#!/usr/bin/env sh
# Publica o build de produção no branch gh-pages do repositório "origin".
set -e
# No Git Bash (Windows), impede que "/repo/" vire "C:/Program Files/Git/repo/"
export MSYS_NO_PATHCONV=1
REPO_NAME=$(basename -s .git "$(git remote get-url origin)")
VITE_BASE="/$REPO_NAME/" npx vite build
touch dist/.nojekyll
cd dist
rm -rf .git
git init -q -b gh-pages
git add -A
git -c user.name="$(cd .. && git config user.name)" -c user.email="$(cd .. && git config user.email)" commit -q -m "Deploy $(date -u +%Y-%m-%dT%H:%MZ)"
git push -f -q "$(cd .. && git remote get-url origin)" gh-pages
rm -rf .git
echo "Publicado no branch gh-pages."
