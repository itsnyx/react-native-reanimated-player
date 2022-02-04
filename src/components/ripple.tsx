import React, { useEffect, useImperativeHandle, useState } from 'react';
import type { ViewStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';
import type { TapGestureHandlerEventPayload } from 'react-native-gesture-handler';
import type { GestureEvent } from 'react-native-gesture-handler';
import { State, TapGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { hexToRgbA } from '../utils/hexToRgba';

type RippleBtnProps = {
  onPress?: () => void;
  rippleScale?: number;
  duration?: number;
  rippleColor?: string;
  rippleOpacity?: number;
  x: number;
  y: number;
  radius: number;
};
type RippleRefs = {};
const _RippleBtn = React.forwardRef<RippleRefs, RippleBtnProps>(
  (
    {
      rippleScale = 1,
      duration = 500,
      rippleColor = '#000',
      rippleOpacity = 0.5,
      x,
      y,
      radius,
    },
    ref,
  ) => {
    const scale = useSharedValue(0);
    const positionX = useSharedValue(0);
    const positionY = useSharedValue(0);
    const isFinished = useSharedValue(false);
    const uas = useAnimatedStyle(
      () => ({
        top: positionY.value - radius,
        left: positionX.value - radius,
        transform: [
          {
            scale: scale.value,
          },
        ],
      }),
      [radius],
    );
    useEffect(() => {

      isFinished.value = false;
      positionX.value = x;
      positionY.value = y;
      scale.value = withTiming(
        rippleScale,
        { duration, easing: Easing.bezier(0, 0, 0.8, 0.4) },
        finised => {
          if (finised) {
            isFinished.value = true;
            scale.value = withTiming(0, { duration: 0 });
          }
        },
      );
    }, []);
    if (radius === -1) return null;
    return (
      <Animated.View
        style={[
          uas,
          {
            position: 'absolute',
            width: radius * 2,
            height: radius * 2,
            borderRadius: radius,
            backgroundColor: hexToRgbA(rippleColor, rippleOpacity),
          },
        ]}
      />
    );
  },
);
export const Ripple = React.memo(_RippleBtn);