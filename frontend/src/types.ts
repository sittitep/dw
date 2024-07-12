export type Book = {
  id?: number;
  title?: string;
  author?: string;
  genre?: string;
  year?: number;
};

export type User = {
  access_token?: string;
};

export type APIResponseError = {
  code: string;
  message: string;
  details: Record<string, any>;
};

export type APIResponse<T> = {
  data: T | T[] | null;
  error: APIResponseError;
};
