#!/bin/bash

# Carrega variáveis do .env
source .env

# CONFIGURAÇÕES
GITHUB_USER="waltemarcarneiro"
REPO_NAME="waltemarcarneiro.github.io"
BRANCH="main"
TOKEN="$GITHUB_TOKEN"

# Mensagem de commit
COMMIT_MSG=${1:-"Atualização automática"}

# Configura o Git
git config user.name "$GITHUB_USER"
git config user.email "$GITHUB_USER@users.noreply.github.com"

# Inicializa o repositório se ainda não tiver .git
if [ ! -d .git ]; then
    git init
    git remote add origin https://$GITHUB_USER:$TOKEN@github.com/$GITHUB_USER/$REPO_NAME.git
fi

# Add, commit e push
git add .

if git diff --cached --quiet; then
    echo "Nenhuma mudança para commitar."
else
    git commit -m "$COMMIT_MSG"
    git push https://$GITHUB_USER:$TOKEN@github.com/$GITHUB_USER/$REPO_NAME.git $BRANCH
fi