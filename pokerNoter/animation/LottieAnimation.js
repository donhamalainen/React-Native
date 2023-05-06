import React from "react";
import LottieView from "lottie-react-native";

const LottieAnimation = ({ url, loop, height, width }) => {
  return (
    <LottieView
      source={url}
      autoPlay
      loop={loop}
      height={height}
      width={width}
    />
  );
};

export default LottieAnimation;
