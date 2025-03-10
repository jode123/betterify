declare module 'react-native-web' {
  import { ComponentType } from 'react';
  import { ViewProps, TextProps, ImageProps, TouchableOpacityProps } from 'react-native';

  export const View: ComponentType<ViewProps>;
  export const Text: ComponentType<TextProps>;
  export const Image: ComponentType<ImageProps>;
  export const TouchableOpacity: ComponentType<TouchableOpacityProps>;
  export const StyleSheet: any;
  export const Platform: any;
  export const AppRegistry: any;
}

declare module '@expo/vector-icons' {
  export * from '@expo/vector-icons/build/IconTypes';
}