@echo off
echo Running sitemap generator...
cd %~dp0
python backend/scheduled_tasks.py
echo Sitemap generation completed.
pause
