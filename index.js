'use strict';

require( 'dotenv' ).config();

const {
    PORT
} = process.env;

const Server = require( './lib/server.js' );

const server = new Server();

server.listen( PORT, () => console.log( 'ready' ) )
    .on( 'listen', () => console.log( 'listen' ) )
    .on( 'connection', conn => {
        console.log( 'new connection' );
        conn.on( 'packet', packet => console.log( packet ) );
    });