




export async function getDocFromUuidSync (uuid) {
    const doc = fromUuidSync(uuid);

    if("system" in doc) return doc;

    return await game.packs.get(doc.pack).getDocument(doc._id);
    
    //return ret;
}