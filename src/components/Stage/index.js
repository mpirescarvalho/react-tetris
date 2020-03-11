import React, {useState, useEffect} from "react";
import styled from "styled-components";

import useWindowDimensions from '../../hooks/useWindowDimensions';
import background from "../../images/background.jpg";
import StatusRow from '../StatusRow';

import Color from 'color';

const Game = styled.div`
	width: 100vw;
	height: ${props => props.portrait ? '95' : '100'}vh;
	display: flex;
	flex-direction: ${props => props.portrait ? 'column' : 'row'};
	justify-content: center;
	align-items: center;
	background-image: url(${background});
	background-size: cover;
	background-position: center;
`;

const ContainerNext = styled.div`
	${props => !props.portrait && `height: ${(props.pixelSize * 18) + ((18 / 3) * 1)}px;` }
	${props => props.portrait && `width: ${(props.pixelSize * 10) + ((10 / 3) * 1)}px;` }
	margin-right: ${props => props.portrait ? 0 : props.pixelSize / 3}px;
	margin-bottom: ${props => props.portrait ? props.pixelSize / 3 : 0}px;
`;

const Next = styled.div`
	width: ${props => props.pixelSize * 3}px;
	height: ${props => props.pixelSize * 3}px;
	background-color: #444;
	border: ${props => props.pixelSize / 10}px solid white;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

const StyledStage = styled.div`
	border: ${props => props.pixelSize / 10}px solid white;
	background-color: #444;
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
	position: relative;
	z-index: ${props => props.zIndex};
	${props => props.hint && `
		box-shadow: inset 0 0 3px ${props.playerColor}, inset 0 0 3px white
	`};
	${props => props.fill && `;
		box-shadow: 8px 8px 6px #222${props.topBloco ? `, 0 -8px 0 ${Color(props.color).lighten(0.2)}` : ''} 
	`};
	/* border-left: 1px solid ${props => props.stage || props.fill || props.hint ? '#222' : '#444'};
	border-top: 1px solid ${props => props.stage || props.fill || props.hint ? '#222' : '#444'}; */

`);

const ContainerStatus = styled.div`
	width: ${props => props.pixelSize * 8}px;
	${props => !props.portrait && `height: ${(props.pixelSize * 18) + ((18 / 3) * 1)}px;` }
	${props => props.portrait && `width: ${(props.pixelSize * 10) + ((10 / 3) * 1)}px;` }
	margin-left: ${props => props.portrait ? 0 : props.pixelSize / 3}px;
	margin-top: ${props => props.portrait ? props.pixelSize / 3 : 0}px;
	display: flex;
	flex-direction: ${props => props.portrait ? 'row' : 'column'};
	align-items: center;
	justify-content: ${props => props.portrait ? 'space-between' : 'flex-start'};
	font-size: ${props => props.pixelSize}px;
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
	const [portrait, setPortrait] = useState(false);
	const { width, height } = useWindowDimensions();
	
	useEffect(() => {
		let pixelSizeHeight = height / 20;
		let pixelSizeWidth  = width / 32;
		if (portrait) {
			pixelSizeHeight = height / 26;
			pixelSizeWidth  = width / 12;
		}
		setPixelSize(pixelSizeWidth < pixelSizeHeight ? pixelSizeWidth : pixelSizeHeight);
		setPortrait(height > width);
	}, [width, height, portrait]);

	return (
		<Game portrait={portrait}>
			{player.next && (
				<ContainerNext portrait={portrait} pixelSize={pixelSize}>
					<Next pixelSize={pixelSize}>
						{getRenderizacaoBloco(player.next.bloco).map((row, y) => (
							<Row pixelSize={pixelSize} key={`row-${y}`}>
								{row.map((pixel, x) => {
									return (
										<Pixel zIndex={y} pixelSize={pixelSize} key={`pixel-${x}`} fill={pixel} color={player.next.color} />
									);
								})}
							</Row>
						))}
					</Next>
				</ContainerNext>
			)}
			{map && (
				<StyledStage pixelSize={pixelSize}>
					{map.map((row, y) => (
						<Row stage='true' pixelSize={pixelSize} key={`row-${y}`}>
							{row.map((pixel, x) => {
								let playerFill =
									player.bloco.bloco[y - player.pos[0]] &&
									player.bloco.bloco[y - player.pos[0]][x - player.pos[1]];
								let playerHint =
									hint.bloco.bloco[y - hint.pos[0]] &&
									hint.bloco.bloco[y - hint.pos[0]][x - hint.pos[1]];
								let topBloco =
									((
										playerFill || pixel.fill
									) && (
										!player.bloco.bloco[y - player.pos[0] - 1] ||
										!player.bloco.bloco[y - player.pos[0] - 1][x - player.pos[1]] 	
									)) && (
										!map[y-1] || 
										!map[y-1][x].fill
									);
								let zIndex = !playerFill && !pixel.fill && playerHint ? 99 : y;
								return (
									<Pixel 
										hint={playerHint}
										pixelSize={pixelSize}
										stage='true'
										key={`pixel-${x}`}
										fill={pixel.fill | playerFill}
										color={playerFill ? player.bloco.color : pixel.color}
										playerColor={player.bloco.color}
										topBloco={topBloco}
										zIndex={zIndex}
									>
									</Pixel>
								);
							})}
						</Row>
					))}
				</StyledStage>
			)}
			{status && 
				<ContainerStatus portrait={portrait} pixelSize={pixelSize}>
					<StatusRow portrait={portrait} borderSize={pixelSize/10} margin={pixelSize/3} padding={pixelSize/2} title='SCORE' value={status.score} />
					<StatusRow portrait={portrait} borderSize={pixelSize/10} margin={pixelSize/3} padding={pixelSize/2} title='LEVEL' value={status.level} />
					<StatusRow portrait={portrait} borderSize={pixelSize/10} margin={pixelSize/3} padding={pixelSize/2} title='LINES' value={status.lines} />
				</ContainerStatus>}
	</Game>
	);
};

export default Stage;
