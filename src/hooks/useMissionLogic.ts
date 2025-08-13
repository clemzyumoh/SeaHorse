

// hooks/useMissionLogic.ts
// Restructured to focus only on completion logic (no startMission, as mission is started in MissionPage).
// Uses interval check (every 1s) for game status, as in the commented version.
// Passes missionAddress and characterAddress directly (from selectedLevel in context).
// Handles completion if conditions met, then pauses the game.
"use client"
import { useEffect } from "react";
import { useMissionActions } from "@/hooks/useMissionActions";
import toast from "react-hot-toast";
import { levelConfigs } from "../types/level"; 
import Game from "@/components/Game/Novice/Classes/Game";

type Level = "level1" | "level2" | "level3" | "level4" | "level5";


export const useMissionLogic = (
  level?: Level,
  missionAddress?: string | null,
  characterAddress?: string | null,
  game?: Game, // Use Game type instead of any
  handlePause?: () => void
) => {
  const { completeLevel } = useMissionActions();

  useEffect(() => {
   // console.log("Current game instance:", game); // Debug
   // console.log("Current score:", game?.score); // Debug

    if (
      !game ||
      !level ||
      !missionAddress ||
      !characterAddress ||
      !handlePause
    ) {
     
      return;
    }

    const handleGameEnd = () => {
       
    
      if (game.score >= levelConfigs[level].XPscore) {
        completeLevel(
          level,
          game.score,
          game.score,
          missionAddress,
          characterAddress
        )
          .then(() => {
            toast.success(`Level ${level} completed! +${game.score} XP`, {
              duration: 5000, // 5 seconds
            });

            // toast.success(`Next level unlocked`, {
            //   duration: 5000,
            //   position: "bottom-center", // More visible position
            // });
          })
          .catch((err) => {
            toast.error(err.message || "Failed to complete level");
            console.error("Complete level error:", err);
          })
          .finally(handlePause);
      } else {
        toast.error("Failed to meet XP goal");
        handlePause();
      }
    };

    const cleanup = game.onGameEnd(handleGameEnd);
    const resetListener = () => {
      cleanup?.();
      game.onGameEnd(handleGameEnd);
    };
    game.onReset = resetListener;

    return () => {
      cleanup?.();
      game.onReset = undefined;
    };
  }, [
    game,
    level,
    missionAddress,
    characterAddress,
    completeLevel,
    handlePause,
  ]);
};