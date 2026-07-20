@echo off
cd /d D:\健身房小程序\gym\gym-backend
java -Dserver.port=8080 -Dserver.address=0.0.0.0 -jar target\gym-backend-1.0.0.jar
