




"use client"
import { FaCirclePlay } from "react-icons/fa6";

import { useEffect, useRef, forwardRef, useImperativeHandle, useState } from "react";
import Game from "./Classes/Game";
import { FaChevronCircleUp, FaChevronCircleDown } from "react-icons/fa";
import { IoPauseCircleSharp } from "react-icons/io5";
import { MdOutlineReplayCircleFilled } from "react-icons/md";
import { GiTargetShot } from "react-icons/gi";
import { levelConfigs } from "./types/level";

type Level = "level1" | "level2" | "level3" | "level4" | "level5";

interface NoviceProps {
  level: Level;
}

const Novice = forwardRef((props: NoviceProps, ref) => {
  const { level } = props;
  const safeLevel: Level =
    level && levelConfigs[level as Level] ? (level as Level) : "level1";
  const gameRef = useRef<Game | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
      const [gameInitialized, setGameInitialized] = useState(false);
const upRef = useRef<HTMLDivElement>(null);
const downRef = useRef<HTMLDivElement>(null);
const shootRef = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => ({
    getGameInstance: () => gameRef.current,
    startGame: handlePlay,
    pauseGame: handlePause,
    restartGame: handleRestart,
    getGameState: () => ({
      gameOver: gameRef.current?.gameOver ?? false,
      score: gameRef.current?.score ?? 0,
      gameTime: gameRef.current?.gameTime ?? 0,
    }),
  }));

  const gameLoop = (timestamp: number) => {
    const game = gameRef.current;
    const ctx = ctxRef.current;

    if (!game || !ctx) return;
// Calculate actual deltaTime (in milliseconds)
  const now = performance.now();
  const deltaTime = now - (game.lastTime || now);
  game.lastTime = now;

  game.update(deltaTime); // Use real deltaTime
   // game.update(16.67); // fixed 60 FPS step (NOT using timestamp)
    game.draw();

    animationIdRef.current = requestAnimationFrame(gameLoop);
  };

  useEffect(() => {
    const canvas = document.getElementById("Canvas1") as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 1500;
    canvas.height = 500;

    ctxRef.current = ctx;

    const game = new Game(ctx, canvas.width, canvas.height, safeLevel);
    gameRef.current = game;
    game.draw(); // ✅ draw initial frame immediately
    setGameInitialized(true);
  }, []);

useEffect(() => {
  if (!gameInitialized) return;
  const input = getInputHandler();
  if (!input) return;

  const upEl = upRef.current;
  if (upEl) {
    upEl.addEventListener("touchstart", (e) => input.touchStart(e, "ArrowUp"), {
      passive: false,
    });
    upEl.addEventListener("touchend", (e) => input.touchEnd(e, "ArrowUp"), {
      passive: false,
    });
  }
   const downEl = downRef.current;
   if (downEl) {
     downEl.addEventListener(
       "touchstart",
       (e) => input.touchStart(e, "ArrowDown"),
       {
         passive: false,
       }
     );
     downEl.addEventListener("touchend", (e) => input.touchEnd(e, "ArrowDown"), {
       passive: false,
     });
   }
  // Repeat for downEl: touchStart/touchEnd with 'ArrowDown'
  const shootEl = shootRef.current;
  if (shootEl) {
    shootEl.addEventListener("touchstart", input.touchShoot, {
      passive: false,
    });
  }


  return () => {
    const upEl = upRef.current; // Re-query refs here
    const downEl = downRef.current;
    const shootEl = shootRef.current;
    if (upEl) {
      upEl.removeEventListener("touchstart", (e) =>
        input.touchStart(e, "ArrowUp")
      );
      upEl.removeEventListener("touchend", (e) => input.touchEnd(e, "ArrowUp"));
    }
    if (downEl) {
      downEl.removeEventListener("touchstart", (e) =>
        input.touchStart(e, "ArrowDown")
      );
      downEl.removeEventListener("touchend", (e) =>
        input.touchEnd(e, "ArrowDown")
      );
    }
    if (shootEl) {
      shootEl.removeEventListener("touchstart", input.touchShoot);
    }
  };
}, [gameInitialized]);

  const handlePlay = () => {
    if (!gameRef.current || isPlaying) return;
    gameRef.current.resume();
    gameRef.current.sound.playBackground();
    animationIdRef.current = requestAnimationFrame(gameLoop);
    setIsPlaying(true);
  };

  // const gameLoop = () => {
  //   const game = gameRef.current;
  //   const ctx = ctxRef.current;

  //   if (!game || !ctx) return;

  //   if (!game.paused && !game.gameOver && isPlaying) {
  //     game.update(16.67); // Fixed timestep for 60 FPS
  //   }

  //   ctx.clearRect(0, 0, game.width, game.height);
  //   game.draw();

  //   animationIdRef.current = requestAnimationFrame(gameLoop);
  // };

  // useEffect(() => {
  //   const canvas = document.getElementById("Canvas1") as HTMLCanvasElement;
  //   if (!canvas) return;

  //   const ctx = canvas.getContext("2d");
  //   if (!ctx) return;

  //   canvas.width = 1500;
  //   canvas.height = 500;

  //   ctxRef.current = ctx;

  //   const game = new Game(ctx, canvas.width, canvas.height, safeLevel);
  //   gameRef.current = game;
  //   game.draw(); // Draw initial frame

  //   return () => {
  //     if (animationIdRef.current) {
  //       cancelAnimationFrame(animationIdRef.current);
  //     }
  //     game.sound.stopBackground();
  //   };
  // }, [safeLevel]);

  // const handlePlay = () => {
  //   if (!gameRef.current || isPlaying) return;

  //   if (gameRef.current.gameOver) {
  //     gameRef.current.reset();
  //   } else {
  //     gameRef.current.resume();
  //   }

  //   gameRef.current.sound.playBackground();
  //   setIsPlaying(true);

  //   if (!animationIdRef.current) {
  //     animationIdRef.current = requestAnimationFrame(gameLoop);
  //   }
  // };

  const handlePause = () => {
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = null;
    }
    gameRef.current?.pause();
    gameRef.current?.sound.stopBackground();
    setIsPlaying(false);
  };

  const handleRestart = () => {
    handlePause();
    gameRef.current?.reset();
    gameRef.current?.draw();
    setIsPlaying(false);
  };

  const getInputHandler = () => gameRef.current?.input;

  return (
    <main className="flex flex-col items-center overflow-x-hidden bg-gray-50 justify-center w-full gap-4">
      <div
        id="rotateNotice"
        className="fixed inset-0 z-50 bg-black text-white text-center flex items-center justify-center text-xl md:hidden">
        Please rotate your device to landscape mode 📱🔄 and Swipe down Navbar
        for gamemode
      </div>
      <canvas
        id="Canvas1"
        tabIndex={-1}
        onMouseDown={(e) => e.currentTarget.blur()}
        className="absolute top-0 shadow-[2px_2px_2px_#040f4c,-2px_-2px_2px_#040f4c] left-0"
      />
     
      <div className="fixed bottom-5 left-0 w-full flex justify-center z-20">
        <div className="flex gap-4">
          <div className="absolute bottom-0 left-10 flex lg:hidden flex-col gap-2 justify-center items-center">
            <div
              ref={upRef}
              className="absolute bottom-16 left-10 w-16 h-16 rounded-full shadow-[2px_2px_2px_#040f4c,-2px_-2px_2px_#040f4c] flex items-center justify-center active:scale-110 transition"
              // onTouchStart={(e) => getInputHandler()?.touchStart(e, "ArrowUp")}
              // onTouchEnd={(e) => getInputHandler()?.touchEnd(e, "ArrowUp")}
            >
              <FaChevronCircleUp className="text-yellow-400" />
            </div>
            <div
              ref={downRef}
              className="w-16 absolute -bottom-0 left-10 h-16 rounded-full shadow-[2px_2px_2px_#040f4c,-2px_-2px_2px_#040f4c] flex items-center justify-center active:scale-110 transition"
              // onTouchStart={(e) =>
              //   getInputHandler()?.touchStart(e, "ArrowDown")
              // }
              // onTouchEnd={(e) => getInputHandler()?.touchEnd(e, "ArrowDown")}
            >
              <FaChevronCircleDown className="text-yellow-400" />
            </div>
          </div>
          <div className="absolute bottom-5 flex justify-center items-center left-1/2 -translate-x-1/2 gap-4">
            <button
              onClick={handlePlay}
              className="flex items-center justify-center rounded-full w-12 h-12 shadow-[2px_2px_2px_#040f4c,-2px_-2px_2px_#040f4c] px-4 py-2 ">
              <FaCirclePlay className="text-yellow-400 text-2xl" />
            </button>
            <button
              onClick={handlePause}
              className="flex items-center justify-center rounded-full w-12 h-12 shadow-[2px_2px_2px_#040f4c,-2px_-2px_2px_#040f4c] px-4 py-2 text-yellow-400">
              <IoPauseCircleSharp className="text-yellow-400" />
            </button>
            <button
              onClick={handleRestart}
              className="flex items-center justify-center rounded-full w-12 h-12 shadow-[2px_2px_2px_#040f4c,-2px_-2px_2px_#040f4c] px-4 py-2 text-white">
              <MdOutlineReplayCircleFilled className="text-yellow-400" />
            </button>
          </div>
          <div
            ref={shootRef}
            className="absolute bottom-2 right-10 lg:hidden w-20 h-20 shadow-[2px_2px_2px_#040f4c,-2px_-2px_2px_#040f4c] rounded-full font-bold flex items-center justify-center active:scale-110 transition"
            // onTouchStart={(e) => getInputHandler()?.touchShoot(e)}
          >
            <GiTargetShot className="text-3xl text-yellow-400" />
          </div>
        </div>
      </div>
      <p className="hidden lg:block text-white text-sm absolute bottom-2 left-1/2 -translate-x-1/2">
      press play to start,  Use ↑ ↓ keys to move, Spacebar to shoot
      </p>
    </main>
  );
});

export default Novice;