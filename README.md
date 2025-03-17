# TODO LIST REACT + NODEJS

> ## Instalacion frontend ⚙

#### Clonar repositorio

      git clone https://github.com/Agustin15/TodosList.git

#### Navegar hasta frontend:

      cd frontend

#### Instalar dependencias:

      npm install

> #### Iniciar la aplicacion

          npm run dev

          http://localhost:PORT/

- Ya podra acceder ingresando la url en su navegador

**_Dependencias:_**

- react
- react-dom
- react-spinners
- react-router
- react-chartjs-2
- chartjs-plugin-datalabels

**_Configuracion del archivo .env_**

    VITE_LOCALHOST_FRONT=http://localhost:PORT/
    VITE_LOCALHOST_BACK=http://localhost:PORT/
    
> ## Instalacion backend ⚙

**_Dirigirse a a la carpeta backEnd:_**

    cd backEnd

**_Instalar dependencias:_**

    npm install

**_Dependencias:_**

- express
- nodemon
- mongoose
- nodemail
- dotenv

**_Configuracion del archivo .env_**

    PORT=3000
    DATABASE_URL=mongodb+srv://<userDB>:<passwordDB>@cluster0.u5vpn.mongodb.net/<databaseName>?retryWrites=true&w=majority&appName=Cluster0
    JWT_SECRET_KEY=###
    JWT_SECRET_KEY_REFRESH=###
    USER_MAIL=###
    PASSWORD_APP_MAIL=###

> ## Iniciar ▶

**_Iniciar localhost watch live con nodemon_**

    npm run dev

**_Para iniciar localhost pero sin watch live con node_**

    npm run start