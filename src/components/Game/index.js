import React, { useState, useEffect } from "react";

import Stage from "../Stage";
import { useInterval } from "../../hooks/useInterval";

import { PrintPlayerInMap } from "../../utils/Utils";
import { palegreen } from "color-name";

const STAGE_HEIGHT = 18;
const STAGE_WIDTH = 10;

const initialMap = [...new Array(STAGE_HEIGHT)].map(() =>
  [...new Array(STAGE_WIDTH)].map(() => ({ fill: 0, color: [] }))
);

const colors = [
  [34, 29, 35],
  [35, 87, 137],
  [154, 3, 30],
  // [252, 252, 252],
  [252, 220, 77]
];

const I = {
  bloco: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]]
};

const O = {
  bloco: [[1, 1], [1, 1]]
};

const T = {
  bloco: [[0, 0, 0], [1, 1, 1], [0, 1, 0]]
};

const J = {
  bloco: [[0, 1, 0], [0, 1, 0], [1, 1, 0]]
};

const L = {
  bloco: [[0, 1, 0], [0, 1, 0], [0, 1, 1]]
};

const S = {
  bloco: [[0, 1, 1], [1, 1, 0], [0, 0, 0]]
};

const Z = {
  bloco: [[1, 1, 0], [0, 1, 1], [0, 0, 0]]
};

const getRandomBloco = () => {
  const blocos = [I, O, T, J, L, S, Z];
  const bloco = blocos[Math.floor(Math.random() * blocos.length)];
  bloco.color = colors[Math.floor(Math.random() * colors.length)];
  return bloco;
};
const getRandomPlayer = player => {
  let bloco, next;
  if (player)
    if (player.next) {
      bloco = JSON.parse(JSON.stringify(player.next));
      next = getRandomBloco();
    }
  if (!bloco) bloco = getRandomBloco();
  if (!next) next = getRandomBloco();
  const pos = [0, Math.floor(STAGE_WIDTH / 2 - 2 / 2)];
  return { pos, bloco, next };
};

const Game = () => {
  const [map, setMap] = useState(initialMap);
  const [player, setPlayer] = useState();
  const [down, setDown] = useState(false);
  const [pause, setPause] = useState(false);

  const drop = () => {
    if (!player) {
      setPlayer(getRandomPlayer());
      return;
    }
    setPlayer(player => {
      const newPos = getNewPlayerPos("down");
      if (player.pos === newPos) {
        setMap(map => {
          const mapWithPlayer = PrintPlayerInMap(player, map);
          const mapCleared = checkMap(mapWithPlayer);
          return mapCleared;
        });
        const newPlayer = getRandomPlayer(player);
        if (!validatePosition(newPlayer.pos, newPlayer.bloco))
          setMap(initialMap); //TODO: lose game
        return newPlayer;
      }
      return { ...player, pos: newPos };
    });
  };

  const rotatePlayer = () => {
    const clonedPlayer = JSON.parse(JSON.stringify(player));
    let mtrx = clonedPlayer.bloco.bloco.map((_, index) =>
      clonedPlayer.bloco.bloco.map(column => column[index])
    );
    mtrx = mtrx.map(row => row.reverse());
    if (validatePosition(player.pos, { bloco: mtrx }))
      setPlayer({ ...player, bloco: { ...player.bloco, bloco: mtrx } });
  };

  const keyUp = ({ keyCode }) => {
    // Activate the interval again when user releases down arrow.
    if (keyCode === 40) {
      setDown(false);
    }
  };

  const keyDown = ({ keyCode }) => {
    switch (keyCode) {
      case 37:
        setPlayer(player => ({ ...player, pos: getNewPlayerPos("left") }));
        break;
      case 38:
        rotatePlayer();
        break;
      case 39:
        setPlayer(player => ({ ...player, pos: getNewPlayerPos("right") }));
        break;
      case 40:
        setDown(true);
        drop();
        break;
      default:
        break;
    }
  };

  const checkMap = React.useCallback(map => {
    let rowsClear = [];
    map.forEach((row, y) => {
      let clear = true;
      row.forEach((pixel, x) => {
        if (pixel.fill === 0) clear = false;
      });
      if (clear) rowsClear.push(y);
    });
    if (rowsClear.length > 0) {
      let newMap = map.slice();
      rowsClear.forEach(y => {
        for (let mapY = newMap.length - 1; mapY >= 0; mapY--)
          if (mapY <= y)
            if (mapY > 0) 
              newMap[mapY] = newMap[mapY - 1]
            else
              newMap[mapY] = [...new Array(STAGE_WIDTH)].map(() => ({ fill: 0, color: [] }));
      });
      return newMap;
    }
    return map;
  }, [map]);

  const validatePosition = React.useCallback(
    (pos, bloco) => {
      for (let y = 0; y < bloco.bloco.length; y++)
        for (let x = 0; x < bloco.bloco[y].length; x++)
          if (bloco.bloco[y][x] === 1) {
            let mapY = pos[0] + y;
            let mapX = pos[1] + x;
            if (
              mapY > STAGE_HEIGHT ||
              mapX < 0 ||
              mapX > STAGE_WIDTH ||
              !map[mapY] ||
              !map[mapY][mapX] ||
              map[mapY][mapX].fill === 1
            )
              return false;
          }
      return true;
    },
    [map]
  );

  const getNewPlayerPos = React.useCallback(
    movement => {
      let newPos;
      if (!player) return;
      if (movement === "down") newPos = [player.pos[0] + 1, player.pos[1]];
      if (movement === "left") newPos = [player.pos[0], player.pos[1] - 1];
      if (movement === "right") newPos = [player.pos[0], player.pos[1] + 1];
      if (!validatePosition(newPos, player.bloco)) return player.pos;
      return newPos;
    },
    [player, validatePosition]
  );

  useInterval(
    () => {
      drop();
    },
    down || pause ? null : 450
  );

  if (!player) return "loading";
  return (
    <div
      onBlur={() => setPause(true)}
      onFocus={() => setPause(false)}
      tabIndex="1"
      onKeyUp={keyUp}
      onKeyDown={keyDown}
    >
      <Stage map={map} player={player} />
    </div>
  );
};

export default Game;
