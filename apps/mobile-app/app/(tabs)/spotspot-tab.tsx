import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// This is just a placeholder file for the tab
// The actual navigation happens in the tab press listener
// which redirects to the /spotspot screen
export default function SpotSpotTab() {
  return (
    <View style={styles.container}>
      <Text>Redirecting to SpotSpot...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});