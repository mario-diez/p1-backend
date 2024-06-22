// Conexión a la base de datos
db = db.getSiblingDB('test');

// Crear la colección si no existe
if (!db.mycollection) {
    print('Creando la colección "mycollection" en la base de datos "mydatabase".');
    db.createCollection('mycollection');
}else{
    print('La colección "mycollection" ya existe en la base de datos "mydatabase".');
}

db.createCollection('users');
db.createCollection('QRs');

db.users.insertMany([
    {
        "name": "admin",
        "email": "admin",
        "role": "ADMIN",
        "password": "$2a$10$DwXUf.kvGUtfu5c3kFTHfOfPdLoDXtyuu/VfJxGVTm9iO3ndaMJ3C"
    },
  ]);


// Confirmar que la colección y los documentos fueron creados
print('Colección y documentos iniciales creados en la base de datos "mydatabase".');
