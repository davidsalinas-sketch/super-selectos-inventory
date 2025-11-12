# Super Selectos Inventory System - Startup Script
# =====================================================

Write-Host "=== SUPER SELECTOS INVENTORY SYSTEM ===" -ForegroundColor Green
Write-Host "Iniciando aplicación..." -ForegroundColor Yellow

# Configurar Java
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"

# Cambiar al directorio del proyecto
Set-Location "C:\Users\david\super2\superselectos-springboot"

Write-Host "Directorio actual: $(Get-Location)" -ForegroundColor Cyan
Write-Host "Java configurado: $env:JAVA_HOME" -ForegroundColor Cyan

# Verificar Java
Write-Host "`nVerificando Java..." -ForegroundColor Yellow
& "C:\Program Files\Java\jdk-17\bin\java.exe" -version

Write-Host "`nCreando classpath..." -ForegroundColor Yellow

# Construir classpath manualmente con las dependencias principales
$classpath = @(
    "target\classes"
    "C:\Users\david\.m2\repository\org\springframework\boot\spring-boot\3.1.5\spring-boot-3.1.5.jar"
    "C:\Users\david\.m2\repository\org\springframework\boot\spring-boot-autoconfigure\3.1.5\spring-boot-autoconfigure-3.1.5.jar"
    "C:\Users\david\.m2\repository\org\springframework\spring-core\6.0.13\spring-core-6.0.13.jar"
    "C:\Users\david\.m2\repository\org\springframework\spring-context\6.0.13\spring-context-6.0.13.jar"
    "C:\Users\david\.m2\repository\org\springframework\spring-web\6.0.13\spring-web-6.0.13.jar"
    "C:\Users\david\.m2\repository\org\springframework\spring-webmvc\6.0.13\spring-webmvc-6.0.13.jar"
    "C:\Users\david\.m2\repository\com\h2database\h2\2.2.224\h2-2.2.224.jar"
    "C:\Users\david\.m2\repository\org\slf4j\slf4j-api\2.0.9\slf4j-api-2.0.9.jar"
    "C:\Users\david\.m2\repository\ch\qos\logback\logback-classic\1.4.11\logback-classic-1.4.11.jar"
    "C:\Users\david\.m2\repository\ch\qos\logback\logback-core\1.4.11\logback-core-1.4.11.jar"
) -join ";"

Write-Host "Classpath configurado correctamente" -ForegroundColor Cyan

Write-Host "`n🚀 INICIANDO APLICACIÓN..." -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green

# Ejecutar la aplicación
& "C:\Program Files\Java\jdk-17\bin\java.exe" -cp $classpath com.superselectos.inventory.SuperSelectosInventoryApplication

Write-Host "`n¡Aplicación terminada!" -ForegroundColor Red