export interface TubeBody {
  label: string;
  body: string;
  desc: string;
  types: string[];
}

export interface TubeData {
  label: string;
  body: string;
  desc: string;
  types: string[];
  tubeId: number;
  owner: string;
  isValid: boolean;
}
