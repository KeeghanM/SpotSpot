import React from 'react'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { NavigationContainer } from '@react-navigation/native'
import { SafeAreaView, StyleSheet } from 'react-native'
import Header from './app/components/header/header'
import Controls from './app/components/controls/controls'
import ListViewer from './app/components/list-viewer/list-viewer'
import MapViewer from './app/components/map-viewer/map-viewer'
import FiltersDrawer from './app/components/filters/filters-drawer'
import MapViewToggle from './app/components/map-viewer/map-view-toggle'
import { useAppStore } from './app/stores/app'

const queryClient = new QueryClient()

export default function App() {
  const { mode } = useAppStore()
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <SafeAreaView style={styles.container}>
          <Header />
          <Controls />
          {mode === 'list' ? <ListViewer /> : <MapViewer />}
          <FiltersDrawer />
          <MapViewToggle />
        </SafeAreaView>
      </NavigationContainer>
    </QueryClientProvider>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
})
