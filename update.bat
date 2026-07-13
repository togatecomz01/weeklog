@echo off
echo [1/7] Git pull...
git pull

echo [2/7] Install root packages...
call npm install

echo [3/7] Install server packages...
cd server
call npm install
cd ..

echo [4/7] Build frontend...
call npm run build

echo [5/7] Build server...
cd server
call npm run build
cd ..

echo [6/7] Run migrations...
cd server
call npm run migrate
call npm run seed
cd ..

echo [7/7] Restart server...
call pm2 restart weeklog

echo.
echo Done!
pause
