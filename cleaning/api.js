import { connect } from "https://deno.land/x/redis/mod.ts";


const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;


function bad(message) {
    return new Response(message || 'Bad request', {
      status: 401,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
}


const connectToDB = async () => {
  
  const password = Deno.env.get("REDIS_PASSWORD");
  if(!password) throw Error("Redis password required");

  const redis = await connect({
    hostname: "redis-16785.c226.eu-west-1-3.ec2.cloud.redislabs.com",
    port: 16785,
    password,
  });
  return redis;
}

const db = await connectToDB();


export async function readMessages() {
  const [stream] = await db.xread(
    [{ key: "messages", xid: 0 }],
    { block: 5000 },
  );
  return stream?.messages.map(m => ({
    ...m.fieldValues,
    ms: m.xid.unixMs,
    id: `${m.xid.unixMs}-${m.xid.seqNo}`
  })) || [];
}

async function writeMessage(message) {
  return await db.xadd(
    "messages", "*",
    message, { elements: 10 },
  );
}


export async function api(request) {

  if (request.method === 'GET') {

    const messages = await readMessages();

    return new Response(JSON.stringify(messages), {
      headers: { "content-type": "application/json; charset=utf-8" },
    });
  }

  if (request.method === 'POST') {
    const data = await request.json();
    const message = data.message;
    const picture = data.picture;

    if (typeof message !== 'string')
      return bad('message should be string');

    if (typeof picture !== 'string' || !picture.match(urlRegex))
      return bad('picture should be url');

    const ok = await writeMessage({message, picture});

    if (ok)
      return new Response('ok', {
        headers: { "content-type": "text/plain; charset=utf-8" },
      });

    return new Response('error', {
      status: 500,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }
}
