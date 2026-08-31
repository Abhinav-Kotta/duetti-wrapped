import { Image, StyleSheet, View } from 'react-native';

type Props = {
  color: string;
  compact?: boolean;
};

export function BrandMark({ color, compact = false }: Props) {
  return (
    <View
      accessibilityLabel="Duetti"
      style={[
        styles.logoFrame,
        compact ? styles.symbolFrame : styles.wordmarkFrame,
        !compact && { borderColor: `${color}22` },
      ]}
    >
      <Image
        resizeMode={compact ? 'cover' : 'contain'}
        source={
          compact
            ? require('../../assets/duetti-symbol.png')
            : require('../../assets/duetti-logo.png')
        }
        style={[styles.logo, !compact && styles.wordmarkImage]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  logoFrame: {
    borderRadius: 7,
    overflow: 'hidden',
  },
  symbolFrame: { height: 36, width: 36 },
  wordmarkFrame: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    height: 66,
    width: 118,
  },
  logo: {
    height: '100%',
    width: '100%',
  },
  wordmarkImage: { transform: [{ scale: 1.38 }] },
});
