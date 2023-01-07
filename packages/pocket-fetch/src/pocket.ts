export type ConsumerKeyProps = {
  /**
   * This key identifies your app to Pocket's API.
   * If you have not obtained a consumer key yet, you can register for one at http://getpocket.com/developer/apps/new.
   * A Pocket consumer key looks like: 1234-abcd1234abcd1234abcd1234.
   */
  consumerKey: string;
};

export type RequestTokenProps = {
  /**
   * Request token used when making future requests.
   */
  code: string;
};

export type AccessTokenProps = {
  /**
   * The user's Pocket access token.
   */
  accessToken: string;
};

export const getData = async (consumerKey: string, accessToken: string) => {
  const request = new Request("https://getpocket.com/v3/get", {
    method: "POST",
    body: JSON.stringify({
      consumer_key: consumerKey,
      access_token: accessToken,
      state: "all",
      contentType: "article",
      count: 10,
    }),
    headers: {
      "Content-Type": "application/json; charset=UTF8",
      "X-Accept": "application/json",
    },
  });

  const response = await fetch(request);
  const rawBody = await response.text();
  const body = JSON.parse(rawBody);

  return body;
};
