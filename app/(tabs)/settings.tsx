import { View, Text, Switch, StyleSheet, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withSequence,
  withDelay 
} from 'react-native-reanimated';
import { useSettings } from '../../contexts/SettingsContext';

export default function Settings() {
  const {
    darkMode,
    setDarkMode,
    precision,
    setPrecision
  } = useSettings();

  const containerOpacity = useSharedValue(0);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
    transform: [{ translateY: (1 - containerOpacity.value) * 30 }],
  }));

  useEffect(() => {
    containerOpacity.value = withSequence(
      withDelay(200, withSpring(1))
    );
  }, []);

  return (
    <View style={[
      styles.container,
      { backgroundColor: darkMode ? '#13151a' : '#f5f5f5' }
    ]}>
      <Animated.View style={[styles.content, containerStyle]}>
        <Text style={[styles.title, { color: darkMode ? '#fff' : '#000' }]}>
          Settings
        </Text>

        <View style={[
          styles.section,
          { backgroundColor: darkMode ? '#1a1b1e' : '#fff' }
        ]}>
          <View style={styles.setting}>
            <Text style={[styles.settingText, { color: darkMode ? '#fff' : '#000' }]}>
              Dark Mode
            </Text>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#3f3f46', true: '#6366f1' }}
              thumbColor={darkMode ? '#fff' : '#71717a'}
            />
          </View>


          <View style={styles.setting}>
            <Text style={[styles.settingText, { color: darkMode ? '#fff' : '#000' }]}>
              Decimal Precision
            </Text>
            <View style={styles.precisionControls}>
              <TouchableOpacity
                style={[
                  styles.precisionButton,
                  { backgroundColor: darkMode ? '#2c2d31' : '#e5e7eb' }
                ]}
                onPress={() => setPrecision(Math.max(0, precision - 1))}
              >
                <Text style={[styles.buttonText, { color: darkMode ? '#fff' : '#000' }]}>-</Text>
              </TouchableOpacity>
              <Text style={[styles.precisionText, { color: darkMode ? '#fff' : '#000' }]}>
                {precision}
              </Text>
              <TouchableOpacity
                style={[
                  styles.precisionButton,
                  { backgroundColor: darkMode ? '#2c2d31' : '#e5e7eb' }
                ]}
                onPress={() => setPrecision(Math.min(8, precision + 1))}
              >
                <Text style={[styles.buttonText, { color: darkMode ? '#fff' : '#000' }]}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={[
          styles.section,
          { backgroundColor: darkMode ? '#1a1b1e' : '#fff' }
        ]}>
          <Text style={[styles.sectionTitle, { color: darkMode ? '#fff' : '#000' }]}>
            About
          </Text>
          <Text style={[styles.aboutText, { color: darkMode ? '#71717a' : '#6b7280' }]}>
            Euler's Modified Method Calculator{'\n'}
            Aryan Singh BT23EEE113
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  content: {
    marginTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  section: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2c2d31',
  },
  settingText: {
    fontSize: 16,
  },
  precisionControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  precisionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  precisionText: {
    fontSize: 16,
    marginHorizontal: 16,
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 20,
  },
});