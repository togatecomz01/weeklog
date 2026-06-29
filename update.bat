@echo off
echo [1/6] Git pull...
git pull

echo [2/6] Install root packages...
call npm install

echo [3/6] Install server packages...
cd server
call npm install
cd ..

echo [4/6] Build frontend...
call npm run build

echo [5/6] Build server...
cd server
call npm run build
cd ..

echo [6/6] Restart server...
call pm2 restart weeklog

echo.
echo Done!
pause
