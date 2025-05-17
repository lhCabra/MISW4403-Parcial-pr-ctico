# MISW4403-Parcial-práctico
Este proyecto corresponde al parcial práctico del curso MISW4403. A continuación, encontrarás las instrucciones para ejecutar la aplicación y correr las pruebas.

### Instrucciones para ejecutar la aplicación
1. Clona el repositorio de manera local
```
git clone https://github.com/lhCabra/MISW4403-Parcial-pr-ctico.git
```

2. Instala las dependencias
```
npm install
```

3. Configura la base de datos PostgreSQL
Verifica que tengas una instancia de PostgreSQL ejecutándose en el puerto 5432 de tu máquina local y crea una base de datos con el nombre aerolineas.
O bien, puedes levantar la base de datos con Docker:
```
docker run --name postgres_aerolineas \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=aerolineas \
  -p 5432:5432 \
  -d postgres
```
4. Inicia la aplicación

```npm run start
```
o para iniciarlo en modo desarrollo
```
npm run start:dev
``` 
### Pruebas unitarias
Para correr las pruebas, en la raiz del proyecto 
```
npm run test:watch
```
Al correrlo evidenciarás lo siguiente: 

<img width="747" alt="image" src="https://github.com/user-attachments/assets/6005f57e-a383-42ee-82e8-1a916c1e93a1" />

### Pruebas Postman
Para correr las pruebas de postman importa las colecciones desde la carpeta collections.

Asegúrate de configurar la variable baseUrl al endpoint donde está corriendo el proyecto, incluyendo /api/v1. Por ejemplo: 
```
http://localhost:3000/api/v1
```

Cada colección incluye los casos de prueba requeridos, junto con ejemplos y tests preconfigurados.

#### Airlines
![image](https://github.com/user-attachments/assets/440b8f8e-d308-4387-ab92-e4548aed38f6)

#### Airports
![image](https://github.com/user-attachments/assets/60ca0d13-bc20-48a5-bf6c-fe2d715dbc4d)

#### Airline-Airports
![image](https://github.com/user-attachments/assets/871eb676-edc6-422c-96fe-4c1e40d81a18)

