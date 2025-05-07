import React from 'react';
import { View, StyleSheet } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAppStore } from './stores/app';

// Import components (these will be created later)
// For now, we'll use placeholder components
const Header = () => <View style={styles.header} />;
const Controls = () => <View style={styles.controls} />;
const Filters = () => <View style={styles.filters} />;
const ListViewer = () => <View style={styles.content} />;
const MapViewer = () => <View style={styles.content} />;
const MapViewToggle = () => <View style={styles.mapViewToggle} />;

const queryClient = new QueryClient();

export default function SpotSpot() {
  const { mode } = useAppStore();

  return (
    <QueryClientProvider client={queryClient}>
      <View style={styles.container}>
        <Header />
        <Controls />
        <Filters />
        {mode === 'list' ? <ListViewer /> : <MapViewer />}
        <MapViewToggle />
      </View>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 60,
    backgroundColor: '#f0f0f0',
  },
  controls: {
    height: 50,
    backgroundColor: '#e0e0e0',
  },
  filters: {
    height: 40,
    backgroundColor: '#d0d0d0',
  },
  content: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  mapViewToggle: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
  },
});