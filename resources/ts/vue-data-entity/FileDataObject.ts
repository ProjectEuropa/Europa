export interface FileDataObject {
  id: number;
  upload_owner_name: string;
  file_name: string;
  file_comment: string;
  upload_user_id: string;
  upload_type: string;
  created_at: Date;
  search_tag1?: string;
  search_tag2?: string;
  search_tag3?: string;
  search_tag4?: string;
}
