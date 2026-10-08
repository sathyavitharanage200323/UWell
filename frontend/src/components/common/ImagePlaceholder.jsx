import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors, typography } from '../../theme';

const ImagePlaceholder = ({
  source,
  initials,
  size = 50,
  rounded = true,
  borderRadius,
  style,
  iconName = '👤',
  backgroundColor = colors.softCoral,
  textColor = colors.primary
}) => {
  const containerRadius = borderRadius !== undefined 
    ? borderRadius 
    : rounded 
      ? size / 2 
      : 8;

  if (source && typeof source === 'object' && source.uri) {
    return (
      <Image
        source={source}
        style={[
          {
            width: size,
            height: size,
            borderRadius: containerRadius
          },
          style
        ]}
      />
    );
  }

  return (
    <View
      style={[
        styles.placeholder,
        {
          width: size,
          height: size,
          borderRadius: containerRadius,
          backgroundColor: backgroundColor
        },
        style
      ]}
    >
      {initials ? (
        <Text
          style={[
            styles.initialsText,
            {
              fontSize: Math.max(12, size * 0.38),
              color: textColor
            }
          ]}
        >
          {initials.substring(0, 2).toUpperCase()}
        </Text>
      ) : (
        <Text style={{ fontSize: size * 0.4 }}>{iconName}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border
  },
  initialsText: {
    fontWeight: typography.fontWeight.bold,
    textAlign: 'center'
  }
});

export default ImagePlaceholder;
