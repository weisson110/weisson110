@echo off
echo Installing dependencies...
call npm install
echo Building...
call npm run build
echo Starting at http://localhost:3000
call npm start
pause
