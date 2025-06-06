import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native'

export default function Header() {
  // For now, we'll simulate session state - in a real app you'd connect to your auth provider
  const session = { user: { email: 'user@example.com' } }
  const isPending = false

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            // Implement sign out logic here
            console.log('Signing out...')
          },
        },
      ],
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>SpotSpot</Text>
        </View>
        {isPending ? (
          <View style={styles.skeleton}>
            <ActivityIndicator
              size="small"
              color="#f8bbd9"
            />
          </View>
        ) : (
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
          >
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: '#fce7f3',
    backgroundColor: '#fefcff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: 512, // max-w-lg equivalent
    alignSelf: 'center',
    width: '100%',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    fontSize: 24,
    fontWeight: '600',
    color: '#7c3aed', // Simulating gradient with purple
  },
  skeleton: {
    height: 32,
    width: 64,
    backgroundColor: '#fce7f3',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signOutButton: {
    backgroundColor: '#ec4899',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
  },
  signOutText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
})
