@echo off
echo Installing dependencies...

echo Removing node_modules directory...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json

echo Installing npm packages...
npm install --legacy-peer-deps

echo Installing additional required packages...
npm install autoprefixer postcss tailwindcss --save-dev
npm install next-themes

echo Done! 