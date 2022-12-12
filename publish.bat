@echo off

SET OUTPUT_FOLDER="..\bcpserver-autodoc-release\BCPServer"

cls
echo [92m[***********************************************************************][0m
echo [92m[                    BCP-SERVER \ AUTODOC PUBLISHING][0m
echo [92m[***********************************************************************][0m
echo:
echo:
echo [92m[FOLDER OUTPUT: %OUTPUT_FOLDER%][0m
echo:
echo:
echo [92m[1. Cleaning the output folder...][0m
rmdir /s /q %OUTPUT_FOLDER%;
del /S /Q .\wwwroot\*
echo [92m[DONE][0m

echo:
echo:
echo [92m[2. Building clientApp with npm [mode=production]...][0m
cd ./clientApp
call npm run build -- --mode=production --devtool=source-map
cd ..
timeout 5 > NUL
echo [92m[DONE][0m

echo:
echo:
echo [92m[3. Cleaning solution...][0m
dotnet clean BCPServer.csproj
echo [92m[DONE][0m

echo:
echo:
echo [92m[4. Publishing the solution to output folder...][0m
dotnet publish BCPServer.csproj -o %OUTPUT_FOLDER% -r win-x64 -p:PublishSingleFile=true -p:IncludeNativeLibrariesForSelfExtract=true -p:MODE_WEBPACK=PRODUCTION --self-contained true

echo:
echo [92m[Project was publish!.][0m
echo [92m[FOLDER OUTPUT: %OUTPUT_FOLDER%][0m
pause >nul