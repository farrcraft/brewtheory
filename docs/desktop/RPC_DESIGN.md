# RPC Design

Communication between client & server is done over standard HTTP+TLS.  

Messages are sent over the wire as protobuf encoded data represented as a hex
encoded string.

Requests include an HTTP header with the signature of the message.
The signature is also hex encoded.
The header is named **Request-Signature**.

Requests also include an HTTP header with the rpc method of the message.
The header is named **Request-Method**.

The Server sends headers with the signature & sequence of the response.

The Client in this case is the main Electron process.
It is an intermediary between the server and the Electron renderer process.

There are 3 separate module types in the RPC system:

- RPC transports (`app/transports/rpc/*`)
- IPC transports (`app/transports/ipc/*`)
- Stores (`app/stores/*`)

The actual RPC communication only happens from the main/node process.
These calls are handled by the `transports/rpc/Rpc/Rpc.js` module.

The renderer process (where the React frontend lives) does not directly invoke the RPC calls.
Instead, it makes calls to the IPC transports. The IPC transports dispatch messages which are
listened for by the RPC transports. The RPC transports make the actual RPC call to the backend
and then send a response message back to the IPC transport that dispatched the original message.

The stores connect between the Mobx system and the IPC transports in the renderer process.
Stores are used to hold the data returned via the IPC/RPC pipeline. The data managed by the
stores is what is actually used by the React application.

Stores must interact with the `IPC` layer, but must never attempt to interact
with the `Transport` layer directly.

The API of `Store`, `IPC`, and `Transport` classes of the same type must all
mirror one another. I.e., for the Account type, if the store has a create
method in its API, there must be a create method in the corresponding ipc and
transport classes.

Stores must never be used in the main/node processes. Instead, `Transport`
classes should always be worked with directly, bypassing the `Store` and `IPC`
layers.
