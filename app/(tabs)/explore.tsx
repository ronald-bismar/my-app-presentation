import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

// Define la estructura de una tarea
interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export default function TaskListScreen() {
  // Estado para almacenar la lista de tareas
  const [tasks, setTasks] = useState<Task[]>([]);
  // Estado para el texto de entrada de nueva tarea
  const [inputText, setInputText] = useState("");
  // Estado para controlar qué tarea se está editando
  const [editingId, setEditingId] = useState<string | null>(null);

  // Valor animado para el efecto de fade-in
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Función para añadir una nueva tarea
  const addTask = () => {
    if (inputText) {
      const newTask = {
        id: Date.now().toString(),
        text: inputText,
        completed: false,
      };
      setTasks([newTask, ...tasks]);
      setInputText("");
      fadeIn();
    }
  };

  // Función para actualizar una tarea existente
  const updateTask = (id: string, newText: string) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, text: newText } : task))
    );
    setEditingId(null);
  };

  // Función para marcar una tarea como completada o no completada
  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Función para eliminar una tarea
  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Función para animar la aparición de una nueva tarea
  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  // Componente para renderizar cada tarea individual
  const renderItem = ({ item }: { item: Task }) => (
    <Animated.View style={[styles.item, { opacity: fadeAnim }]}>
      {/* Checkbox para marcar la tarea como completada */}
      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => toggleTask(item.id)}
      >
        <Ionicons
          name={item.completed ? "checkmark-circle" : "ellipse-outline"}
          size={24}
          color={item.completed ? "#4a69bd" : "#95a5a6"}
        />
      </TouchableOpacity>
      {/* Campo de texto editable o texto normal dependiendo del estado de edición */}
      {editingId === item.id ? (
        <TextInput
          style={[styles.taskText, item.completed && styles.completedText]}
          value={item.text}
          onChangeText={(text) => updateTask(item.id, text)}
          onBlur={() => setEditingId(null)}
          autoFocus
        />
      ) : (
        <ThemedText
          style={[styles.taskText, item.completed && styles.completedText]}
        >
          {item.text}
        </ThemedText>
      )}
      {/* Botones para editar y eliminar la tarea */}
      <View style={styles.itemButtons}>
        <TouchableOpacity onPress={() => setEditingId(item.id)}>
          <Ionicons name="pencil" size={24} color="#4a69bd" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteTask(item.id)}>
          <Ionicons name="trash" size={24} color="#eb4d4b" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  // Renderizado principal del componente
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Lista de Tareas</ThemedText>
      {/* Contenedor para el input de nueva tarea */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Añadir nueva tarea"
          placeholderTextColor="#95a5a6"
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      {/* Lista de tareas */}
      <FlatList
        data={tasks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
      {/* Logo de React */}
      <Image
        source={require("@/assets/images/partial-react-logo.png")}
        style={styles.logo}
      />
    </ThemedView>
  );
}

// Estilos para los componentes
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5", // Color de fondo claro (gris muy suave)
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#30336b",
    textAlign: "center",
    marginTop: 50,
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 50,
    borderColor: "#2c3e50",
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    fontSize: 16,
    color: "#2c3e50",
  },
  addButton: {
    backgroundColor: "#4a69bd",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    borderColor: "#2c3e50",
    borderWidth: 1,
  },
  list: {
    flex: 1,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderColor: "#2c3e50",
    borderWidth: 1,
  },
  checkbox: {
    marginRight: 10,
  },
  taskText: {
    flex: 1,
    fontSize: 16,
    color: "#2c3e50",
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#7f8c8d",
  },
  itemButtons: {
    flexDirection: "row",
    width: 60,
    justifyContent: "space-between",
  },
  logo: {
    position: "absolute",
    bottom: 0,
    left: 0,
    height: 140,
    width: "60%",
    resizeMode: "contain",
    opacity: 0.7,
  },
});
