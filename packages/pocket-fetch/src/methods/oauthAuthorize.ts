import { sendRequest } from "../http.js";
import { ConsumerKeyProps, RequestTokenProps } from "../pocket.js";

export type RetrieveAccessTokenProps = ConsumerKeyProps & RequestTokenProps;

export type RetrieveAccessTokenResponse = {
  accessToken: string;
  username: string;
};

export const retrieveAccessToken = async (
  props: RetrieveAccessTokenProps
): Promise<{ accessToken: string; username: string }> => {
  const response = sendRequest<RetrieveAccessTokenResponse>({
    url: "https://getpocket.com/v3/oauth/authorize",
    method: "POST",
    body: props,
  });

  return response;
};

export const constructRedirectUri = (
  requestToken: string,
  callbackUri: string
) =>
  `https://getpocket.com/auth/authorize?request_token=${requestToken}&redirect_uri=${callbackUri}`;
