# Security Model

## RPC

RPC communication uses TLS (HTTPS). A new certificate is generated each time the
service is started.


Client & Server sign requests & responses using ed25519 keys.  The first request
a client makes to the server must be a public key exchange request.


Client & server keep track of the sequence number of messages sent & received.
The sequence is part of the message envelope & not the payload, so sequence
tampering will not be detected by signature verification.
