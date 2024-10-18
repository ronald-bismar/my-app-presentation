import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  StyleSheet,
  View,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";

// Obtiene las dimensiones de la ventana
const { width, height } = Dimensions.get("window");

export default function HomeScreen() {
  // Referencias para las animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Inicia las animaciones en paralelo
    Animated.parallel([
      // Animación de fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      // Animación de escala
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      // Animación de deslizamiento
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Animación de rotación continua
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 6000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  // Interpolación para la animación de rotación
  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }, { translateY: slideAnim }],
          },
        ]}
      >
        <Animated.View
          style={[styles.logoContainer, { transform: [{ rotate: spin }] }]}
        >
          <Image
            source={require("@/assets/images/react-native-logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>
        <ThemedText type="title" style={styles.title}>
          ¡Hola desde React Native!
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Bienvenido al mundo del desarrollo móvil multiplataforma
        </ThemedText>
      </Animated.View>
    </View>
  );
}

// Estilos para los componentes
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  content: {
    width: width * 0.9,
    maxWidth: 500,
    alignItems: "center",
  },
  logoContainer: {
    width: 200,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#333333",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 18,
    color: "#666666",
    textAlign: "center",
  },
});
