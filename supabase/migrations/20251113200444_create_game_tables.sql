/*
  # Create game tables for Economic Ladder game

  1. New Tables
    - `game_sessions`: Store game progress and outcomes
      - `id` (uuid, primary key)
      - `players` (jsonb array of player data)
      - `winner` (text)
      - `created_at` (timestamp)
      - `completed_at` (timestamp, nullable)
      
    - `player_stats`: Track player statistics
      - `id` (uuid, primary key)
      - `player_name` (text)
      - `games_played` (integer)
      - `games_won` (integer)
      - `total_money` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access (for leaderboard)
*/

CREATE TABLE IF NOT EXISTS game_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  players jsonb NOT NULL,
  winner text,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

CREATE TABLE IF NOT EXISTS player_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name text UNIQUE NOT NULL,
  games_played integer DEFAULT 0,
  games_won integer DEFAULT 0,
  total_money integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on game sessions"
  ON game_sessions FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert on game sessions"
  ON game_sessions FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update on game sessions"
  ON game_sessions FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public read on player stats"
  ON player_stats FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert on player stats"
  ON player_stats FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public upsert on player stats"
  ON player_stats FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);
