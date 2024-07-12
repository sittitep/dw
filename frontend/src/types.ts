export type Book = {
  id?: number;
  title?: string;
  author?: string;
  genre?: string;
  year?: number;
};

export type APIResponseError = {
  code: string;
  message: string;
  details: Record<string, any>;
};

export type APIResponse = {
  data: Book;
  error: APIResponseError;
};
