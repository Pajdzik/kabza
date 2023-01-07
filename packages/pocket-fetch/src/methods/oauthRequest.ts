import { sendRequest } from "../http.js";
import { ConsumerKeyProps, RequestTokenProps } from "../pocket.js";

export type ObtainRequestProps = ConsumerKeyProps & {
  /**
   * The URL to be called when the authorization process has been completed.
   * This URL should direct back to your application.
   */
  redirectUri: string;

  /**
   * A string of metadata used by your app.
   * This string will be returned in all subsequent authentication responses.
   */
  state?: string;
};

export type ObtainRequestResponse = RequestTokenProps;

/**
 * Begins the Pocket authorization process, by obtaining a request token from Pocket servers by making a POST request.
 * Calls https://getpocket.com/v3/oauth/request.
 *
 * @param @type {ObtainRequestProps}
 * @returns @type {ObtainRequestResponse}
 */
export const obtainRequestToken = async (
  props: ObtainRequestProps
): Promise<ObtainRequestResponse> => {
  const response = await sendRequest<ObtainRequestResponse>({
    url: "https://getpocket.com/v3/oauth/request",
    method: "POST",
    body: props,
  });

  return response;
};
