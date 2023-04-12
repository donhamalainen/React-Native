import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const Hook = () => {
  const [taskList, setTaskList] = useState([]);
  // GetData
  const getData = async () => {
    try {
      const getTask = await AsyncStorage.getItem("@task");
      const taskJSON = JSON.parse(getTask);
      setTaskList(taskJSON || []);
    } catch (e) {
      console.error(e);
    }
  };
  // AddData
  const addData = async ({ task }) => {
    if (task !== "") {
      try {
        const newTask = { task };
        taskList.push(newTask);
        await AsyncStorage.setItem("@task", JSON.stringify(taskList));
        console.log("Task saved");
        console.log(taskList);
      } catch (e) {
        console.error(e);
      }
    } else {
      alert("Task is empty");
    }
  };

  // Delete Data
  const deleteAll = async () => {
    try {
      await AsyncStorage.clear();
      console.log("Task cleared");
      console.log(taskList);
    } catch (error) {
      console.error("Task clearing failed, task array can be null");
    }
  };

  // mark
  const markComplated = async () => {
    try {
    } catch (e) {
      console.error(e);
    }
  };

  return [taskList, getData, addData, deleteAll, markComplated];
};
