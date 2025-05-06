-@echo off
echo Adicionando alterações...
git add .

echo Digite a mensagem do commit:
set /p commit_msg=

git commit -m "%commit_msg%"
git push origin main

echo Deploy realizado com sucesso!
pause
