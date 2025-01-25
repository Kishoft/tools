# Plataforma completa
## Primera configuración
### Modificar el archivo host de linux
1. Abrir el siguiente archivo con un editor de texto
```
/etc/hosts
```
2. Agregar lo siguiente
```
(ip de la pc)   app.swarow.com
(ip de la pc)   api.swarow.com
(ip de la pc)   registry.swarow.com
```
### Hacer los certificados
1. Instalar dependencias
```
sudo apt install wget libnss3-tools
```
2. Descargar mkcert
3. Darle permisos de ejecución
```
chmod +x mkcert
```
4. Moverlo para que pueda llamarse por consola
```
sudo mv mkcert /usr/local/bin
```
5. Instalar la CA usando mkcert
```
mkcert -install
```
6. Emitir certificados
```
mkcert app.swarow.com api.swarow.com registry.swarow.com localhost
```
7. Guardarlos en la carpeta "certs" del proyecto
### Servicio "Swarm"
Desplegar el servicio, contiene registry y herramientas de gestión de swarm con swarm-config.yml
## Despliegue de servicios sobre la plataforma
### Servicio "Mongo" y "Redis"
#### Servidores
Primero hacer el deploy del servicio de Mongo y Redis
#### Configuración MongoDB
1. Entrar mediante "docker exec -it (id del container) sh" al contenedor de cfg server 1
2. Tipear "mongo"
3. Pegar lo siguiente
```
rs.initiate(
  {
    _id: "cfgrs",
    configsvr: true,
    members: [
      { _id : 0, host : "cfgsvr1:27017" },
      { _id : 1, host : "cfgsvr2:27017" },
      { _id : 2, host : "cfgsvr3:27017" }
    ]
  }
)
```
4. Luego lo mismo que en el paso 1,2 y 3 pero con el servidor 1 del primer shard
```
rs.initiate(
  {
    _id: "shard1rs",
    members: [
      { _id : 0, host : "shard1svr1:27017" },
      { _id : 1, host : "shard1svr2:27017" },
      { _id : 2, host : "shard1svr3:27017" }
    ]
  }
)
```
5. Luego lo mismo que en el paso 1, 2 y 3 pero con el servidor 1 del segundo shard
```
rs.initiate(
  {
    _id: "shard2rs",
    members: [
      { _id : 0, host : "shard2svr1:27017" },
      { _id : 1, host : "shard2svr2:27017" },
      { _id : 2, host : "shard2svr3:27017" }
    ]
  }
)
```
6. Luego lo mismo que en el paso 1, 2 y 3 pero con el "mongos" o mongo router (acá son 2 comandos)
```
sh.addShard("shard1rs/shard1svr1:27017,shard1svr2:27017,shard1svr3:27017")
```
```
sh.addShard("shard2rs/shard2svr1:27017,shard2svr2:27017,shard2svr3:27017")
```
7. En la carpeta de MongoDB, ejecutar el archivo "configurar.js" y "datos.js" para configurar la estructura de la db y datos de prueba
8. Pendiente (configurar las zonas de sharding)
### Servicio "Proxy"
#### Verificar
Nombres de los certificados, rutas y servidores
### Servicio "API"
#### Registry
En la carpeta api, hacer "docker-compose build --parallel && docker-compose push"
#### Servicio
Luego hacer el deploy del servicio levantando el api.yml