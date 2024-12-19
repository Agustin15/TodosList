# TODO LIST REACT + NODEJS

> ## Instalacion frontend ⚙ 

#### Clonar repositorio 

      git clone https://github.com/Agustin15/TodosList.git
 
 #### Navegar hasta frontend:
 
      cd frontend          

#### Instalar dependencias:

      npm install

 > #### Extra: Instalacion JSON-SERVER
 
       npm install -g json-server

 -  Crear archivo dbTask.json
  
 - Navegar hasta la carpeta backend

    cd backend  
  
 - Levantar el servidor json-web server

     json-web server --watch dbTask.json
             
 -  Editar dbTaks.json y crear el arreglo ***todos***  :
   
         {"todos":[{<task>}]}

         //Podras cambiar el nombre del documento, pero tendras que modificar los endpoints de las solicitudes 
    
   > #### Iniciar la aplicacion

          npm run dev 
    
          http://localhost:PORT/
      
   - Ya podra acceder ingresando la url en su navegador
  
 

> # Instalacion backend ⚙
             
***Dirigirse a a la carpeta backEnd:***

    cd backEnd
 
***Instalar dependencias:***

    npm install

***Dependencias:***

 - express

 - nodemon
    
 - mongoose

 - dotenv

***Configuracion del archivo .env***

    PORT=3000
    DATABASE_URL=mongodb+srv://<userDB>:<passwordDB>@cluster0.u5vpn.mongodb.net/<databaseName>?retryWrites=true&w=majority&appName=Cluster0


> ## Iniciar ▶   

***Iniciar localhost watch live con nodemon***

    npm run dev 

***Para iniciar localhost pero sin watch live con node***

    npm run start 
      
## Funcionamiento en POSTMAN 🕹
   
- Abrir Postman e importar ***todo_list CRUD.postman_collection***

- Tendra las requests para realizar al backend
