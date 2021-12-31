import {sanitize} from './utils.js';
import {add, retreive, remove} from './db.js';

const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;


function bad(message) {
    return new Response(message || 'Bad request', {
      status: 400,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
}


export async function api(request) {

  if (request.method === 'GET') {
    const messages = await retreive();
    return new Response(JSON.stringify(messages), {
      headers: { "content-type": "application/json; charset=utf-8" },
    });
  }

  if (request.method === 'DELETE') {
    const id = request.url.split('/').pop();
    await remove(id);
    
    return new Response('ok', {
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  if (request.method === 'POST') {
    const data = await request.json();
    const message = data.message;
    const picture = data.picture;

    if (typeof message !== 'string')
      return bad('message should be string');

    if (typeof picture !== 'string' || !picture.match(urlRegex) && !picture.startsWith('data:image'))
      return bad('picture should be url or data url');

    const ok = await add({message, picture});

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
