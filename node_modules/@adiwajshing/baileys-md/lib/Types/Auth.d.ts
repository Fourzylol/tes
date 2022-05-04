/// <reference types="node" />
import type { Contact } from "./Contact";
import type { proto } from "../../WAProto";
import type { WAPatchName } from "./Chat";
export declare type KeyPair = {
    public: Uint8Array;
    private: Uint8Array;
};
export declare type SignedKeyPair = {
    keyPair: KeyPair;
    signature: Uint8Array;
    keyId: number;
};
export declare type ProtocolAddress = {
    name: string;
    deviceId: number;
};
export declare type SignalIdentity = {
    identifier: ProtocolAddress;
    identifierKey: Uint8Array;
};
export declare type LTHashState = {
    version: number;
    hash: Buffer;
    indexValueMap: {
        [indexMacBase64: string]: {
            valueMac: Uint8Array | Buffer;
        };
    };
};
export declare type SignalCreds = {
    readonly signedIdentityKey: KeyPair;
    readonly signedPreKey: SignedKeyPair;
    readonly registrationId: number;
};
export declare type AuthenticationCreds = SignalCreds & {
    readonly noiseKey: KeyPair;
    readonly advSecretKey: string;
    me?: Contact;
    account?: proto.IADVSignedDeviceIdentity;
    signalIdentities?: SignalIdentity[];
    myAppStateKeyId?: string;
    firstUnuploadedPreKeyId: number;
    serverHasPreKeys: boolean;
    nextPreKeyId: number;
    lastAccountSyncTimestamp?: number;
};
declare type Awaitable<T> = T | Promise<T>;
export declare type SignalKeyStore = {
    getPreKey: (keyId: number) => Awaitable<KeyPair>;
    setPreKey: (keyId: number, pair: KeyPair | null) => Awaitable<void>;
    getSession: (sessionId: string) => Awaitable<any>;
    setSession: (sessionId: string, item: any | null) => Awaitable<void>;
    getSenderKey: (id: string) => Awaitable<any>;
    setSenderKey: (id: string, item: any | null) => Awaitable<void>;
    getAppStateSyncKey: (id: string) => Awaitable<proto.IAppStateSyncKeyData>;
    setAppStateSyncKey: (id: string, item: proto.IAppStateSyncKeyData | null) => Awaitable<void>;
    getAppStateSyncVersion: (name: WAPatchName) => Awaitable<LTHashState>;
    setAppStateSyncVersion: (id: WAPatchName, item: LTHashState) => Awaitable<void>;
};
export declare type SignalAuthState = {
    creds: SignalCreds;
    keys: SignalKeyStore;
};
export declare type AuthenticationState = {
    creds: AuthenticationCreds;
    keys: SignalKeyStore;
};
export {};
