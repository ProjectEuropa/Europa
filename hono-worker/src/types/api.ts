// API型定義

export interface User {
    id: number;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
}

export interface Event {
    id: number;
    register_user_id: string | null;
    event_name: string;
    event_details: string;
    event_reference_url: string | null;
    event_type: string;
    event_closing_day: string;
    event_displaying_day: string;
    created_at: string;
    updated_at: string;
}

export interface File {
    id: number;
    upload_user_id: number | null;
    upload_owner_name: string;  // アップロード者名（匿名対応）
    file_name: string;
    file_path: string;
    file_size: number;
    file_comment: string | null;
    data_type: string;  // チーム:1 or マッチ:2
    downloadable_at: string | null;
    tags: string[];
    created_at: string;
    updated_at: string;
}

export interface Tag {
    id: number;
    tag_name: string;
    created_at: string;
}

// JWT Payload
export interface JWTPayload {
    userId: number;
    email: string;
    iat: number;
    exp: number;
}

// API Responses
export interface SuccessResponse<T> {
    data?: T;
    message?: string;
}

export interface ErrorResponse {
    error: {
        message: string;
        code?: string;
        details?: any;
    };
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
}

// Request Bodies
export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface FileUploadRequest {
    file: File;
    comment?: string;
    tags?: string[];
}
