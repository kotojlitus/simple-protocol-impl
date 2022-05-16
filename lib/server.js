'use strict';

const net = require( 'net' );
const Connection = require( './connection.js' );
const EventEmitter = require( 'events' ).EventEmitter;

class Server extends EventEmitter {
    constructor() {
        super();
        this._server = net.createServer();

        this.connections = new Set();

        this._server.on( 'listening', () => this.emit( 'listen' ) );
        this._server.on( 'error', err => this.emit( 'error', err ) );
        this._server.on( 'close', () => this.emit( 'close' ) );
        this._server.on( 'connection', this._handleConnection.bind( this ) );
    }

    _handleConnection( socket ) {
        const conn = new Connection( socket );
        this._addConnection( conn );
        conn.on( 'close', this._deleteConnection.bind( this ) );
        this.emit( 'connection', conn );
    }

    _addConnection( connection ) {
        this.connections.add( connection );
    }

    _deleteConnection( connection ) {
        this.connections.delete( connection );
    }

    listen( port, host, callback ) {
        this._server.listen.apply( this._server, arguments );
        return this;
    }

    close( callback ) {
        this._server.close( callback );
    }
}

module.exports = Server;