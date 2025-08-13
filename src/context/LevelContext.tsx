// "use client"




import { createContext, useContext, useState } from "react";
import type { Level } from "@/types/level"; 

interface LevelContextType {
  selectedLevel: { level: Level; missionAddress: string; characterAddress: string } | null;
  setSelectedLevel: (level: { level: Level; missionAddress: string; characterAddress: string } | null) => void;
}

const LevelContext = createContext<LevelContextType | undefined>(undefined);

export const LevelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedLevel, setSelectedLevel] = useState<{ level: Level; missionAddress: string; characterAddress: string } | null>(null);

  return (
    <LevelContext.Provider value={{ selectedLevel, setSelectedLevel }}>
      {children}
    </LevelContext.Provider>
  );
};

export const useLevel = () => {
  const context = useContext(LevelContext);
  if (!context) {
    throw new Error("useLevel must be used within a LevelProvider");
  }
  return context;
};