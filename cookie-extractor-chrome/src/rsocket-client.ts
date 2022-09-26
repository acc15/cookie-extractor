import { encodeCompositeMetadata, encodeRoute, WellKnownMimeType } from "rsocket-composite-metadata";
import { RSocket, RSocketConnector } from "rsocket-core";
import { WebsocketClientTransport } from "rsocket-websocket-client";

function createRouteMetadata(route?: string): Buffer | undefined {
    if (!route) {
        return undefined;
    }
    return encodeCompositeMetadata([[WellKnownMimeType.MESSAGE_RSOCKET_ROUTING, encodeRoute(route)]]);
}

function createJsonMessage(json: any): Buffer {
    return Buffer.from(JSON.stringify(json));
}

export default class RSocketClient {

    private socket?: RSocket;

    async connect(url: string): Promise<void> {
        if (this.socket) {
            this.socket.close();
        }
        
        const connector = new RSocketConnector({
            setup: {
                metadataMimeType: WellKnownMimeType.MESSAGE_RSOCKET_COMPOSITE_METADATA.string,
                dataMimeType: WellKnownMimeType.APPLICATION_JSON.string,
            },
            transport: new WebsocketClientTransport({ url })
        });
        this.socket = await connector.connect();
        this.socket.onClose((e) => {
            console.info(`Connection to ${url} has been closed`, e);
            this.socket = undefined;
        })
    }
    
    async fireAndForget(message: any, route?: string): Promise<void> {
        const socket = this.socket;
        if (socket === undefined) {
            throw new Error("Socket not connected");
        }
        return new Promise<void>((onComplete, onError) => socket.fireAndForget(
            { data: createJsonMessage(message), metadata: createRouteMetadata(route) }, 
            { onComplete, onError }
        ));
    }

}
