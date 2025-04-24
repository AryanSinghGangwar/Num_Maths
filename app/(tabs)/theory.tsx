import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useState } from 'react';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withSequence,
  withDelay 
} from 'react-native-reanimated';

export default function Theory() {
  const titleOpacity = useSharedValue(0);
  const contentOpacity = useSharedValue(0);

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: (1 - titleOpacity.value) * 50 }],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: (1 - contentOpacity.value) * 30 }],
  }));

  useState(() => {
    titleOpacity.value = withSequence(
      withSpring(1)
    );
    contentOpacity.value = withDelay(300, withSpring(1));
  });

  return (
    <ScrollView style={styles.container}>
      <Animated.View style={[styles.section, titleStyle]}>
        <Text style={styles.title}>Understanding Euler's Modified Method</Text>
      </Animated.View>

      <Animated.View style={[styles.section, contentStyle]}>
        <Text style={styles.sectionTitle}>What is Euler's Modified Method?</Text>
        <Text style={styles.text}>
          Euler's Modified Method is an improved version of Euler's Method for solving ordinary differential equations (ODEs). It provides better accuracy by using an average of the slopes at the beginning and end of each interval.
        </Text>

        <Text style={styles.sectionTitle}>The Algorithm</Text>
        <Text style={styles.text}>
          For a differential equation y' = f(x, y):
        </Text>
        <Text style={styles.formula}>1. Predictor: yₚ = yₙ + h·f(xₙ, yₙ)</Text>
        <Text style={styles.formula}>2. Corrector: yₙ₊₁ = yₙ + (h/2)·[f(xₙ, yₙ) + f(xₙ₊₁, yₚ)]</Text>

        <Text style={styles.sectionTitle}>Advantages</Text>
        <Text style={styles.text}>• More accurate than Euler's Method</Text>
        <Text style={styles.text}>• Self-starting (doesn't require multiple initial values)</Text>
        <Text style={styles.text}>• Relatively simple to implement</Text>

        <Text style={styles.sectionTitle}>When to Use It</Text>
        <Text style={styles.text}>
          Use Euler's Modified Method when:
          {'\n'}• You need better accuracy than Euler's Method
          {'\n'}• The differential equation is well-behaved
          {'\n'}• You want a balance between simplicity and accuracy
        </Text>

        <Text style={styles.sectionTitle}>Error Analysis</Text>
        <Text style={styles.text}>
          The local truncation error is O(h³), making it more accurate than Euler's Method which has a local truncation error of O(h²).
        </Text>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#13151a',
    padding: 16,
  },
  section: {
    backgroundColor: '#1a1b1e',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    marginTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 24,
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    color: '#a1a1aa',
    lineHeight: 24,
    marginBottom: 12,
  },
  formula: {
    fontSize: 16,
    color: '#6366f1',
    fontFamily: 'monospace',
    marginVertical: 8,
    paddingLeft: 16,
  },
});