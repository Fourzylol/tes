/// <reference types="ws" />
/// <reference types="node" />
import { SocketConfig } from '../Types';
declare const makeWASocket: (config: Partial<SocketConfig>) => {
    processMessage: (message: import("../Types").WAProto.IWebMessageInfo, chatUpdate: Partial<import("../Types").Chat>) => Promise<void>;
    sendMessageAck: ({ tag, attrs }: import("..").BinaryNode, extraAttrs: {
        [key: string]: string;
    }) => Promise<void>;
    appPatch: (patchCreate: import("../Types").WAPatchCreate) => Promise<void>;
    sendPresenceUpdate: (type: import("../Types").WAPresence, toJid?: string) => Promise<void>;
    presenceSubscribe: (toJid: string) => Promise<void>;
    profilePictureUrl: (jid: string, type?: "image" | "preview") => Promise<string>;
    onWhatsApp: (...jids: string[]) => Promise<{
        exists: boolean;
        jid: string;
    }[]>;
    fetchBlocklist: () => Promise<void>;
    fetchStatus: (jid: string) => Promise<{
        status: string;
        setAt: Date;
    }>;
    updateProfilePicture: (jid: string, content: import("../Types").WAMediaUpload) => Promise<void>;
    updateBlockStatus: (jid: string, action: "block" | "unblock") => Promise<void>;
    resyncAppState: (collections: import("../Types").WAPatchName[], returnSnapshot?: boolean) => Promise<import("../Types").ChatMutation[]>;
    chatModify: (mod: import("../Types").ChatModification, jid: string, lastMessages: Pick<import("../Types").WAProto.IWebMessageInfo, "key" | "messageTimestamp">[]) => Promise<void>;
    resyncMainAppState: () => Promise<void>;
    assertSession: (jid: string, force: boolean) => Promise<boolean>;
    relayMessage: (jid: string, message: import("../Types").WAProto.IMessage, { messageId: msgId, additionalAttributes, cachedGroupMetadata }: import("../Types").MessageRelayOptions) => Promise<string>;
    sendDeliveryReceipt: (jid: string, participant: string, messageIds: string[]) => Promise<void>;
    sendReadReceipt: (jid: string, participant: string, messageIds: string[]) => Promise<void>;
    refreshMediaConn: (forceGet?: boolean) => Promise<import("../Types").MediaConnInfo>;
    waUploadToServer: import("../Types").WAMediaUploadFunction;
    fetchPrivacySettings: (force?: boolean) => Promise<{
        [_: string]: string;
    }>;
    sendMessage: (jid: string, content: import("../Types").AnyMessageContent, options?: import("../Types").MiscMessageGenerationOptions) => Promise<import("../Types").WAProto.WebMessageInfo>;
    groupMetadata: (jid: string) => Promise<import("../Types").GroupMetadata>;
    groupCreate: (subject: string, participants: string[]) => Promise<import("../Types").GroupMetadata>;
    groupLeave: (id: string) => Promise<void>;
    groupUpdateSubject: (jid: string, subject: string) => Promise<void>;
    groupParticipantsUpdate: (jid: string, participants: string[], action: import("../Types").ParticipantAction) => Promise<string[]>;
    groupUpdateDescription: (jid: string, description?: string) => Promise<void>;
    groupInviteCode: (jid: string) => Promise<string>;
    groupRevokeInvite: (jid: string) => Promise<string>;
    groupAcceptInvite: (code: string) => Promise<string>;
    groupToggleEphemeral: (jid: string, ephemeralExpiration: number) => Promise<void>;
    groupSettingUpdate: (jid: string, setting: "announcement" | "not_announcement" | "locked" | "unlocked") => Promise<void>;
    groupFetchAllParticipating: () => Promise<{
        [_: string]: import("../Types").GroupMetadata;
    }>;
    ws: import("ws");
    ev: import("../Types").BaileysEventEmitter;
    authState: import("../Types").AuthenticationState;
    user: import("../Types").Contact;
    assertingPreKeys: (range: number, execute: (keys: {
        [_: number]: any;
    }) => Promise<void>) => Promise<void>;
    generateMessageTag: () => string;
    query: (node: import("..").BinaryNode, timeoutMs?: number) => Promise<import("..").BinaryNode>;
    waitForMessage: (msgId: string, timeoutMs?: number) => Promise<any>;
    waitForSocketOpen: () => Promise<void>;
    sendRawMessage: (data: Uint8Array | Buffer) => Promise<void>;
    sendNode: (node: import("..").BinaryNode) => Promise<void>;
    logout: () => Promise<void>;
    end: (error: Error) => void;
    waitForConnectionUpdate: (check: (u: Partial<import("../Types").ConnectionState>) => boolean, timeoutMs?: number) => Promise<void>;
};
export default makeWASocket;
