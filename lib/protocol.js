'use strict';

const { Writable } = require( 'stream' );
const { Packet, PacketHeader } = require( './packet.js' );

class Protocol extends Writable {
    constructor() {
        super();
        this.buffer = Buffer.alloc( 0 );
        this.currentPacketHeader = null;
    }

    readPacketHeader() {
        const id = this.buffer.readUInt16LE( PacketHeader.PACKET_ID_OFFSET );
        const length = this.buffer.readUInt16LE( PacketHeader.PACKET_LENGTH_OFFSET );

        return new PacketHeader( id, length );
    }

    readPacketBody() {
        return this.buffer.slice( PacketHeader.LENGTH, PacketHeader.LENGTH + this.currentPacketHeader.length );
    }

    truncateBuffer() {
        this.buffer = this.buffer.slice( PacketHeader.LENGTH + this.currentPacketHeader.length );
    }

    _write( chunk, encoding, done ) {
        const buffer = Buffer.isBuffer( chunk ) ? chunk : Buffer.from( chunk, encoding );
        this.buffer = Buffer.concat( [this.buffer, buffer] );

        while( true ) {
            if( this.buffer.length < PacketHeader.LENGTH ) break;
            if( !this.currentPacketHeader ) this.currentPacketHeader = this.readPacketHeader();
            if( this.buffer.length < PacketHeader.LENGTH + this.currentPacketHeader.length ) break;
            const packet = new Packet( this.currentPacketHeader, this.readPacketBody().toString() );
            this.truncateBuffer();
            this.currentPacketHeader = null;
            setImmediate( () => this.emit( 'packet', packet ) );
        }

        done();
    }
}

module.exports = Protocol;