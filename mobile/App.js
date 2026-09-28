import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native';
import { WebView } from 'react-native-webview';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';

export default function App() {
  // Dynamically extract host IP from Expo manifest if available, fallback to 192.168.0.100
  const getInitialHost = () => {
    try {
      const manifestHost = Constants.expoConfig?.hostUri || Constants.manifest?.debuggerHost || '';
      if (manifestHost) {
        const ip = manifestHost.split(':')[0];
        if (ip) return `http://${ip}:3000`;
      }
    } catch (e) {}
    return 'http://192.168.0.100:3000';
  };

  const [targetUrl, setTargetUrl] = useState(getInitialHost());
  const [currentUrl, setCurrentUrl] = useState(getInitialHost());
  const [isEditing, setIsEditing] = useState(false);
  const [errorCount, setErrorCount] = useState(0);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Top Header Bar for IP Config */}
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>CampusKart Mobile</Text>
        <TouchableOpacity
          onPress={() => setIsEditing(!isEditing)}
          style={styles.changeIpBtn}
        >
          <Text style={styles.changeIpText}>{isEditing ? 'Close' : 'IP Settings'}</Text>
        </TouchableOpacity>
      </View>

      {/* IP Settings Bar if user wants to customize */}
      {isEditing && (
        <View style={styles.ipSettingsBox}>
          <Text style={styles.ipLabel}>Server URL:</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.ipInput}
              value={targetUrl}
              onChangeText={setTargetUrl}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={styles.connectBtn}
              onPress={() => {
                setCurrentUrl(targetUrl);
                setIsEditing(false);
                setErrorCount(0);
              }}
            >
              <Text style={styles.connectBtnText}>Connect</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* WebView Container */}
      <WebView
        key={currentUrl}
        source={{ uri: currentUrl }}
        style={{ flex: 1 }}
        startInLoadingState={true}
        onError={() => setErrorCount((c) => c + 1)}
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4f46e5" />
            <Text style={styles.loadingText}>Connecting to CampusKart...</Text>
            <Text style={styles.subLoadingText}>{currentUrl}</Text>
          </View>
        )}
        renderError={() => (
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>Could not connect to laptop server</Text>
            <Text style={styles.errorSub}>Target URL: {currentUrl}</Text>
            <Text style={styles.errorTip}>
              1. Make sure `npm run mobile` or `npm run dev` is running on your laptop.
              {"\n"}
              2. Make sure your phone is connected to the SAME Wi-Fi network as your laptop.
            </Text>
            <TouchableOpacity
              style={styles.retryBtn}
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.retryBtnText}>Change IP Address</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  headerBar: {
    height: 48,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#4f46e5',
  },
  changeIpBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#e0e7ff',
    borderRadius: 8,
  },
  changeIpText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#3730a3',
  },
  ipSettingsBox: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
  },
  ipLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 4,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  ipInput: {
    flex: 1,
    height: 36,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 12,
    backgroundColor: '#f1f5f9',
  },
  connectBtn: {
    height: 36,
    paddingHorizontal: 14,
    backgroundColor: '#4f46e5',
    borderRadius: 8,
    justifyContent: 'center',
  },
  connectBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 12,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
  },
  subLoadingText: {
    marginTop: 4,
    fontSize: 11,
    color: '#64748b',
    fontFamily: 'monospace',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#ffffff',
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ef4444',
    marginBottom: 8,
  },
  errorSub: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 16,
    fontWeight: '600',
  },
  errorTip: {
    fontSize: 12,
    color: '#334155',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  retryBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#4f46e5',
    borderRadius: 10,
  },
  retryBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 12,
  },
});
