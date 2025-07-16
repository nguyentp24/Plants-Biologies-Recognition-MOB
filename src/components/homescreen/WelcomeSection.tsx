import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const WelcomeSection = () => {
  return (
    <View style={styles.welcomeSection}>
      <View style={styles.welcomeContent}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>👤</Text>
        </View>
        <View style={styles.welcomeText}>
          <Text style={styles.welcomeTitle}>Welcome to Learning Environment</Text>
          <Text style={styles.welcomeSubtitle}>Explore the Biology of Plants and Animals</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  welcomeSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  welcomeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
  },
  welcomeText: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1e293b',
    marginBottom: 2,
  },
  welcomeSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
  },
});

export default WelcomeSection;