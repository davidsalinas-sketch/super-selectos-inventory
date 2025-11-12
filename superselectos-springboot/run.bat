@echo off
cd /d "C:\Users\david\super2\superselectos-springboot"
set JAVA_HOME=C:\Program Files\Java\jdk-17
set PATH=%JAVA_HOME%\bin;%PATH%

echo Iniciando Super Selectos Inventory System...
echo ==========================================

java -cp "target/classes;C:/Users/david/.m2/repository/org/springframework/boot/spring-boot-starter-web/3.1.5/*;C:/Users/david/.m2/repository/org/springframework/boot/spring-boot-starter-data-jpa/3.1.5/*;C:/Users/david/.m2/repository/org/springframework/boot/spring-boot-starter-security/3.1.5/*;C:/Users/david/.m2/repository/org/springframework/boot/spring-boot-starter-thymeleaf/3.1.5/*;C:/Users/david/.m2/repository/com/h2database/h2/2.2.224/*" com.superselectos.inventory.SuperSelectosInventoryApplication

pause