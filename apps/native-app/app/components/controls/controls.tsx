import React from 'react'
import {
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native'
import { useListsQueries } from '../../hooks/useListsQueries'
import NewList from './new-list'
import NewSpot from './new-spot'

export default function Controls() {
  const { listsQuery } = useListsQueries()

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        {listsQuery.isPending ? (
          <>
            <View style={styles.skeleton}>
              <ActivityIndicator
                size="large"
                color="#f8bbd9"
              />
            </View>
            <View style={styles.skeleton}>
              <ActivityIndicator
                size="large"
                color="#f8bbd9"
              />
            </View>
          </>
        ) : (
          <>
            <NewList />
            <NewSpot />
          </>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: '#fce7f3',
    backgroundColor: '#fdf2f8',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  innerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    maxWidth: 672, // max-w-2xl equivalent
    alignSelf: 'center',
  },
  skeleton: {
    height: 44,
    flex: 1,
    borderRadius: 12,
    backgroundColor: '#fce7f3',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
