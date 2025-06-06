import React from 'react'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import Header from './components/header'
import Controls from './components/controls'
import ListViewer from './components/list-viewer'
import MapViewer from './components/map-viewer'
import FiltersDrawer from './components/filters/filters-drawer'
import MapViewToggle from './components/map-viewer/map-view-toggle'
import { useAppStore } from './stores/app'

const queryClient = new QueryClient()
const Stack = createStackNavigator()

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
