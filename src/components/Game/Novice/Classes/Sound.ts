
export class Sound {
  background: HTMLAudioElement;
  gameStart: HTMLAudioElement;
  gameOver: HTMLAudioElement;
  shooting: HTMLAudioElement;
  youWin: HTMLAudioElement;
  powerUpShooting: HTMLAudioElement;
  exsound: HTMLAudioElement;
  muted: boolean = false; // added
  volume: number = 0.5; // added

  constructor() {
    this.background = new Audio("/assets/bg-sound1.mp3");
    this.background.loop = true;
    this.background.volume = 0.3;

    this.gameStart = new Audio("/assets/gamestart.mp3");
    this.gameOver = new Audio("/assets/gameover-sound.mp3");
    this.shooting = new Audio("/assets/shot1.mp3");
    this.youWin = new Audio("/assets/winn.mp3");
    this.exsound = new Audio("/assets/explosion-sound.mp3");
    this.powerUpShooting = new Audio("/assets/machine-gun.mp3");

    this.applyVolume();
  }
  private applyVolume() {
    const sounds = [
      this.background,
      this.gameStart,
      this.gameOver,
      this.shooting,
      this.youWin,
      this.exsound,
      this.powerUpShooting,
    ];
    sounds.forEach((sound) => {
      sound.volume = this.volume;
      sound.muted = this.muted;
    });
  }

  toggleMute() {
    this.muted = !this.muted;
    this.applyVolume();
  }

  setVolume(value: number) {
    this.volume = Math.max(0, Math.min(1, value)); // clamp between 0 and 1
    this.applyVolume();
  }

  playBackground() {
    if(!this.muted)
    this.background.currentTime = 0;
    this.background.play();
  }

  stopBackground() {
    this.background.pause();
    this.background.currentTime = 0;
  }

  playGameStart() {
    if (!this.muted) this.gameStart.currentTime = 0;
    this.gameStart.play();
  }

  playGameOver() {
    if (!this.muted) this.gameOver.currentTime = 0;
    this.gameOver.play();
  }

  playShooting() {
    if (!this.muted) this.shooting.currentTime = 0;
    this.shooting.play();
  }
  explosivesound() {
    if (!this.muted)
      this.exsound.currentTime = 0;
    this.exsound.play();
  }
  playYouWin() {
    if (!this.muted) this.youWin.currentTime = 0;
    this.youWin.play();
  }

  playPowerUpShooting() {
    if (!this.muted) this.powerUpShooting.currentTime = 0;
    this.powerUpShooting.play();
  }
}