
// types/level.ts
export const levelConfigs = {
  level1: { timeLimit: 60000, XPscore: 100 },
  level2: { timeLimit: 60000, XPscore: 200 },
  level3: { timeLimit: 60000, XPscore: 300 },
  level4: { timeLimit: 60000, XPscore: 400 },
  level5: { timeLimit: 60000, XPscore: 500 },
} as const;

export type Level = keyof typeof levelConfigs;