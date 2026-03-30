export interface Service {
  id: string;
  title: Record<string, string>;
  description: Record<string, string>;
  image: string;
  benefits: Record<string, string[]>;
  duration?: Record<string, string>;
  includedItems?: Record<string, string[]>;
}
