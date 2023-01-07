import { sendRequest } from "../http.js";
import { AccessTokenProps, ConsumerKeyProps } from "../pocket.js";

export type RetrievePocketDataProps = ConsumerKeyProps &
  AccessTokenProps & {
    state?: "unread" | "archive" | "all";
    favorite?: 0 | 1;
    tag?: "_untagged_" | string;
    contentType?: "article" | "video" | "image";
    sort?: "newest" | "oldest" | "title" | "site";
    detailType?: "simple" | "complete";
    search?: string;
    domain?: string;
    since?: number;
    count?: number;
    offset?: number;
  };

export type ArticleData = {
  /**
   * A unique identifier matching the saved item. This id must be used to perform any actions through the v3/modify endpoint.
   */
  itemId: number;

  /**
   * A unique identifier similar to the item_id but is unique to the actual url of the saved item.
   * The resolved_id identifies unique urls.
   * For example a direct link to a New York Times article and a link that redirects
   * (ex a shortened bit.ly url) to the same article will share the same resolved_id.
   * If this value is 0, it means that Pocket has not processed the item.
   * Normally this happens within seconds but is possible you may request the item before
   * it has been resolved.
   */
  resolvedId: number;

  /**
   * The actual url that was saved with the item. This url should be used if the user wants to view the item.
   */
  givenUrl: string;

  /**
   * The final url of the item. For example if the item was a shortened bit.ly link,
   *    this will be the actual article the url linked to.
   */
  resolvedUrl: string;

  /**
   * The title that was saved along with the item.
   */
  givenTitle: string;

  /**
   * The title that Pocket found for the item when it was parsed.
   */
  resolvedTitle: string;

  /**
   * 0 or 1 - 1 If the item is favorited.
   */
  favorite: 0 | 1;

  /**
   * 0, 1, 2 - 1 if the item is archived - 2 if the item should be deleted.
   */
  status: 0 | 1 | 2;

  /**
   * The first few lines of the item (articles only)
   */
  excerpt: string;

  /**
   * 0 or 1 - 1 if the item is an article
   */
  isArticle: 0 | 1;

  /**
   * 0, 1, or 2 - 1 if the item has images in it - 2 if the item is an image
   */
  hasImage: 0 | 1 | 2;

  /**
   * 0, 1, or 2 - 1 if the item has videos in it - 2 if the item is a video
   */
  hasVideo: 0 | 1 | 2;

  /**
   * How many words are in the article
   */
  wordCount: number;

  /**
   * A JSON object of the user tags associated with the item
   */
  tags: unknown;

  /**
   * A JSON object listing all of the authors associated with the item
   */
  authors: unknown;

  /**
   * A JSON object listing all of the images associated with the item
   */
  images: unknown;

  /**
   * A JSON object listing all of the videos associated with the item
   */
  videos: unknown;
};

export type RetrievePocketDataResponse = {
  status: number;
  complete?: number;
  error?: unknown | null;
  since: number;
  searchMeta: unknown;
  list: Record<string, ArticleData>;
};

export const retrievePocketData = async (
  props: RetrievePocketDataProps
): Promise<RetrievePocketDataResponse> => {
  const response = await sendRequest<RetrievePocketDataResponse>({
    url: "https://getpocket.com/v3/get",
    method: "POST",
    body: props,
  });

  return response;
};
