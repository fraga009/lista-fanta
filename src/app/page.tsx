"use client";

import { StrategyTable } from "./components/strategy-table";
import { Player } from "./types/player";
import { StrategyItem } from "./types/strategy";

const playersJson = require('./data/players.json');
const strategyJson = require('./data/strategy.json');
const players: Player[] = (playersJson as Player[]);
const strategy: StrategyItem[] = strategyJson;

export type StrategyWithPlayerItem = StrategyItem & { player: Player };

let strategyWithPlayer = strategy.filter((item) => item.fascia && item.fascia <= 6).map((item) => {
  const player = players.find((player) => player['player_id'] === item['player_id']);

  if (!player) {
    return null;
  }
  
  return {
    ...item,
    player
  };
}).filter(item => item !== null) as StrategyWithPlayerItem[];
strategyWithPlayer = strategyWithPlayer.sort((a, b) => b.price - a.price);

export default function Home() {
  return (
    <StrategyTable data={strategyWithPlayer} />
  );
}
