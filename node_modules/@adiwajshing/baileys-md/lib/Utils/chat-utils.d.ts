/// <reference types="node" />
import { WAPatchCreate, ChatMutation, WAPatchName, LTHashState, ChatModification, SignalKeyStore } from "../Types";
import { proto } from '../../WAProto';
import { BinaryNode } from '../WABinary';
export declare const newLTHashState: () => LTHashState;
export declare const encodeSyncdPatch: ({ type, index, syncAction, apiVersion, operation }: WAPatchCreate, myAppStateKeyId: string, state: LTHashState, keys: SignalKeyStore) => Promise<{
    patch: proto.ISyncdPatch;
    state: LTHashState;
}>;
export declare const decodeSyncdMutations: (msgMutations: (proto.ISyncdMutation | proto.ISyncdRecord)[], initialState: LTHashState, getAppStateSyncKey: SignalKeyStore['getAppStateSyncKey'], validateMacs: boolean) => Promise<{
    hash: Buffer;
    indexValueMap: {
        [indexMacBase64: string]: {
            valueMac: Uint8Array | Buffer;
        };
    };
    mutations: ChatMutation[];
}>;
export declare const decodeSyncdPatch: (msg: proto.ISyncdPatch, name: WAPatchName, initialState: LTHashState, getAppStateSyncKey: SignalKeyStore['getAppStateSyncKey'], validateMacs: boolean) => Promise<{
    hash: Buffer;
    indexValueMap: {
        [indexMacBase64: string]: {
            valueMac: Uint8Array | Buffer;
        };
    };
    mutations: ChatMutation[];
}>;
export declare const extractSyncdPatches: (result: BinaryNode) => Promise<{
    critical_block: {
        patches: proto.ISyncdPatch[];
        snapshot?: proto.ISyncdSnapshot;
    };
    critical_unblock_low: {
        patches: proto.ISyncdPatch[];
        snapshot?: proto.ISyncdSnapshot;
    };
    regular_low: {
        patches: proto.ISyncdPatch[];
        snapshot?: proto.ISyncdSnapshot;
    };
    regular_high: {
        patches: proto.ISyncdPatch[];
        snapshot?: proto.ISyncdSnapshot;
    };
    regular: {
        patches: proto.ISyncdPatch[];
        snapshot?: proto.ISyncdSnapshot;
    };
}>;
export declare const downloadExternalBlob: (blob: proto.IExternalBlobReference) => Promise<Buffer>;
export declare const downloadExternalPatch: (blob: proto.IExternalBlobReference) => Promise<proto.SyncdMutations>;
export declare const decodeSyncdSnapshot: (name: WAPatchName, snapshot: proto.ISyncdSnapshot, getAppStateSyncKey: SignalKeyStore['getAppStateSyncKey'], validateMacs?: boolean) => Promise<LTHashState>;
export declare const decodePatches: (name: WAPatchName, syncds: proto.ISyncdPatch[], initial: LTHashState, getAppStateSyncKey: SignalKeyStore['getAppStateSyncKey'], validateMacs?: boolean) => Promise<{
    newMutations: ChatMutation[];
    state: LTHashState;
}>;
export declare const chatModificationToAppPatch: (mod: ChatModification, jid: string, lastMessages: Pick<proto.IWebMessageInfo, 'key' | 'messageTimestamp'>[]) => WAPatchCreate;
