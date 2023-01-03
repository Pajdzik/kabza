import { getAccessToken, getData, obtainRequestToken } from "pocket-diff";

/**
 * Welcome to Cloudflare Workers! This is your first scheduled worker.
 *
 * - Run `wrangler dev --local` in your terminal to start a development server
 * - Run `curl "http://localhost:8787/cdn-cgi/mf/scheduled"` to trigger the scheduled event
 * - Go back to the console to see what your worker has logged
 * - Update the Cron trigger in wrangler.toml (see https://developers.cloudflare.com/workers/wrangler/configuration/#triggers)
 * - Run `wrangler publish --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/runtime-apis/scheduled-event/
 */

declare const POCKET_CONSUMER_KEY: string;

export interface Env {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  kabzaStore: KVNamespace;
}

const handlePocketCallback = async (
  request: Request,
  env: Env
): Promise<Response> => {
  const code = await env.kabzaStore.get("pocketcode");
  const { accessToken, username } = await getAccessToken(
    POCKET_CONSUMER_KEY,
    code
  );
  await env.kabzaStore.put("pocketaccesstoken", accessToken);

  return new Response("Great success");
};

const handleInitialize = async (
  request: Request,
  env: Env
): Promise<Response> => {
  const ngrok = "https://b2a2-50-47-214-25.ngrok.io/pocketcallback";
  const code = await obtainRequestToken(POCKET_CONSUMER_KEY, ngrok);
  await env.kabzaStore.put("pocketcode", code);

  const hyperlink = `<a href="https://getpocket.com/auth/authorize?request_token=${code}&redirect_uri=${ngrok}">Authorize Pocket</a>`;
  const html = `<!DOCTYPE html>
                <body>
                  ${hyperlink}
                </body>`;

  return new Response(html, {
    headers: {
      "content-type": "text/html;charset=UTF-8",
    },
  });
};

const handleFetchRequest = async (
  request: Request,
  env: Env
): Promise<Response> => {
  const url = new URL(request.url);

  if (url.pathname === "/pocketcallback") {
    return handlePocketCallback(request, env);
  } else {
    const pocketAccessToken = await env.kabzaStore.get("pocketaccesstoken");
    if (pocketAccessToken) {
      const c = await getData(POCKET_CONSUMER_KEY, pocketAccessToken);
      return new Response("Hello world " + JSON.stringify(c));
    } else {
      return handleInitialize(request, env);
    }
  }
};

export default {
  async scheduled(
    controller: ScheduledController,
    env: Env,
    ctx: ExecutionContext
  ): Promise<void> {
    console.log(`Hello World!`);
  },

  async fetch(request: Request, env: Env) {
    return handleFetchRequest(request, env);
  },
};
