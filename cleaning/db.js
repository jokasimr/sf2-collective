const JSONBIN_MASTER_KEY = Deno.env.get("JSONBIN_MASTER_KEY");
const JSONBIN_COLLECTION = "60fc5e09a917050205cf6095";
const JSONBIN_URL = "https://api.jsonbin.io/v3";


const readUrl = (id) => `${JSONBIN_URL}/b/${id}`;
const addUrl = `${JSONBIN_URL}/b/`;
const removeUrl = (id) => `${JSONBIN_URL}/b/${id}`;
const listUrl = `${JSONBIN_URL}/c/${JSONBIN_COLLECTION}/bins`;


async function read(id) {
    const headers = {
        "X-Master-Key": JSONBIN_MASTER_KEY,
        "X-Bin-Meta": "false",
    };
    return (await fetch(readUrl(id), {headers}))
        .json();
}


export async function add(message) {
    const headers = {
        "X-Master-Key": JSONBIN_MASTER_KEY,
        "Content-Type": "application/json",
        "X-Collection-Id": JSONBIN_COLLECTION
    };
    const res = await fetch(addUrl, {
        headers,
        method: "POST",
        body: JSON.stringify(message)
    });
    if (res.status === 200) return 'ok';
    return null;
}


export async function retreive() {
    const headers = {
        "X-Master-Key": JSONBIN_MASTER_KEY
    };
    const bins = await fetch(listUrl, {headers})
        .then(r => r.json());
    return Promise.all(
        bins.map(async b => {
            const m = await read(b.record);
            return {...m, ts: b.createdAt, id: b.record};
        })
    );
}

export async function remove(id) {
    const headers = {
        "X-Master-Key": JSONBIN_MASTER_KEY
    };
    await fetch(removeUrl(id), {headers, method: "DELETE"});
}
