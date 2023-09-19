export interface ZyncData {
  zinc_id: string;
  smiles: string;
  molecular_weight: number;
  log_p: number;
  num_heavy_atoms: number;
  num_h_bond_acceptors: number;
  num_h_bond_donors: number;
  x: number;
  y: number;
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
