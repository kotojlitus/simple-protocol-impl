'use strict';

const Protocol = require( './protocol.js' );
const EventEmitter = require( 'events' ).EventEmitter;

class Connection extends EventEmitter {
    constructor( stream ) {
        super();
        this.stream = stream;

        this.stream.on( 'close', () => this.emit( 'close', this ) );
        this.stream.on( 'error', err => this.emit( 'error', err ) );

        this.protocol = new Protocol();
        this.protocol.on( 'packet', packet => this.emit( 'packet', packet ) );

        this.stream.pipe( this.protocol );
    }
}

module.exports = Connection;