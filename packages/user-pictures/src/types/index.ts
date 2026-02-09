export interface Picture {
  id: string;
  url_token: string;
  width: number;
  height: number;
  rating: "NEUTRAL" | "EROTIC" | "APP_SAFE";
  is_public: boolean;
  comment?: string;
}

export interface Profile {
  id: string;
  name: string;
  headline?: string;
  preview_pic?: Picture;
  pictures: Picture[];
  [key: string]: unknown;
}
export type GetImageUrlsOptions = {
  publicOnly?: boolean;
  safeOnly?: boolean;
  limit?: number;
};

export type FetchFn = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

export type ApiConfig = {
  baseUrl?: string;
  timeout?: number;
  fetchFn?: FetchFn;
};

export class ApiError extends Error {
  status: number;
  url: string;

  constructor(message: string, status: number, url: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.url = url;
  }
}
