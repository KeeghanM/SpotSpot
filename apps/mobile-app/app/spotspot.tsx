import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import SpotSpot from '../components/spotspot/SpotSpot';

export default function SpotSpotScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SpotSpot />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});