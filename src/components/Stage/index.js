import React from "react";
import styled from "styled-components";

const PIXEL_SIZE = 25;

const Game = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  background-color: black;
`;

const Next = styled.div`
  width: 100px;
  height: 100px;
  background-color: black;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StyledStage = styled.div`
  width: 50%;
  height: 100%;
  background-color: black;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const Pixel = React.memo(styled.div`
  width: 100%;
  height: 100%;
  /* border-top: 1px solid ${props => (props.fill === 1 ? "grey" : "#aaa")};
  border-right: 1px solid ${props => (props.fill === 1 ? "grey" : "#aaa")};
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${props =>
    props.fill === 1
      ? `rgb(${props.color[0]},${props.color[1]},${props.color[2]})}`
      : "#aaa"}; */


  /* border-radius: 5px; */
  background: ${props =>
    props.fill === 1
      ? `rgb(${props.color[0]},${props.color[1]},${props.color[2]}, 0.8)}`
      : "#aaa"};
  border: ${props => (props.fill === 0 ? "4px solid" : "4px solid")};
  border-bottom-color: ${props =>
    props.fill === 1
      ? `rgb(${props.color[0]},${props.color[1]},${props.color[2]}, 0.1)}`
      : "#aaa"};
  border-right-color: ${props =>
    props.fill === 1
      ? `rgb(${props.color[0]},${props.color[1]},${props.color[2]}, 0.1)}`
      : "#aaa"};
  border-top-color: ${props =>
    props.fill === 1
      ? `rgb(${props.color[0]},${props.color[1]},${props.color[2]}, 1)}`
      : "#aaa"};
  border-left-color: ${props =>
    props.fill === 1
      ? `rgb(${props.color[0]},${props.color[1]},${props.color[2]}, 0.3)}`
      : "#aaa"};

`);

const Stage = ({ map, player }) => {
  return (
    <Game>
      {player.next && (
        <Next>
          {player.next.bloco.map((row, y) => (
            <Row key={`row-${y}`}>
              {row.map((pixel, x) => {
                return (
                  <Pixel
                    key={`pixel-${x}`}
                    fill={pixel}
                    color={player.next.color}
                  />
                );
              })}
            </Row>
          ))}
        </Next>
      )}
      {map && (
        <StyledStage>
          {map.map((row, y) => (
            <Row key={`row-${y}`}>
              {row.map((pixel, x) => {
                let playerFill =
                  player.bloco.bloco[y - player.pos[0]] &&
                  player.bloco.bloco[y - player.pos[0]][x - player.pos[1]];
                return (
                  <Pixel
                    key={`pixel-${x}`}
                    fill={pixel.fill | playerFill}
                    color={playerFill ? player.bloco.color : pixel.color}
                  />
                );
              })}
            </Row>
          ))}
        </StyledStage>
      )}
    </Game>
  );
};

export default Stage;
