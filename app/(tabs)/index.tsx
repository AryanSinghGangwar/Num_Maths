import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withSequence,
  withDelay,
  runOnJS
} from 'react-native-reanimated';
import { evaluate } from 'mathjs';
import { useSettings } from '../../contexts/SettingsContext';

export default function Calculator() {
  const { darkMode, precision } = useSettings();
  const [equation, setEquation] = useState('y\' = x + y');
  const [initialX, setInitialX] = useState('0');
  const [initialY, setInitialY] = useState('0');
  const [stepSize, setStepSize] = useState('0.1');
  const [finalX, setFinalX] = useState('1');
  const [corrections, setCorrections] = useState('1');
  const [solution, setSolution] = useState<string[]>([]);

  const titleScale = useSharedValue(0);
  const formOpacity = useSharedValue(0);
  const resultsOpacity = useSharedValue(0);

  const titleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: titleScale.value }],
  }));

  const formStyle = useAnimatedStyle(() => ({
    opacity: formOpacity.value,
    transform: [{ translateY: (1 - formOpacity.value) * 50 }],
  }));

  const resultsStyle = useAnimatedStyle(() => ({
    opacity: resultsOpacity.value,
    transform: [{ translateY: (1 - resultsOpacity.value) * 30 }],
  }));

  useState(() => {
    titleScale.value = withSequence(
      withSpring(1.2),
      withSpring(1)
    );
    formOpacity.value = withDelay(500, withSpring(1));
    resultsOpacity.value = withDelay(1000, withSpring(1));
  });

  const formatNumber = (num: number) => num.toFixed(precision);

  const solveEulerModified = () => {
    try {
      const x0 = parseFloat(initialX);
      const y0 = parseFloat(initialY);
      const h = parseFloat(stepSize);
      const xf = parseFloat(finalX);
      const c = parseInt(corrections);
  
      const n = Math.ceil((xf - x0) / h);
      const solutionSteps: string[] = [];
  
      let currentX = x0;
      let currentY = y0;
  
      const f = (x: number, y: number) => {       ///built function
        const expr = equation.replace("y'", '').replace('=', '').trim();
        return evaluate(expr, { x, y });
      };
  
      solutionSteps.push(`Starting with initial values: x₀ = ${formatNumber(x0)}, y₀ = ${formatNumber(y0)}`);
      solutionSteps.push(`Target x value: ${formatNumber(xf)}`);
      solutionSteps.push(`Using step size h = ${formatNumber(h)} (${n} steps)`);
      solutionSteps.push(`Number of corrections per step: ${c}`);
  
      for (let i = 0; i < n; i++) {
        solutionSteps.push(`\nStep ${i + 1}:`);
  
        const slope1 = f(currentX, currentY);
        let yp = currentY + h * slope1;
  
        solutionSteps.push(`  Predictor:`);
        solutionSteps.push(`    f(${formatNumber(currentX)}, ${formatNumber(currentY)}) = ${formatNumber(slope1)}`);
        solutionSteps.push(`    Predicted y = ${formatNumber(yp)}`);
  
        let yCorrected = yp;
  
        for (let j = 0; j < c; j++) {
          const slope2 = f(currentX + h, yCorrected);
          yCorrected = currentY + (h / 2) * (slope1 + slope2);
  
          solutionSteps.push(`  Correction ${j + 1}:`);
          solutionSteps.push(`    f(${formatNumber(currentX + h)}, ${formatNumber(yCorrected)}) = ${formatNumber(slope2)}`);
          solutionSteps.push(`    Corrected y = ${formatNumber(yCorrected)}`);
        }
  
        currentX += h;
        currentY = yCorrected;
      }
  
      solutionSteps.push(`\nFinal value: y(${formatNumber(currentX)}) = ${formatNumber(currentY)}`);
      setSolution(solutionSteps);
    } catch (error) {
      console.error('Error solving equation:', error);
      setSolution(['Error solving equation. Please check your inputs.']);
    }
  };
  

  return (
    <ScrollView style={[
      styles.container,
      { backgroundColor: darkMode ? '#13151a' : '#f5f5f5' }
    ]}>
      <Animated.View style={[styles.titleContainer, titleStyle]}>
        <Text style={[styles.title, { color: darkMode ? '#fff' : '#000' }]}>
          Euler's Modified Method
        </Text>
        <Text style={styles.subtitle}>Differential Equation Solver</Text>
      </Animated.View>

      <Animated.View style={[
        styles.formContainer,
        formStyle,
        { backgroundColor: darkMode ? '#1a1b1e' : '#fff' }
      ]}>
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: darkMode ? '#fff' : '#000' }]}>
            Differential Equation
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: darkMode ? '#2c2d31' : '#f3f4f6',
                color: darkMode ? '#fff' : '#000'
              }
            ]}
            value={equation}
            onChangeText={setEquation}
            placeholder="e.g., y' = x + y"
            placeholderTextColor={darkMode ? '#71717a' : '#9ca3af'}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={[styles.label, { color: darkMode ? '#fff' : '#000' }]}>
              Initial X
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: darkMode ? '#2c2d31' : '#f3f4f6',
                  color: darkMode ? '#fff' : '#000'
                }
              ]}
              value={initialX}
              onChangeText={setInitialX}
              keyboardType="numeric"
              placeholderTextColor={darkMode ? '#71717a' : '#9ca3af'}
            />
          </View>

          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={[styles.label, { color: darkMode ? '#fff' : '#000' }]}>
              Initial Y
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: darkMode ? '#2c2d31' : '#f3f4f6',
                  color: darkMode ? '#fff' : '#000'
                }
              ]}
              value={initialY}
              onChangeText={setInitialY}
              keyboardType="numeric"
              placeholderTextColor={darkMode ? '#71717a' : '#9ca3af'}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={[styles.label, { color: darkMode ? '#fff' : '#000' }]}>
              Step Size
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: darkMode ? '#2c2d31' : '#f3f4f6',
                  color: darkMode ? '#fff' : '#000'
                }
              ]}
              value={stepSize}
              onChangeText={setStepSize}
              keyboardType="numeric"
              placeholderTextColor={darkMode ? '#71717a' : '#9ca3af'}
            />
          </View>

          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={[styles.label, { color: darkMode ? '#fff' : '#000' }]}>
              Final X Value
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: darkMode ? '#2c2d31' : '#f3f4f6',
                  color: darkMode ? '#fff' : '#000'
                }
              ]}
              value={finalX}
              onChangeText={setFinalX}
              keyboardType="numeric"
              placeholderTextColor={darkMode ? '#71717a' : '#9ca3af'}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: darkMode ? '#fff' : '#000' }]}>
            Number of Corrections per Step
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: darkMode ? '#2c2d31' : '#f3f4f6',
                color: darkMode ? '#fff' : '#000'
              }
            ]}
            value={corrections}
            onChangeText={setCorrections}
            keyboardType="numeric"
            placeholderTextColor={darkMode ? '#71717a' : '#9ca3af'}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={solveEulerModified}>
          <Text style={styles.buttonText}>Solve</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View style={[
        styles.resultsContainer,
        resultsStyle,
        { backgroundColor: darkMode ? '#1a1b1e' : '#fff' }
      ]}>
        {solution.length > 0 && (
          <>
            <Text style={[styles.resultsTitle, { color: darkMode ? '#fff' : '#000' }]}>
              Solution Steps
            </Text>
            <View style={[
              styles.solutionContainer,
              { backgroundColor: darkMode ? '#2c2d31' : '#f3f4f6' }
            ]}>
              {solution.map((step, index) => (
                <Text
                  key={index}
                  style={[
                    styles.solutionText,
                    { color: darkMode ? '#fff' : '#000' },
                    step.startsWith('\n') && styles.stepDivider,
                    step.startsWith('  Correction') && styles.correctionHeader,
                    step.startsWith('    ') && styles.correctionDetail
                  ]}
                >
                  {step}
                </Text>
              ))}
            </View>
          </>
        )}
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#71717a',
  },
  formContainer: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  halfWidth: {
    width: '48%',
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
  },
  input: {
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#6366f1',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultsContainer: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  solutionContainer: {
    borderRadius: 8,
    padding: 16,
  },
  solutionText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'monospace',
  },
  stepDivider: {
    marginTop: 12,
    color: '#6366f1',
    fontWeight: 'bold',
  },
  correctionHeader: {
    color: '#a5b4fc',
    fontWeight: 'bold',
  },
  correctionDetail: {
    color: '#94a3b8',
  },
});