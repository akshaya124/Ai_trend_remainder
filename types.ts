
export interface TrendAction {
  text: string;
  link: string;
  strategy: string;
}

export interface Trend {
  title: string;
  happening: string;
  matters: string;
  action: TrendAction;
  imageUrl: string;
}

export interface AITrendUpdate {
  greeting: string;
  trends: Trend[];
  closing: string;
}