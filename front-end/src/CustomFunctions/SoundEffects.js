import { Howl } from "howler";

const captureSound = new Howl({
  src: ["../Audio/capture.mp3"],
});

const castleSound = new Howl({
  src: ["../Audio/castle.mp3"],
});

const winnerSound = new Howl({
  src: ["../Audio/winner.mp3"],
});

const loserSound = new Howl({
  src: ["../Audio/loser.mp3"],
});

const tieSound = new Howl({
  src: ["../Audio/tie.mp3"],
});

const moveSound = new Howl({
  src: ["../Audio/move.mp3"],
});

const checkSound = new Howl({
  src: ["../Audio/check.mp3"],
});

const promoteSound = new Howl({
  src: ["../Audio/promote.mp3"],
});

const notifySound = new Howl({
  src: ["../Audio/notify.mp3"],
});

export {
  captureSound,
  castleSound,
  winnerSound,
  loserSound,
  tieSound,
  moveSound,
  checkSound,
  promoteSound,
  notifySound,
};
