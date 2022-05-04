"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractDeviceJids = exports.parseAndInjectE2ESession = exports.encryptSenderKeyMsgSignalProto = exports.encryptSignalProto = exports.decryptSignalProto = exports.processSenderKeyMessage = exports.decryptGroupSignalProto = exports.signalStorage = exports.xmppPreKey = exports.xmppSignedPreKey = exports.generateOrGetPreKeys = exports.getPreKeys = exports.createSignalIdentity = exports.jidToSignalSenderKeyName = exports.jidToSignalProtocolAddress = exports.generateSignalPubKey = void 0;
const libsignal = __importStar(require("libsignal"));
const generics_1 = require("./generics");
const crypto_1 = require("./crypto");
const WASignalGroup_1 = require("../../WASignalGroup");
const WABinary_1 = require("../WABinary");
const generateSignalPubKey = (pubKey) => {
    const newPub = Buffer.alloc(33);
    newPub.set([5], 0);
    newPub.set(pubKey, 1);
    return newPub;
};
exports.generateSignalPubKey = generateSignalPubKey;
const jidToSignalAddress = (jid) => jid.split('@')[0];
const jidToSignalProtocolAddress = (jid) => {
    return new libsignal.ProtocolAddress(jidToSignalAddress(jid), 0);
};
exports.jidToSignalProtocolAddress = jidToSignalProtocolAddress;
const jidToSignalSenderKeyName = (group, user) => {
    return new WASignalGroup_1.SenderKeyName(group, (0, exports.jidToSignalProtocolAddress)(user)).toString();
};
exports.jidToSignalSenderKeyName = jidToSignalSenderKeyName;
const createSignalIdentity = (wid, accountSignatureKey) => {
    return {
        identifier: { name: wid, deviceId: 0 },
        identifierKey: (0, exports.generateSignalPubKey)(accountSignatureKey)
    };
};
exports.createSignalIdentity = createSignalIdentity;
const getPreKeys = async ({ getPreKey }, min, limit) => {
    const dict = {};
    for (let id = min; id < limit; id++) {
        const key = await getPreKey(id);
        if (key)
            dict[+id] = key;
    }
    return dict;
};
exports.getPreKeys = getPreKeys;
const generateOrGetPreKeys = (creds, range) => {
    const avaliable = creds.nextPreKeyId - creds.firstUnuploadedPreKeyId;
    const remaining = range - avaliable;
    const lastPreKeyId = creds.nextPreKeyId + remaining - 1;
    const newPreKeys = {};
    if (remaining > 0) {
        for (let i = creds.nextPreKeyId; i <= lastPreKeyId; i++) {
            newPreKeys[i] = crypto_1.Curve.generateKeyPair();
        }
    }
    return {
        newPreKeys,
        lastPreKeyId,
        preKeysRange: [creds.firstUnuploadedPreKeyId, range],
    };
};
exports.generateOrGetPreKeys = generateOrGetPreKeys;
const xmppSignedPreKey = (key) => ({
    tag: 'skey',
    attrs: {},
    content: [
        { tag: 'id', attrs: {}, content: (0, generics_1.encodeBigEndian)(key.keyId, 3) },
        { tag: 'value', attrs: {}, content: key.keyPair.public },
        { tag: 'signature', attrs: {}, content: key.signature }
    ]
});
exports.xmppSignedPreKey = xmppSignedPreKey;
const xmppPreKey = (pair, id) => ({
    tag: 'key',
    attrs: {},
    content: [
        { tag: 'id', attrs: {}, content: (0, generics_1.encodeBigEndian)(id, 3) },
        { tag: 'value', attrs: {}, content: pair.public }
    ]
});
exports.xmppPreKey = xmppPreKey;
const signalStorage = ({ creds, keys }) => ({
    loadSession: async (id) => {
        const sess = await keys.getSession(id);
        if (sess) {
            return libsignal.SessionRecord.deserialize(sess);
        }
    },
    storeSession: async (id, session) => {
        await keys.setSession(id, session.serialize());
    },
    isTrustedIdentity: () => {
        return true;
    },
    loadPreKey: async (id) => {
        const key = await keys.getPreKey(id);
        if (key) {
            return {
                privKey: Buffer.from(key.private),
                pubKey: Buffer.from(key.public)
            };
        }
    },
    removePreKey: (id) => keys.setPreKey(id, null),
    loadSignedPreKey: (keyId) => {
        const key = creds.signedPreKey;
        return {
            privKey: Buffer.from(key.keyPair.private),
            pubKey: Buffer.from(key.keyPair.public)
        };
    },
    loadSenderKey: async (keyId) => {
        const key = await keys.getSenderKey(keyId);
        if (key)
            return new WASignalGroup_1.SenderKeyRecord(key);
    },
    storeSenderKey: async (keyId, key) => {
        await keys.setSenderKey(keyId, key.serialize());
    },
    getOurRegistrationId: () => (creds.registrationId),
    getOurIdentity: () => {
        const { signedIdentityKey } = creds;
        return {
            privKey: Buffer.from(signedIdentityKey.private),
            pubKey: (0, exports.generateSignalPubKey)(signedIdentityKey.public),
        };
    }
});
exports.signalStorage = signalStorage;
const decryptGroupSignalProto = (group, user, msg, auth) => {
    const senderName = (0, exports.jidToSignalSenderKeyName)(group, user);
    const cipher = new WASignalGroup_1.GroupCipher((0, exports.signalStorage)(auth), senderName);
    return cipher.decrypt(Buffer.from(msg));
};
exports.decryptGroupSignalProto = decryptGroupSignalProto;
const processSenderKeyMessage = async (authorJid, item, auth) => {
    const builder = new WASignalGroup_1.GroupSessionBuilder((0, exports.signalStorage)(auth));
    const senderName = (0, exports.jidToSignalSenderKeyName)(item.groupId, authorJid);
    const senderMsg = new WASignalGroup_1.SenderKeyDistributionMessage(null, null, null, null, item.axolotlSenderKeyDistributionMessage);
    const senderKey = await auth.keys.getSenderKey(senderName);
    if (!senderKey) {
        const record = new WASignalGroup_1.SenderKeyRecord();
        await auth.keys.setSenderKey(senderName, record);
    }
    await builder.process(senderName, senderMsg);
};
exports.processSenderKeyMessage = processSenderKeyMessage;
const decryptSignalProto = async (user, type, msg, auth) => {
    const addr = (0, exports.jidToSignalProtocolAddress)(user);
    const session = new libsignal.SessionCipher((0, exports.signalStorage)(auth), addr);
    let result;
    switch (type) {
        case 'pkmsg':
            result = await session.decryptPreKeyWhisperMessage(msg);
            break;
        case 'msg':
            result = await session.decryptWhisperMessage(msg);
            break;
    }
    return result;
};
exports.decryptSignalProto = decryptSignalProto;
const encryptSignalProto = async (user, buffer, auth) => {
    const addr = (0, exports.jidToSignalProtocolAddress)(user);
    const cipher = new libsignal.SessionCipher((0, exports.signalStorage)(auth), addr);
    const { type, body } = await cipher.encrypt(buffer);
    return {
        type: type === 3 ? 'pkmsg' : 'msg',
        ciphertext: Buffer.from(body, 'binary')
    };
};
exports.encryptSignalProto = encryptSignalProto;
const encryptSenderKeyMsgSignalProto = async (group, data, meId, auth) => {
    const storage = (0, exports.signalStorage)(auth);
    const senderName = (0, exports.jidToSignalSenderKeyName)(group, meId);
    const builder = new WASignalGroup_1.GroupSessionBuilder(storage);
    const senderKey = await auth.keys.getSenderKey(senderName);
    if (!senderKey) {
        const record = new WASignalGroup_1.SenderKeyRecord();
        await auth.keys.setSenderKey(senderName, record);
    }
    const senderKeyDistributionMessage = await builder.create(senderName);
    const session = new WASignalGroup_1.GroupCipher(storage, senderName);
    return {
        ciphertext: await session.encrypt(data),
        senderKeyDistributionMessageKey: senderKeyDistributionMessage.serialize(),
    };
};
exports.encryptSenderKeyMsgSignalProto = encryptSenderKeyMsgSignalProto;
const parseAndInjectE2ESession = async (node, auth) => {
    const extractKey = (key) => (key ? ({
        keyId: (0, WABinary_1.getBinaryNodeChildUInt)(key, 'id', 3),
        publicKey: (0, exports.generateSignalPubKey)((0, WABinary_1.getBinaryNodeChildBuffer)(key, 'value')),
        signature: (0, WABinary_1.getBinaryNodeChildBuffer)(key, 'signature'),
    }) : undefined);
    node = (0, WABinary_1.getBinaryNodeChild)((0, WABinary_1.getBinaryNodeChild)(node, 'list'), 'user');
    (0, WABinary_1.assertNodeErrorFree)(node);
    const signedKey = (0, WABinary_1.getBinaryNodeChild)(node, 'skey');
    const key = (0, WABinary_1.getBinaryNodeChild)(node, 'key');
    const identity = (0, WABinary_1.getBinaryNodeChildBuffer)(node, 'identity');
    const jid = node.attrs.jid;
    const registrationId = (0, WABinary_1.getBinaryNodeChildUInt)(node, 'registration', 4);
    const device = {
        registrationId,
        identityKey: (0, exports.generateSignalPubKey)(identity),
        signedPreKey: extractKey(signedKey),
        preKey: extractKey(key)
    };
    const cipher = new libsignal.SessionBuilder((0, exports.signalStorage)(auth), (0, exports.jidToSignalProtocolAddress)(jid));
    await cipher.initOutgoing(device);
};
exports.parseAndInjectE2ESession = parseAndInjectE2ESession;
const extractDeviceJids = (result, myDeviceId, excludeZeroDevices) => {
    var _a;
    const extracted = [];
    for (const node of result.content) {
        const list = (_a = (0, WABinary_1.getBinaryNodeChild)(node, 'list')) === null || _a === void 0 ? void 0 : _a.content;
        if (list && Array.isArray(list)) {
            for (const item of list) {
                const { user } = (0, WABinary_1.jidDecode)(item.attrs.jid);
                const devicesNode = (0, WABinary_1.getBinaryNodeChild)(item, 'devices');
                const deviceListNode = (0, WABinary_1.getBinaryNodeChild)(devicesNode, 'device-list');
                if (Array.isArray(deviceListNode === null || deviceListNode === void 0 ? void 0 : deviceListNode.content)) {
                    for (const { tag, attrs } of deviceListNode.content) {
                        const device = +attrs.id;
                        if (tag === 'device' && myDeviceId !== device && (!excludeZeroDevices || device !== 0)) {
                            extracted.push({ user, device });
                        }
                    }
                }
            }
        }
    }
    return extracted;
};
exports.extractDeviceJids = extractDeviceJids;
