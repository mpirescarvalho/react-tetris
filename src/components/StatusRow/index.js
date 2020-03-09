import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
	background-color: black;
	border: 3px solid white;
	width: 100%;
	font-family: "ZCOOL QingKe HuangYou", cursive;
	padding: 15px 0;
	margin-bottom: 10px;
`;

const Title = styled.div`
	width: 100%;
	text-align: center;
	font-size: 2em;
	color: white;
`;

const Value = styled.div`
	width: 100%;
	text-align: center;
	font-size: 2em;
	color: white;
`;

const StatusRow = ({title, value}) => (
	<Container>
		<Title>
			{title}
		</Title>
		<Value>
			{value}
		</Value>
	</Container>
);


export default StatusRow;