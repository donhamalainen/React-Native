import { scaleLinear } from "d3-scale";
import { line, curveNatural } from "d3-shape";
import { View, Dimensions } from "react-native";
import React, { Fragment } from "react";
import Svg, {
  Path,
  Circle,
  Text,
  Line,
  Defs,
  LinearGradient,
  Stop,
} from "react-native-svg";

const screenWidth = Dimensions.get("window").width;
const graphWidth = screenWidth - 20;
const graphHeight = 200;
const paddingLeft = 20;
const paddingRight = 20;
const paddingTop = 20;
const paddingBottom = 20;

const CustomGraph = ({ gameHistory }) => {
  const cumulativeGameHistory = gameHistory.reduce(
    (accumulator, currentGame, index) => {
      const previousProfit = index > 0 ? accumulator[index - 1].profit : 0;
      accumulator.push({
        ...currentGame,
        profit: previousProfit + currentGame.profit,
      });
      return accumulator;
    },
    []
  );
  // Otetaan vain 10 viimeisintä peliä
  const lastTenGames = cumulativeGameHistory.slice(-10);

  const xScale = scaleLinear()
    .domain([0, lastTenGames.length - 1])
    .range([paddingLeft + 20, graphWidth - paddingRight]);

  const yMin =
    Math.floor(Math.min(...lastTenGames.map((game) => game.profit)) / 10) * 10;
  const yMax =
    Math.ceil(Math.max(...lastTenGames.map((game) => game.profit)) / 10) * 10;

  const yScale = scaleLinear()
    .domain([yMin, yMax])
    .range([graphHeight - paddingBottom - 20, paddingTop + 20]);

  const d3Line = line()
    .x((game, index) => xScale(index))
    .y((game) => yScale(game.profit))
    .curve(curveNatural);

  const path = d3Line(lastTenGames);
  return (
    <View
      style={{
        backgroundColor: "#212A3E",
        padding: 20,
      }}
    >
      <Svg width={graphWidth} height={graphHeight}>
        <Defs>
          <LinearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%" stopColor="#F1F6F9" />
            <Stop offset="100%" stopColor="#D25380" />
          </LinearGradient>
        </Defs>
        <Path d={path} stroke="url(#gradient)" strokeWidth="2" fill="none" />
        {lastTenGames.map((game, index) => (
          <Fragment key={index}>
            <Circle
              cx={xScale(index)}
              cy={yScale(game.profit)}
              r="4"
              fill={game.profit >= 0 ? "green" : "red"}
            />
            <Text
              x={xScale(index)}
              y={yScale(game.profit) - 10}
              fontSize="10"
              textAnchor="middle"
              alignmentBaseline="middle"
              fill="white"
              fontWeight="bold"
            >
              {game.profit.toFixed(1)}
            </Text>
          </Fragment>
        ))}
        {yScale.ticks().map((tick) => (
          <Text
            key={tick}
            x={paddingLeft}
            y={yScale(tick)}
            fontSize="10"
            textAnchor="end"
            alignmentBaseline="middle"
            fill="white"
          >
            {tick}
          </Text>
        ))}
        {/* Y-akselin viiva */}
        <Line
          x1={paddingLeft + 10}
          y1={paddingTop}
          x2={paddingLeft + 10}
          y2={graphHeight - paddingBottom}
          stroke="gray"
          strokeWidth="2"
        />
        {/* X-akselin viiva */}
        <Line
          x1={paddingLeft + 10}
          y1={graphHeight - paddingBottom}
          x2={graphWidth - paddingRight}
          y2={graphHeight - paddingBottom}
          stroke="gray"
          strokeWidth="2"
        />
        {/* Nollakohdan viiva */}
        <Line
          x1={paddingLeft + 10}
          y1={yScale(0)}
          x2={graphWidth - paddingRight}
          y2={yScale(0)}
          stroke="gray"
          strokeWidth="1"
          strokeDasharray="4, 4"
        />
      </Svg>
    </View>
  );
};

export default CustomGraph;
