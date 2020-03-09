import React, {useState, useEffect} from "react";
import styled from "styled-components";

import useWindowDimensions from '../../hooks/useWindowDimensions';
import background from "../../images/background-min.jpg";
import StatusRow from '../StatusRow';

const Game = styled.div`
	width: 100vw;
	height: 100vh;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	background-image: url(${background});
	background-size: cover;
	background-position: center;
`;

const ContainerNext = styled.div`
	height: ${props => (props.pixelSize * 18) + ((18 / 3) * 1)}px;
	margin-right: 10px;
`;

const Next = styled.div`
	width: ${props => props.pixelSize * 3}px;
	height: ${props => props.pixelSize * 3}px;
	background-color: black;
	border: 3px solid white;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

const StyledStage = styled.div`
	border: 3px solid white;
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
	height: ${props => props.stage ? props.pixelSize : props.pixelSize / 1.6}px;
`;

const Pixel = React.memo(styled.div`
  width: ${props => props.stage ? props.pixelSize : props.pixelSize / 1.6}px;
  height: ${props => props.stage ? props.pixelSize : props.pixelSize / 1.6}px;
  background-color: ${props =>
			props.fill === 1
				? props.color
				: "inherited"};
	box-shadow: ${props => 
			props.hint 
			? `inset 0 0 3px ${props.playerColor}, inset 0 0 3px white`
			: 'none'};
	border-left: 1px solid ${props => props.stage || props.fill || props.hint ? '#222' : 'black'};
	border-top: 1px solid ${props => props.stage || props.fill || props.hint ? '#222' : 'black'};
`);

const ContainerStatus = styled.div`
	height: ${props => (props.pixelSize * 18) + ((18 / 3) * 1)}px;
	width: ${props => props.pixelSize * 8}px;
	margin-left: 10px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
`;

const getRenderizacaoBloco = bloco => {
	let trimRowBloco = [];
	let sumColumn = {};
	bloco.forEach((row, y) => {
		let rowSum = 0;
		row.forEach(pixel => rowSum = rowSum + pixel);
		if (rowSum > 0)
			trimRowBloco.push(row);
		row.forEach((pixel, x) => {
			sumColumn[x] = (sumColumn[x] ? sumColumn[x] : 0) + pixel;
		});
	});
	let trimBloco = [];
	trimRowBloco.forEach((row, y) => {
		let newRow = [];
		row.forEach((pixel, x) => {
			if (sumColumn[x] > 0)
				newRow.push(pixel);
		})
		trimBloco.push(newRow);
	});
	return trimBloco;
}

const Stage = ({ map, player, hint, status }) => {
	
	const [pixelSize, setPixelSize] = useState(30);
	const { width, height } = useWindowDimensions();

	useEffect(() => {
		let pixelSizeHeight = height / 20;
		let pixelSizeWidth  = width / 32;
		setPixelSize(pixelSizeWidth < pixelSizeHeight ? pixelSizeWidth : pixelSizeHeight);
	}, [width, height]);

	return (
		<Game>
			{player.next && (
				<ContainerNext pixelSize={pixelSize}>
					<Next pixelSize={pixelSize}>
						{getRenderizacaoBloco(player.next.bloco).map((row, y) => (
							<Row pixelSize={pixelSize} key={`row-${y}`}>
								{row.map((pixel, x) => {
									return (
										<Pixel pixelSize={pixelSize} key={`pixel-${x}`} fill={pixel} color={player.next.color} />
									);
								})}
							</Row>
						))}
					</Next>
				</ContainerNext>
			)}
			{map && (
				<StyledStage>
					{map.map((row, y) => (
						<Row stage='true' pixelSize={pixelSize} key={`row-${y}`}>
							{row.map((pixel, x) => {
								let playerFill =
									player.bloco.bloco[y - player.pos[0]] &&
									player.bloco.bloco[y - player.pos[0]][x - player.pos[1]];
								let playerHint =
									hint.bloco.bloco[y - hint.pos[0]] &&
									hint.bloco.bloco[y - hint.pos[0]][x - hint.pos[1]];
								return (
									<Pixel 
										hint={playerHint}
										pixelSize={pixelSize}
										stage='true'
										key={`pixel-${x}`}
										fill={pixel.fill | playerFill}
										color={playerFill ? player.bloco.color : pixel.color}
										playerColor={player.bloco.color}
									>
									</Pixel>
								);
							})}
						</Row>
					))}
				</StyledStage>
			)}
			{status && 
				<ContainerStatus pixelSize={pixelSize}>
					<StatusRow title='SCORE' value={status.score} />
					<StatusRow title='LEVEL' value={status.level} />
					<StatusRow title='LINES' value={status.lines} />
				</ContainerStatus>}
	</Game>
	);
};

export default Stage;
