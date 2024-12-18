# TODO LIST REACT + VITE 

> ## Instalacion ⚙ 

#### Crear proyecto con [VITE](https://vite.dev/guide/) 

       npm create vite@latest "nameProject"
 
 - Seleccionar react como framework
 
 - Seleccionar variante Javascript
 
 #### Instalar dependencias:
 
          npm install

 > #### Extra: Instalacion JSON-SERVER
 
           ⁠npm install -g json-server

 -  Crear archivo dbTask.json
  
 -  ***cd <rutadbTaks.json>*** y levantar el localhost JSON con ***json-server --watch dbTask.json***

 -  Editar dbTaks.json y crear el arreglo ***todos***  :
   
         {"todos":[{<task>}]}

         //Podras cambiar el nombre del documento, pero tendras que modificar los endpoints de las solicitudes 
    
   > #### Iniciar la aplicacion

          npm run dev 
    
          http://localhost:PORT/
      
   - Ya podra acceder ingresando la url en su navegador
  
 
 


