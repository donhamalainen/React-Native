import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Hook } from "../Hook";

const Task = (props) => {
  const time = new Date().getTime();
  const date = new Date(time);
  const [taskList, getData, addData, deleteAll, markComplated] = Hook();
  const [done, setDone] = useState(false);
  const colorDone = done === true ? "#009900" : "#55BCF6";
  const HandleDone = () => {
    //console.log("Task Done");
    setDone(!done);
    markComplated();
  };

  return (
    <TouchableOpacity
      style={styles.item}
      activeOpacity={1}
      onPress={HandleDone}
    >
      <View style={styles.itemLeft}>
        <TouchableOpacity
          style={[styles.square, { backgroundColor: colorDone }]}
          onPress={HandleDone}
        ></TouchableOpacity>
        <Text style={styles.itemText}>{props.text}</Text>
        {done ? (
          <Text style={{ marginLeft: 20, fontSize: 12 }}>
            clock: {date.toLocaleTimeString()}
          </Text>
        ) : (
          <Text></Text>
        )}
      </View>
      <View style={[styles.circle, { backgroundColor: colorDone }]}></View>
    </TouchableOpacity>
  );
};

export default Task;

const styles = StyleSheet.create({
  item: {
    backgroundColor: "lightblue",
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  itemText: {
    maxWidth: "80%",
  },
  square: {
    width: 24,
    height: 24,

    opacity: 0.4,
    borderRadius: 5,
    marginRight: 15,
  },
  circle: {
    width: 12,
    height: 12,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#55BCF6",
  },
});
