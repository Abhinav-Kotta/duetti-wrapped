import { StyleSheet, View } from 'react-native';
import { stories } from '../data';

type Props = {
  activeIndex: number;
  color: string;
};

export function ProgressRail({ activeIndex, color }: Props) {
  return (
    <View accessibilityLabel={`Story ${activeIndex + 1} of ${stories.length}`} style={styles.row}>
      {stories.map((story, index) => (
        <View
          key={story.id}
          style={[
            styles.segment,
            { backgroundColor: color, opacity: index <= activeIndex ? 1 : 0.22 },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 5,
    width: '100%',
  },
  segment: {
    borderRadius: 4,
    flex: 1,
    height: 3,
  },
});

