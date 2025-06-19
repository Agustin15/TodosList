# TODOLIST <img src="https://i.postimg.cc/Gmm9k3Vv/logo.png" width="43px">

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
- [react-dom]("https://www.npmjs.com/package/react-dom")
- react-spinners
- react-router
- canvasjs/react-charts 
- react-doc-viewer
- fullcalendar/react
- fullcalendar/core
- fullcalendar/daygrid
- fullcalendar/timegrid
- fullcalendar/interaction
- fullcalendar/multimonth
- styled-components
- sweetalert2
  

**_Configuracion del proxy, archivo vite.config:_**

     server: {
    proxy: {
      "/api": {
        target: "http://localhost:PORT",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "")
      }
    }
  }

**_Configuracion del archivo .env_**

    VITE_LOCALHOST_FRONT=http://localhost:PORT/
    VITE_APPLICATION_SERVER=<MyVapidPublicKeyGenerate https://vapidkeys.com/>
    
> ## Instalacion backend ⚙

**_Dirigirse a a la carpeta backEnd:_**

    cd backEnd

**_Instalar dependencias:_**

    npm install

**_Dependencias:_**

- express
- nodemon
- nodemail
- cookie-parser
- bcrypt
- multer
- dotenv
- mysql2
- webpush
- bullmq

**_Configuracion del archivo .env_**

    PORT=<My Port of Backend>
    DATABASE_HOST=<My Localhost Database>
    DATABASE_NAME=<My Database Name>
    DATABASE_USER=<My Database User>
    DATABASE_PASSWORD=<My Password Database>
    JWT_SECRET_KEY=<My JWT Secret Key>
    JWT_SECRET_KEY_REFRESH=<My JWT Secret Key>
    USER_MAIL=<My Mail From Send Email With Nodemail>
    PASSWORD_APP_MAIL=<My Password App Mail>
    PORT_REDIS=<My Port of Redis server>
    VAPID_PRIVATE_KEY=<My Vapid Private Key Generate in https://vapidkeys.com/>
    VAPID_PUBLIC_KEY=<Same My Vapid Public Key of Frontend env>
    MAILTO_EMAIL_NOTFICATION_SERVER=<My MailtoEmail in https://vapidkeys.com/ >

> ## Iniciar ▶

**_Iniciar localhost watch live con nodemon_**

    npm run dev

**_Para iniciar localhost pero sin watch live con node_**

    npm run start

### Login
![Login](capturesApp/login.PNG)

### Dashboard
![Dashboard](capturesApp/dashboard.PNG)

### List tasks filtered

![List tasks filtered](capturesApp/list%20tasks.PNG)

### Calendar 

![Calendar](capturesApp/calendar.PNG)

### Details task 

![Details task](capturesApp/detailsTask.PNG)


