export interface HathiData {
  date: string;
  first_author_name: string;
  id: string;
  "ix ": string;
  language: string;
  lc1: string;
  title: string;
  x: number;
  y: number;
  year: number;
}
export interface GalaxyData {
  parallax: number;
  longitude: number;
  latitude: number;
}

export interface SampleData {
  x: number;
  y: number;
}

export interface D3Container {
  width: number;
  height: number;
  data: Array<ZyncData>;
  targetContainer: d3.Selection<SVGGElement, unknown, null, undefined>;
}

export interface Point {
  x: number;
  y: number;
}

export type D3Event<T extends Event, E extends Element> = T & {
  currentTarget: E;
};
