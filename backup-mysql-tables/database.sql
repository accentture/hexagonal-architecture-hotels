
CREATE TABLE hotels(
    id          int(255) auto_increment not null,
    name        varchar(100) not null,
    address     varchar(100) not null,
    state       boolean not null default 1,
    createdAt   timestamp not null default CURRENT_TIMESTAMP,
    updatedAt   timestamp not null default CURRENT_TIMESTAMP,
    
    CONSTRAINT  pk_hotels PRIMARY KEY(id)
)ENGINE=InnoDb;



CREATE TABLE users(
    id              int(255) auto_increment not null,
    names           varchar(100) not null,
    firstSurname    varchar(100) not null,
    secondSurname   varchar(100) not null,
    username        varchar(100) not null,
    cellphone       varchar(100) not null,
    email           varchar(100) not null,

    createdAt       timestamp not null default CURRENT_TIMESTAMP,
    updatedAt       timestamp not null default CURRENT_TIMESTAMP,
    
    CONSTRAINT      pk_users PRIMARY KEY(id)
)ENGINE=InnoDb;

UPDATE users SET state=1 WHERE id=1; 