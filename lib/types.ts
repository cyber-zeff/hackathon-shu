export interface Answer {
  question_id: number;
  question: string;
  selected: string;
}

export interface University {
  name: string;
  field: string;
  ranking: number;
  location: string;
  country: string;
  website: string;
}

export interface Career {
  title: string;
  field: string;
  reason: string;
  degree: string;
  universities: University[];
}

export interface RecommendationResult {
  careers: Career[];
}
