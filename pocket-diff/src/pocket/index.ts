const HttpStatus = {
  BadRequest: 400,
  Forbidden: 403,
  InternalServerError: 500,
};

export const obtainRequestToken = async (
  consumerKey: string,
  redirectUri: string
): Promise<string> => {
  const request = new Request("https://getpocket.com/v3/oauth/request", {
    method: "POST",
    body: JSON.stringify({
      consumer_key: consumerKey,
      redirect_uri: redirectUri,
    }),
    headers: {
      "Content-Type": "application/json; charset=UTF8",
      "X-Accept": "application/json",
    },
  });

  const response = await fetch(request);

  if (response.status === HttpStatus.BadRequest) {
    throw new Error("Missing consumer key or redirect URI");
  } else if (response.status === HttpStatus.Forbidden) {
    throw new Error("Invalid consumer key");
  } else if (response.status === HttpStatus.InternalServerError) {
    throw new Error("Pocket server error");
  }

  const rawBody = await response.text();
  const body = JSON.parse(rawBody);
  return body.code;
};

export const getAccessToken = async (
  consumerKey: string,
  code: string
): Promise<{ accessToken: string; username: string }> => {
  const request = new Request("https://getpocket.com/v3/oauth/authorize", {
    method: "POST",
    body: JSON.stringify({
      consumer_key: consumerKey,
      code: code,
    }),
    headers: {
      "Content-Type": "application/json; charset=UTF8",
      "X-Accept": "application/json",
    },
  });

  const response = await fetch(request);
  const rawBody = await response.text();
  console.debug(response);

  const body = JSON.parse(rawBody);


  return {
    accessToken: body["access_token"],
    username: body.username,
  };
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
