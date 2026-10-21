@echo off
cd /d "%~dp0"
echo Dang day thay doi len GitHub...
echo.
git add -A -- . ":(exclude)CAP-NHAT-WEB.bat"
git commit -m "Cap nhat web %date% %time%"
git push origin master
echo.
if %errorlevel%==0 (echo XONG! Doi khoang 1 phut roi tai lai espro-omega.vercel.app) else (echo CO LOI - chup man hinh nay gui Claude)
pause
