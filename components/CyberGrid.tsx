import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { cyberpunk } from '@/constants/colors';

const { width, height } = Dimensions.get('window');
const GRID_SPACING = 40;

export default function CyberGrid() {
  const verticalLines = Math.ceil(width / GRID_SPACING);
  const horizontalLines = Math.ceil(height / GRID_SPACING);

  return (
    <View style={styles.container} pointerEvents="none">
      {Array.from({ length: verticalLines }).map((_, i) => (
        <View
          key={`v-${i}`}
          style={[
            styles.verticalLine,
            { left: i * GRID_SPACING },
          ]}
        />
      ))}
      {Array.from({ length: horizontalLines }).map((_, i) => (
        <View
          key={`h-${i}`}
          style={[
            styles.horizontalLine,
            { top: i * GRID_SPACING },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  verticalLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: cyberpunk.gridLine,
  },
  horizontalLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: cyberpunk.gridLine,
  },
});
