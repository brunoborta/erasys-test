export interface Picture {
  id: string;
  url_token: string;
  width: number;
  height: number;
  rating: 'NEUTRAL' | 'EROTIC' | 'APP_SAFE';
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

export interface ApiConfig {
  baseUrl?: string;
  timeout?: number;
}
