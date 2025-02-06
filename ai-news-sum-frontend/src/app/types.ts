export interface Article {
  id: number;
  title: string;
  summary: string;
  sentiment: string;
  site_name?: string;
  original_url: string;
  author?: string;
  topic?: string;
}

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  article: Article | null;
}