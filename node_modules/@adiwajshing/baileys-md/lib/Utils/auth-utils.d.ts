import { proto } from '../../WAProto';
import type { SignalKeyStore, AuthenticationCreds, KeyPair, LTHashState, AuthenticationState } from "../Types";
export declare const initInMemoryKeyStore: ({ preKeys, sessions, senderKeys, appStateSyncKeys, appStateVersions }: {
    preKeys?: {
        [k: number]: KeyPair;
    };
    sessions?: {
        [k: string]: any;
    };
    senderKeys?: {
        [k: string]: any;
    };
    appStateSyncKeys?: {
        [k: string]: proto.IAppStateSyncKeyData;
    };
    appStateVersions?: {
        [k: string]: LTHashState;
    };
}, save: (data: any) => void) => SignalKeyStore;
export declare const initAuthCreds: () => AuthenticationCreds;
/** stores the full authentication state in a single JSON file */
export declare const useSingleFileAuthState: (filename: string) => {
    state: AuthenticationState;
    saveState: () => void;
};
