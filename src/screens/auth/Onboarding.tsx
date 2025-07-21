import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');


const GRADIENT_COLORS = ['#2e8b57', '#3cb371'];

export default function Onboarding() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  return (
    <LinearGradient colors={GRADIENT_COLORS} style={styles.container}>
      
      <View style={[styles.bubble, { top: 40, left: -40, width: 120, height: 120, opacity: 0.18 }]} />
      <View style={[styles.bubble, { top: 0.15 * height, right: -60, width: 160, height: 160, opacity: 0.13 }]} />
      <View style={[styles.bubble, { top: 0.45 * height, left: -50, width: 100, height: 100, opacity: 0.10 }]} />
      <View style={[styles.bubble, { bottom: 80, right: 10, width: 90, height: 90, opacity: 0.14 }]} />
      <View style={[styles.bubble, { bottom: 10, left: 30, width: 70, height: 70, opacity: 0.10 }]} />
      
      <View style={styles.logoContainer}>
        
        <View style={styles.logoShape} />
        <Text style={styles.logoText}>SWD391</Text>
      </View>
      
      <Text style={styles.title}>{'Biologies Recognition\nSystem'.replace('\\n', '\n')}</Text>
      <Text style={styles.subtitle}>Fully coded React Native components.</Text>
      
      <TouchableOpacity style={styles.button} onPress={() => navigation.replace('SignIn')}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubble: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: 9999,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
    zIndex: 1,
  },
  logoShape: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    marginBottom: 8,
    opacity: 0.3,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'left',
    width: '80%',
    marginBottom: 8,
    zIndex: 1,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
    marginBottom: 60,
    width: '80%',
    textAlign: 'left',
    zIndex: 1,
  },
  button: {
    position: 'absolute',
    bottom: 40,
    width: width * 0.85,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 2,
  },
  buttonText: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 