'use strict';

class PacketHeader {
    constructor( id, length ) {
        this.id = id;
        this.length = length;
    }
}

PacketHeader.LENGTH = 4;
PacketHeader.PACKET_ID_OFFSET = 0;
PacketHeader.PACKET_LENGTH_OFFSET = 2;

class Packet {
    constructor( header, data ) {
        this.header = header;
        this.data = data;
    }
}

module.exports = {
    Packet,
    PacketHeader
};