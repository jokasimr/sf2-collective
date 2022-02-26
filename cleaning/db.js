const JSONBIN_MASTER_KEY = Deno.env.get("JSONBIN_MASTER_KEY");
const JSONBIN_COLLECTION = "60fc5e09a917050205cf6095";
const JSONBIN_URL = "https://api.jsonbin.io/v3";


const readUrl = (id) => `${JSONBIN_URL}/b/${id}`;
const addUrl = `${JSONBIN_URL}/b/`;
const removeUrl = (id) => `${JSONBIN_URL}/b/${id}`;
const listUrl = `${JSONBIN_URL}/c/${JSONBIN_COLLECTION}/bins`;


async function throttleMap(f, c, n) {
    const result = [];
    let i = 0;

    while (i < c.length) {
        result.push(
            ...(await Promise.all(c.slice(i, i + n).map(f)))
        );
        i += n;
    }
    result.push(
        ...(await Promise.all(c.slice(i, c.length).map(f)))
    );
    return result;
}

async function read(id) {
    const headers = {
        "X-Master-Key": JSONBIN_MASTER_KEY,
        "X-Bin-Meta": "false",
    };
    const response = await fetch(readUrl(id), {headers});
    return await response.json();
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
    return throttleMap(
        async b => {
            const m = await read(b.record);
            return {...m, ts: b.createdAt, id: b.record};
        },
        bins, 5
    );
}

export async function remove(id) {
    const headers = {
        "X-Master-Key": JSONBIN_MASTER_KEY
    };
    await fetch(removeUrl(id), {headers, method: "DELETE"});
}
