import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";

// COMPONENTS
import Task from "./components/Task";
import { useEffect, useState } from "react";

// Hook
import { Hook } from "./Hook";
export default function App() {
  const colorScheme = useColorScheme();
  const statusBarStyle =
    colorScheme === "dark" ? "light-content" : "dark-content";

  const [task, setTask] = useState("");
  const [taskList, getData, addData, deleteAll, markComplated] = Hook();

  // CLEAR
  const handleClearTask = async () => {
    try {
      await deleteAll();
      await getData();
    } catch (err) {
      console.error(err);
    }
  };
  // ADD TASK
  const handleAddTask = async () => {
    addData({ task: task });
    setTask("");
    getData();
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={statusBarStyle} />
        {/* Today's Tasks */}

        <View style={styles.tasksWrapper}>
          <Text style={styles.sectionTitle}>Today's tasks</Text>

          <View style={styles.items}>
            {/* Tasks */}
            {taskList.map((data, index) => (
              <Task key={index} text={data.task} />
            ))}
          </View>
        </View>
        {/* WRITE TASKS */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.writeTaskWrapper}
        >
          <TextInput
            style={styles.input}
            value={task}
            onChangeText={(prev) => setTask(prev)}
            placeholder={"Write new task 📝"}
          />

          <TouchableOpacity onPress={handleAddTask}>
            <View style={styles.add}>
              <Text style={styles.addText}>+</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleClearTask}>
            <View style={styles.add}>
              <Text>Clear</Text>
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  tasksWrapper: {
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 38,
    fontWeight: "bold",
    marginBottom: 20,
  },
  // ADD NEW TASK
  writeTaskWrapper: {
    position: "absolute",
    bottom: 60,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderColor: "coral",
    borderWidth: 2,
    borderRadius: 20,
    width: 250,
  },
  add: {
    width: 60,
    height: 60,
    backgroundColor: "coral",
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  addText: { fontSize: 32 },
});
