'use strict';

const assert = require( 'assert' );
const Protocol = require( '../lib/protocol.js' );

function toPacket( ...values ) {
    values = values.map( function( value ) {
        value = Buffer.from( value );
        const buf = Buffer.allocUnsafe( value.length + 4 );
        buf.writeUInt16LE( 1, 0 );
        buf.writeUInt16LE( value.length, 2 );
        value.copy( buf, 4 );
        return buf;
    });
    return Buffer.concat( values );
}

function* ignoreCallbackCount( count, callback ) {
    while( count-- ) yield;
    while( true ) yield callback();
}

describe( 'Protocol', function() {

    const protocol = new Protocol();

    beforeEach( function() {
        protocol.removeAllListeners( 'packet' );
    });

    it( 'should emit packet once', function( done ) {
        protocol.write( toPacket( 'TEST' ) );
        protocol.on( 'packet', () => done() );
    });

    it( 'should emit packet twice', function( done ) {
        protocol.write( toPacket( 'TEST1', 'TEST2' ) );
        done = ignoreCallbackCount( 1, done );
        protocol.on( 'packet', () => done.next() );
    });

    it( 'should emit same data', function( done ) {
        protocol.write( toPacket( 'TEST' ) );
        protocol.on( 'packet', packet => {
            assert.equal( packet.data, 'TEST' );
            done();
        });
    });

    it( 'should be 3 byte length', function( done ) {
        protocol.write( toPacket( '䌢' ) );
        protocol.on( 'packet', packet => {
            assert.equal( packet.header.length, 3 );
            done();
        });
    });

});