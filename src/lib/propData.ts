import type { League, LeagueData } from './types'

// Fallback player lists used if ESPN fetch fails
const FALLBACK_PLAYERS: Record<League, string[]> = {
  mlb: [
    'Aaron Judge', 'Shohei Ohtani', 'Mookie Betts', 'Freddie Freeman',
    'Fernando Tatis Jr.', 'Julio Rodriguez', 'Ronald Acuna Jr.', 'Pete Alonso',
    'Juan Soto', 'Yordan Alvarez', 'Austin Riley', 'Bryce Harper',
    'Trea Turner', 'Bo Bichette', 'Jose Ramirez', 'Jose Altuve',
    'Nolan Arenado', 'Corbin Carroll', 'Gunnar Henderson', 'Corey Seager',
    'Bobby Witt Jr.', 'Steven Kwan', 'Paul Goldschmidt', 'Marcus Semien',
    'Adley Rutschman', 'Matt Olson', 'Michael Harris II', 'Kyle Tucker',
  ],
  nfl: [
    'Patrick Mahomes', 'Josh Allen', 'Lamar Jackson', 'Jalen Hurts',
    'CeeDee Lamb', 'Tyreek Hill', 'Justin Jefferson', 'Davante Adams',
    'Travis Kelce', 'Sam LaPorta', 'Christian McCaffrey', 'Derrick Henry',
    'Tony Pollard', 'Breece Hall', 'Puka Nacua', 'Nico Collins',
    'DeVonta Smith', 'Jaylen Waddle', 'Dallas Goedert', 'Mark Andrews',
    'Brock Purdy', 'Tua Tagovailoa', 'Dak Prescott', 'Mike Evans',
    'DK Metcalf', 'Cooper Kupp', 'Stefon Diggs', 'Ja\'Marr Chase',
  ],
  nba: [
    'Nikola Jokic', 'Luka Doncic', 'Giannis Antetokounmpo', 'Joel Embiid',
    'Stephen Curry', 'LeBron James', 'Jayson Tatum', 'Kevin Durant',
    'Devin Booker', 'Anthony Edwards', 'Shai Gilgeous-Alexander', 'Tyrese Haliburton',
    'Donovan Mitchell', 'Damian Lillard', "De'Aaron Fox", 'Karl-Anthony Towns',
    'Trae Young', 'Zion Williamson', 'Jaylen Brown', 'Paolo Banchero',
    'Victor Wembanyama', 'Anthony Davis', 'Bam Adebayo', 'Jalen Brunson',
    'Jimmy Butler', 'Cade Cunningham', 'Scottie Barnes', 'Franz Wagner',
  ],
  nhl: [
    'Connor McDavid', 'Nathan MacKinnon', 'David Pastrnak', 'Auston Matthews',
    'Leon Draisaitl', 'Alex Ovechkin', 'Nikita Kucherov', 'Brad Marchand',
    'Cale Makar', 'Quinn Hughes', 'Jason Robertson', 'Matthew Tkachuk',
    'Mikko Rantanen', 'Mark Scheifele', 'Elias Pettersson', 'Sidney Crosby',
    'John Tavares', 'Bo Horvat', 'Tage Thompson', 'Kirill Kaprizov',
    'Roman Josi', 'Brayden Point', 'Jake Guentzel', 'William Nylander',
  ],
}

