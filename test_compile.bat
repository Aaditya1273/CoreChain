@echo off
echo Testing Hardhat compilation...
npx hardhat compile
echo Compilation finished with exit code: %ERRORLEVEL%
if exist artifacts (
    echo SUCCESS: Artifacts directory created
) else (
    echo WARNING: No artifacts directory found
)
