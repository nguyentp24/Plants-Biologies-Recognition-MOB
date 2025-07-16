import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import Header from '../../components/homescreen/Header';
import WelcomeSection from '../../components/homescreen/WelcomeSection';
import BookExplorer from '../../components/homescreen/BookExplorer';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header />
        <WelcomeSection />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});