export const LEAGUE_DATA: Record<League, LeagueData> = {
  mlb: {
    icon: 'baseball',
    emoji: '⚾',
    players: FALLBACK_PLAYERS.mlb,
    props: {
      'Home run': {
        tiers: [{ label: 'To hit a home run', odds: [270, 310, 340, 390, 440, 500, 600] }],
      },
      'Hits': {
        tiers: [
          { label: '1+ hits', odds: [-160, -140, -120, -110, -100] },
          { label: '2+ hits', odds: [-120, -110, 110, 120, 130] },
          { label: '3+ hits', odds: [200, 230, 250, 280, 320] },
        ],
      },
      'Total bases': {
        tiers: [
          { label: '1+ total bases', odds: [-180, -160, -140, -120] },
          { label: '2+ total bases', odds: [-130, -110, -100, 110] },
          { label: '3+ total bases', odds: [130, 160, 190, 220] },
          { label: '4+ total bases', odds: [280, 320, 370, 420] },
        ],
      },
      'Strikeouts': {
        tiers: [
          { label: '5+ strikeouts', odds: [-200, -180, -160, -140] },
          { label: '6+ strikeouts', odds: [-140, -120, -110, 100] },
          { label: '7+ strikeouts', odds: [110, 130, 150, 180] },
          { label: '8+ strikeouts', odds: [170, 190, 220, 260] },
          { label: '9+ strikeouts', odds: [280, 320, 380, 440] },
        ],
      },
      'RBI': {
        tiers: [
          { label: '1+ RBI', odds: [120, 140, 160, 180, 210] },
          { label: '2+ RBI', odds: [260, 300, 350, 400] },
          { label: '3+ RBI', odds: [500, 600, 700, 800] },
        ],
      },
    },
  },
  nfl: {
    icon: 'football',
    emoji: '🏈',
    players: FALLBACK_PLAYERS.nfl,
    props: {
      'Touchdowns': {
        tiers: [{ label: 'Anytime touchdown scorer', odds: [110, 130, 150, 175, 200, 250] }],
      },
      'Receiving yards': {
        tiers: [
          { label: '25+ receiving yards', odds: [-200, -180, -160, -140] },
          { label: '50+ receiving yards', odds: [-140, -120, -110, -100] },
          { label: '75+ receiving yards', odds: [-110, -100, 110, 130] },
          { label: '100+ receiving yards', odds: [160, 190, 220, 260] },
          { label: '125+ receiving yards', odds: [300, 360, 420, 500] },
        ],
      },
      'Rushing yards': {
        tiers: [
          { label: '25+ rushing yards', odds: [-200, -180, -160] },
          { label: '50+ rushing yards', odds: [-130, -115, -105, -100] },
          { label: '75+ rushing yards', odds: [100, 110, 130, 160] },
          { label: '100+ rushing yards', odds: [190, 220, 260, 300] },
          { label: '150+ rushing yards', odds: [400, 500, 600] },
        ],
      },
      'Passing yards': {
        tiers: [
          { label: '200+ passing yards', odds: [-200, -180, -160] },
          { label: '250+ passing yards', odds: [-130, -110, -100] },
          { label: '300+ passing yards', odds: [-100, 110, 130, 160] },
          { label: '350+ passing yards', odds: [200, 240, 280, 330] },
        ],
      },
      'Passing touchdowns': {
        tiers: [
          { label: '1+ passing touchdowns', odds: [-160, -140, -120, -110] },
          { label: '2+ passing touchdowns', odds: [120, 140, 170, 200] },
          { label: '3+ passing touchdowns', odds: [380, 440, 520, 600] },
        ],
      },
    },
  },
  nba: {
    icon: 'basketball',
    emoji: '🏀',
    players: FALLBACK_PLAYERS.nba,
    props: {
      'Points': {
        tiers: [
          { label: '10+ points', odds: [-300, -260, -220, -180] },
          { label: '15+ points', odds: [-160, -140, -120, -110] },
          { label: '20+ points', odds: [-120, -110, -100, 110] },
          { label: '25+ points', odds: [110, 130, 160, 200] },
          { label: '30+ points', odds: [200, 240, 280, 340] },
          { label: '35+ points', odds: [320, 380, 440, 520] },
          { label: '40+ points', odds: [700, 900, 1100, 1400] },
        ],
      },
      'Rebounds': {
        tiers: [
          { label: '5+ rebounds', odds: [-180, -160, -130, -110] },
          { label: '8+ rebounds', odds: [110, 130, 160, 190] },
          { label: '10+ rebounds', odds: [180, 220, 260, 310] },
          { label: '12+ rebounds', odds: [350, 420, 500, 600] },
        ],
      },
      'Assists': {
        tiers: [
          { label: '4+ assists', odds: [-180, -160, -140, -120] },
          { label: '6+ assists', odds: [-120, -110, -100, 110] },
          { label: '8+ assists', odds: [140, 170, 210, 260] },
          { label: '10+ assists', odds: [320, 390, 480, 580] },
        ],
      },
      'Double/Triple-double': {
        tiers: [
          { label: 'Double-double', odds: [120, 150, 180, 220] },
          { label: 'Triple-double', odds: [400, 500, 600, 700] },
        ],
      },
    },
  },
  nhl: {
    icon: 'hockey',
    emoji: '🏒',
    players: FALLBACK_PLAYERS.nhl,
    props: {
      'Goals': {
        tiers: [{ label: 'To score a goal', odds: [200, 240, 280, 340, 400] }],
      },
      'Points': {
        tiers: [
          { label: 'To record a point', odds: [-150, -130, -110, -100] },
          { label: '2+ points', odds: [260, 310, 370, 440] },
        ],
      },
      'Shots on goal': {
        tiers: [
          { label: '2+ shots on goal', odds: [-180, -160, -140, -120] },
          { label: '3+ shots on goal', odds: [110, 130, 160, 190] },
          { label: '4+ shots on goal', odds: [220, 260, 310, 370] },
          { label: '5+ shots on goal', odds: [400, 480, 560, 650] },
        ],
      },
      'Saves': {
        tiers: [
          { label: '20+ saves', odds: [-300, -260, -220] },
          { label: '25+ saves', odds: [-140, -120, -110] },
          { label: '30+ saves', odds: [110, 140, 180, 230] },
          { label: '35+ saves', odds: [340, 420, 520, 640] },
        ],
      },
    },
  },
}

export const FALLBACK_PLAYER_POOLS = FALLBACK_PLAYERS
