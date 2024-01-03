# Descripción

Este es un desarrollo de un E-commers para practicar y aprender next-14 y todo el flujo que lleva la creación del mismo proyecto

## Correr en dev

1. Clonar el repositorio.
2. Crear una copia del ```.env.tamplate``` y renombrarlo a ```.env``` y cambiar las variables de entorno.
3. Instalar las dependencias ```npm install```
4. Levantar la base de datos  ```docker compose up -d```
5. correr las migraciones de Prisma ```npx prisma migrate dev```
6 Ejecutar seed ```npm run seed```
6. Correr el proyecto ```npm run dev```
