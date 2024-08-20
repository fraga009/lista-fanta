export interface StrategyItem {
  player_id:     string;
  strategy_id:   string;
  user_id:       string;
  fascia:        number | null;
  fascia_second: number | null;
  fascia_third:  number | null;
  price:         number;
  ex_fmv:        number | null;
  comment:       string | null;
  tit_index:     number | null;
  aff_index:     number | null;
  inf_index:     number | null;
  notes:         string[] | null;
  target:        boolean | null;
  unlocked:      null;
  links:         any[] | null;
  created_at:    string;
  updated_at:    string;
  createdAt:     string;
  updatedAt:     string;
  player:        StrategyPlayer;
}

export interface StrategyPlayer {
  player_id:    string;
  role:         string;
  mantra_roles: string[];
}
