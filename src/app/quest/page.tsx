"use client" 


 


import Novice from '@/components/Game/Novice/Novice'
import React, { useRef, useState, useEffect } from 'react'
import { useLevel } from '@/context/LevelContext'
import { useMissionLogic } from '@/hooks/useMissionLogic'
import Game from '@/components/Game/Novice/Classes/Game'



export default function Quest() {
   const { selectedLevel } = useLevel();
   const noviceRef = useRef<any>(null);

   const handlePause = () => {
  noviceRef.current?.pauseGame();
  };

  
const [gameInstance, setGameInstance] = useState<Game | undefined>();
  useEffect(() => {
    // Check for game instance periodically
    const interval = setInterval(() => {
      if (noviceRef.current?.getGameInstance()) {
        setGameInstance(noviceRef.current.getGameInstance());
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useMissionLogic(
    selectedLevel?.level,
    selectedLevel?.missionAddress,
    selectedLevel?.characterAddress,
    gameInstance, 
    handlePause
  );

  if (!selectedLevel) {
    return (
      <div className="mt-20 text-3xl text-center">
        select Mission on Mission-Hub
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <Novice ref={noviceRef} level={selectedLevel?.level} />
    </div>
  );
}



