import { FileDataObject } from "../vue-data-entity/FileDataObject"

export interface FilePaginateObject {
  current_page: number;
  data: Array<FileDataObject>;
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface MypageFileObject {
  data: Array<FileDataObject>;
}
