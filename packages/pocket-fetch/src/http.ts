export const HttpStatus = {
  BadRequest: 400,
  Forbidden: 403,
  InternalServerError: 500,
};

export type RequestProps = {
  url: string;
  method: string;
  body: Record<string, any>;
};

const serializeBody = (body: unknown): string => {
  return JSON.stringify(body, function (key: string, value: string) {
    if (value && typeof value !== "object") {
      return value;
    }

    const kebabCase = (k: string) =>
      k.replace(/[A-Z][a-z]/g, (group) => `_${group.toLowerCase()}`);

    const result = Object.entries(value)
      .map(([key, value]) => [kebabCase(key), value])
      .reduce((accumulator, [key, value]) => {
        accumulator[key] = value;
        return accumulator;
      }, {} as Record<string, unknown>);

    return result;
  });
};

const makeRequest = ({ url, method, body }: RequestProps) =>
  new Request(url, {
    method,
    body: serializeBody(body),
    headers: {
      "Content-Type": "application/json; charset=UTF8",
      "X-Accept": "application/json",
    },
  });

const checkForErrors = ({ status, headers }: Response): void => {
  if (status >= 200 && status < 300) {
    return;
  }

  throw new Error(headers.get("X-Error") || "Unknown error");
};

export const sendRequest = async <TResponse>(
  requestProps: RequestProps
): Promise<TResponse> => {
  const request = makeRequest(requestProps);
  const response = await fetch(request);

  checkForErrors(response);

  const rawBody = await response.text();

  const body = JSON.parse(rawBody, function (key: string, value: any) {
    if (key.includes("_")) {
      const camelCaseKey = key
        .toLowerCase()
        .replace(/[-_][a-z]/g, (group) => group.slice(-1).toUpperCase());

      this[camelCaseKey] = value;
      return undefined;
    }

    return value;
  });

  return body;
};
