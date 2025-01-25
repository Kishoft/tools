## Set up Sharding using Docker Containers

### Config servers
Start config servers (3 member replica set)
```
docker-compose -f config-server/docker-compose.yaml up -d
```
Initiate replica set
```
mongo mongodb://192.168.1.81:40001
```
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

rs.status()
```

### Shard 1 servers
Start shard 1 servers (3 member replicas set)
```
docker-compose -f shard1/docker-compose.yaml up -d
```
Initiate replica set
```
mongo mongodb://192.168.1.81:50001
```
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

rs.status()
```

### Shard 2 servers
Start shard 2 servers (3 member replicas set)
```
docker-compose -f shard2/docker-compose.yaml up -d
```
Initiate replica set
```
mongo mongodb://192.168.1.81:50004
```
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

rs.status()
```

### Mongos Router
Start mongos query router
```
docker-compose -f mongos/docker-compose.yaml up -d
```

### Add shards to the cluster
Connect to mongos
```
mongo mongodb://192.168.1.81:60000
```
Add shard
```
sh.addShard("shard1rs/shard1svr1:27017,shard1svr2:27017,shard1svr3:27017")
sh.addShard("shard2rs/shard2svr1:27017,shard2svr2:27017,shard2svr3:27017")
sh.status()
```
### Disable Read Hedging Mode
db.adminCommand({ setParameter: 1, readHedgingMode: "off" })
### Config database and collections
Stay connected to mongos
```
sh.enableSharding('sisma')
```
sh.shardCollection("sisma.notificaciones", { servidor : 1, entidad : 1, _id : 1 })
sh.shardCollection("sisma.historial", { servidor : 1, entidad : 1, _id : 1 })
sh.shardCollection("sisma.productos", { servidor : 1, entidad : 1, _id : 1 })
sh.shardCollection("sisma.clientes", { servidor : 1, entidad : 1, _id : 1 })
sh.shardCollection("sisma.proveedores", { servidor : 1, entidad : 1, _id : 1 })
sh.shardCollection("sisma.lugares", { servidor : 1, entidad : 1, _id : 1 })
sh.shardCollection("sisma.sectores", { servidor : 1, entidad : 1, _id : 1 })
sh.shardCollection("sisma.listasDePrecios", { servidor : 1, entidad : 1, _id : 1 })
sh.shardCollection("sisma.facturas", { servidor : 1, entidad : 1, _id : 1 })
sh.shardCollection("sisma.facturasTerminadas", { servidor : 1, entidad : 1, _id : 1 })
sh.shardCollection("sisma.ultimoUpdateDeColeccion", { servidor : 1, entidad : 1, _id : 1 })
```
sh.addShardToZone("shard1rs", "S1")
sh.addShardToZone("shard2rs", "S2")
```
sh.updateZoneKeyRange("sisma.productos", { servidor : 1, entidad: MinKey, _id : MinKey }, { servidor : 1, entidad: MaxKey, _id : MaxKey }, "S1")
sh.updateZoneKeyRange("sisma.productos", { servidor : 2, entidad: MinKey, _id : MinKey }, { servidor : 2, entidad: MaxKey, _id : MaxKey }, "S2")