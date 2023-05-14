import { scaleLinear } from "d3-scale";
import { line, curveNatural } from "d3-shape";
import { View, Dimensions, Text as RNText } from "react-native";
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
  if (gameHistory.length === 0) {
    return (
      <View
        style={{
          paddingVertical: 20,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <RNText style={{ fontSize: 18, color: "gray" }}>
          Sinulla ei ole pelattuja pelejä.
        </RNText>
      </View>
    );
  } else if (gameHistory.length < 2) {
    return (
      <View
        style={{
          paddingVertical: 20,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <RNText style={{ fontSize: 18, color: "gray" }}>
          Sinulla tulee olla vähintään kaksi peliä.
        </RNText>
      </View>
    );
  }
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

  const yMinValue = Math.min(...lastTenGames.map((game) => game.profit));
  const yMaxValue = Math.max(...lastTenGames.map((game) => game.profit));

  const padding = Math.abs((yMaxValue - yMinValue) * 0.2); // 20% padding

  const yMin = Math.min(0, yMinValue - padding);
  const yMax = Math.max(0, yMaxValue + padding);

  // SCALE
  const yScale = scaleLinear()
    .domain([yMin, yMax])
    .range([graphHeight - paddingBottom, paddingTop + 10]);

  const xScale = scaleLinear()
    .domain([0, lastTenGames.length - 1])
    .range([paddingLeft + 10, graphWidth - paddingRight - 40]);

  const d3Line = line()
    .x((game, index) => xScale(index))
    .y((game) => yScale(game.profit))
    .curve(curveNatural);

  const path = d3Line(lastTenGames);
  return (
    <View>
      <Svg width={graphWidth} height={graphHeight}>
        <Defs>
          <LinearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%" stopColor="#212A3E" />
            <Stop offset="100%" stopColor="#D25380" />
          </LinearGradient>
        </Defs>
        <Path d={path} stroke="url(#gradient)" strokeWidth="2" fill="none" />
        <Text
          x={graphWidth / 2}
          y={20}
          textAnchor="end"
          alignmentBaseline="middle"
          fill="#212A3E"
          fontSize="14"
          fontWeight="bold"
        >
          Kumulatiivinen graaffi
        </Text>
        {lastTenGames.map((game, index) => (
          <Fragment key={index}>
            {index === lastTenGames.length - 1 ? (
              <>
                <Circle
                  cx={xScale(index)}
                  cy={yScale(game.profit)}
                  r="4"
                  fill={game.profit >= 0 ? "green" : "red"}
                />
                <Text
                  x={xScale(index)}
                  y={yScale(game.profit) + 10}
                  fontSize="12"
                  textAnchor="start"
                  alignmentBaseline="middle"
                  fill={game.profit >= 0 ? "green" : "red"}
                  fontWeight="bold"
                >
                  {game.profit.toFixed(1)}€
                </Text>
              </>
            ) : null}
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
            fill="#212A3E"
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
          stroke="#212A3E"
          strokeWidth="2"
        />
        {/* X-akselin viiva */}
        <Line
          x1={paddingLeft + 10}
          y1={graphHeight - paddingBottom}
          x2={graphWidth - paddingRight}
          y2={graphHeight - paddingBottom}
          stroke="#212A3E"
          strokeWidth="2"
        />
        {/* Nollakohdan viiva */}
        {yMin < 0 && yMax > 0 ? (
          <Line
            x1={paddingLeft + 10}
            y1={yScale(0)}
            x2={graphWidth - paddingRight}
            y2={yScale(0)}
            stroke="gray"
            strokeWidth="1"
            strokeDasharray="2, 4"
          />
        ) : null}
      </Svg>
    </View>
  );
};

export default CustomGraph;
