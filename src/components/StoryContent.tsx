import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  Linking,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  AgeBand,
  catalogMultiples,
  RightsType,
  sourceLinks,
  Story,
} from '../data';
import { palette, radii, type } from '../theme';

type Props = {
  story: Story;
  compact: boolean;
  onRestart: () => void;
};

const ages: AgeBand[] = ['6–24m', '2–5y', '5–10y', '10+y'];

function openSource(url: string) {
  void Linking.openURL(url);
}

function SourceCue({ light = false, floating = false }: { light?: boolean; floating?: boolean }) {
  return (
    <View
      pointerEvents="none"
      style={[styles.sourceCue, floating && styles.sourceCueFloating]}
    >
      <View style={[styles.sourceDot, light && styles.sourceDotLight]} />
      <Text style={[styles.sourceText, light && styles.sourceTextLight]}>REPORT ↗</Text>
    </View>
  );
}

function Metric({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <View>
      <Text style={[styles.metricValue, { color }]}>{value}</Text>
      <Text style={[styles.metricLabel, { color }]}>{label}</Text>
    </View>
  );
}

function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        selected && styles.chipSelected,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </Pressable>
  );
}

function CoverStory({ compact }: { compact: boolean }) {
  const yearFloat = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(yearFloat, { toValue: 1, duration: 1800, useNativeDriver: true }),
        Animated.timing(yearFloat, { toValue: 0, duration: 1800, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [yearFloat]);

  const translateY = yearFloat.interpolate({ inputRange: [0, 1], outputRange: [-6, 7] });

  return (
    <View style={styles.fill}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.yearSticker,
          compact && styles.yearStickerCompact,
          { transform: [{ translateY }, { rotate: '8deg' }] },
        ]}
      >
        <View style={styles.yearDot} />
        <Text style={[styles.yearText, compact && styles.yearTextCompact]}>2026</Text>
      </Animated.View>
      <View style={[styles.coverOrb, compact && styles.coverOrbCompact]}>
        <View style={styles.coverOrbInner} />
        <View style={styles.coverOrbDot} />
      </View>
      <View style={styles.bottomBlock}>
        <Text style={[styles.heroTitle, compact && styles.heroTitleCompact]}>
          Music finance,{`\n`}replayed.
        </Text>
        <Text style={styles.ledeDark}>
          Nine signals shaping catalog valuations and deal activity — distilled from the Duetti × Billboard H2 2026 Music Finance Index.
        </Text>
        <View style={styles.hintRow}>
          <View style={styles.hintLine} />
          <Text style={styles.hintText}>SWIPE · TRACKPAD · ARROWS</Text>
        </View>
      </View>
    </View>
  );
}

function MoodStory({ compact }: { compact: boolean }) {
  return (
    <View style={styles.fill}>
      <Pressable
        accessibilityHint="Opens the market outlook section in Duetti's report"
        accessibilityRole="link"
        onPress={() => openSource(sourceLinks.mood)}
        style={({ pressed }) => [styles.moodGraphic, compact && styles.moodGraphicCompact, pressed && styles.sourcePressed]}
      >
        <View style={[styles.moodRing, compact && styles.moodRingCompact]} />
        <Text style={[styles.moodNumber, compact && styles.moodNumberCompact]}>+20%</Text>
        <Text style={styles.moodTag}>NET POSITIVE READING</Text>
        <SourceCue light floating />
      </Pressable>
      <View style={styles.bottomBlock}>
        <Text style={[styles.storyTitleLight, compact && styles.storyTitleCompact]}>
          Cautious optimism{`\n`}is back.
        </Text>
        <Text style={styles.ledeLight}>
          54% expect multiples to hold steady. 33% expect an increase; 13% expect a decline.
        </Text>
      </View>
    </View>
  );
}

function MultiplesStory({ compact }: { compact: boolean }) {
  const [rights, setRights] = useState<RightsType>('Masters');
  const [age, setAge] = useState<AgeBand>('2–5y');
  const value = catalogMultiples[rights][age];

  return (
    <View style={styles.fill}>
      <Text style={[styles.storyTitleDark, compact && styles.storyTitleCompact]}>
        Catalog age tells the loudest story.
      </Text>
      <View style={styles.controlGroup}>
        <Text style={styles.controlLabel}>RIGHTS</Text>
        <View style={styles.chipRow}>
          {(['Masters', 'Publishing'] as RightsType[]).map((item) => (
            <Chip key={item} label={item} selected={rights === item} onPress={() => setRights(item)} />
          ))}
        </View>
      </View>
      <View style={styles.controlGroup}>
        <Text style={styles.controlLabel}>CATALOG AGE</Text>
        <View style={styles.chipRow}>
          {ages.map((item) => (
            <Chip key={item} label={item} selected={age === item} onPress={() => setAge(item)} />
          ))}
        </View>
      </View>
      <Pressable
        accessibilityHint="Opens the catalog valuation section in Duetti's report"
        accessibilityRole="link"
        onPress={() => openSource(sourceLinks.multiples)}
        style={({ pressed }) => [styles.multipleResult, pressed && styles.sourcePressed]}
      >
        <Text style={[styles.multipleValue, compact && styles.multipleValueCompact]}>{value.toFixed(1)}×</Text>
        <View style={styles.multipleMeta}>
          <Text style={styles.multipleMetaTitle}>TRAILING-12-MONTH NET REVENUE</Text>
          <Text style={styles.multipleMetaText}>Panel baseline multiple · {rights} · {age} old</Text>
          <SourceCue />
        </View>
      </Pressable>
      <Text style={styles.disclaimer}>
        Market context, not a quote. Actual values reflect durability, concentration, growth and rights quality.
      </Text>
    </View>
  );
}

function GenresStory({ compact }: { compact: boolean }) {
  return (
    <View style={styles.fill}>
      <Text style={[styles.storyTitleDark, compact && styles.storyTitleCompact]}>
        Latin pulled away from the pack.
      </Text>
      <Pressable
        accessibilityHint="Opens the genre outlook section in Duetti's report"
        accessibilityRole="link"
        onPress={() => openSource(sourceLinks.genres)}
        style={({ pressed }) => [styles.genreStage, compact && styles.genreStageCompact, pressed && styles.sourcePressed]}
      >
        <View style={styles.genreDisc}>
          <Text style={[styles.genreNumber, compact && styles.genreNumberCompact]}>+75%</Text>
          <Text style={styles.genreName}>LATIN · NET DIFFERENCE</Text>
        </View>
        <View style={styles.genreOrbitOne}><Text style={styles.orbitText}>+60% NET{`\n`}COUNTRY</Text></View>
        <View style={styles.genreOrbitTwo}><Text style={styles.orbitText}>+29% NET{`\n`}R&B</Text></View>
        <SourceCue floating />
      </Pressable>
      <Text style={styles.ledeDark}>
        Net outlook balance: increase responses minus decrease responses. Latin rose while Pop and EDM cooled.
      </Text>
    </View>
  );
}

function RegionsStory({ compact }: { compact: boolean }) {
  return (
    <View style={styles.fill}>
      <Text style={[styles.storyTitleLight, compact && styles.storyTitleCompact]}>
        The next wave is already global.
      </Text>
      <View style={styles.regionStack}>
        <Pressable
          accessibilityRole="link"
          onPress={() => openSource(sourceLinks.regions)}
          style={({ pressed }) => [styles.regionBig, pressed && styles.sourcePressed]}
        >
          <Text style={[styles.regionBigValue, compact && styles.regionBigValueCompact]}>93%</Text>
          <Text style={styles.regionBigLabel}>OF RESPONDENTS EXPECT{`\n`}MORE LATIN AMERICA DEALS</Text>
          <SourceCue />
        </Pressable>
        <Pressable
          accessibilityRole="link"
          onPress={() => openSource(sourceLinks.regions)}
          style={({ pressed }) => [styles.regionMover, pressed && styles.sourcePressed]}
        >
          <Text style={styles.regionMoverLabel}>BIGGEST NET-OUTLOOK MOVER</Text>
          <Text style={[styles.regionMoverValue, compact && styles.regionMoverValueCompact]}>Japan{`  `}+30% → +57% net</Text>
          <SourceCue />
        </Pressable>
      </View>
      <Text style={styles.ledeLight}>
        Emerging regions are becoming a structural feature of the market — not a passing trend.
      </Text>
    </View>
  );
}

function DealsStory({ compact }: { compact: boolean }) {
  return (
    <View style={styles.fill}>
      <Text style={[styles.storyTitleDark, compact && styles.storyTitleCompact]}>
        The middle has the most momentum.
      </Text>
      <View style={styles.dealComparison}>
        <Pressable
          accessibilityRole="link"
          onPress={() => openSource(sourceLinks.deals)}
          style={({ pressed }) => [styles.dealHeroCard, pressed && styles.sourcePressed]}
        >
          <Text style={styles.dealKicker}>STRONGEST NET OUTLOOK</Text>
          <View style={styles.dealMetricRow}>
            <Text style={[styles.dealHeroValue, compact && styles.dealHeroValueCompact]}>+54%</Text>
            <Text style={styles.dealHeroBand}>$1M–$5M</Text>
          </View>
          <Text style={styles.dealDefinition}>Net growth reading: increase responses minus decrease responses, as defined in the Index.</Text>
          <SourceCue />
        </Pressable>
        <Pressable
          accessibilityRole="link"
          onPress={() => openSource(sourceLinks.deals)}
          style={({ pressed }) => [styles.dealLargeCapCard, pressed && styles.sourcePressed]}
        >
          <View>
            <Text style={styles.dealKickerLight}>LARGE-CAP OUTLOOK</Text>
            <Text style={styles.dealLargeCapBand}>$15M+</Text>
            <SourceCue light />
          </View>
          <Text style={styles.dealLargeCapValue}>+12%</Text>
        </Pressable>
      </View>
      <View style={styles.dealTakeaway}>
        <View style={styles.dealTakeawayMark} />
        <Text style={styles.dealTakeawayText}>
          Momentum is concentrated below $5M. The top end remains positive, but significantly softer.
        </Text>
      </View>
    </View>
  );
}

function MechanicsStory({ compact }: { compact: boolean }) {
  return (
    <View style={styles.fill}>
      <Text style={[styles.storyTitleDark, compact && styles.storyTitleCompact]}>
        Money leads.{`\n`}Relationships close.
      </Text>
      <View style={styles.splitMetrics}>
        <Pressable
          accessibilityRole="link"
          onPress={() => openSource(sourceLinks.buyers)}
          style={({ pressed }) => [styles.splitMetricBlue, pressed && styles.sourcePressed]}
        >
          <Metric value="76%" label={'OF RESPONDENTS CITE\nFINANCIAL FUNDS AS BUYERS'} color={palette.white} />
          <View style={styles.miniFundMark} />
          <SourceCue light />
        </Pressable>
        <Pressable
          accessibilityRole="link"
          onPress={() => openSource(sourceLinks.advisors)}
          style={({ pressed }) => [styles.splitMetricPaper, pressed && styles.sourcePressed]}
        >
          <Metric value="57%" label={'OF RESPONDENTS SAY\nTRUSTED ADVISORS LEAD'} color={palette.ink} />
          <View style={styles.miniHandshake}>
            <View style={styles.handOne} /><View style={styles.handTwo} />
          </View>
          <SourceCue />
        </Pressable>
      </View>
      <Text style={styles.ledeDark}>
        An opaque market still runs on expert guidance and trusted relationships.
      </Text>
    </View>
  );
}

function BarrierStory({ compact }: { compact: boolean }) {
  return (
    <View style={styles.fill}>
      <Pressable
        accessibilityHint="Opens the barriers section in Duetti's report"
        accessibilityRole="link"
        onPress={() => openSource(sourceLinks.barriers)}
        style={({ pressed }) => [styles.barrierTop, pressed && styles.sourcePressed]}
      >
        <View style={styles.gapLabels}>
          <Text style={styles.gapLabel}>SELLER EXPECTATIONS</Text>
          <Text style={styles.gapLabel}>BUYER WILLINGNESS</Text>
        </View>
        <View style={styles.gapTrack}>
          <View style={styles.gapSeller} />
          <View style={styles.gapBuyer} />
        </View>
        <Text style={[styles.barrierNumber, compact && styles.barrierNumberCompact]}>74%</Text>
        <Text style={styles.barrierMetricLabel}>OF RESPONDENTS CITE VALUATION EXPECTATIONS</Text>
        <SourceCue light floating />
      </Pressable>
      <View style={styles.bottomBlock}>
        <Text style={[styles.storyTitleLight, compact && styles.storyTitleCompact]}>
          The biggest gap{`\n`}is expectations.
        </Text>
        <Text style={styles.ledeLight}>
          Nearly three in four cite valuation expectations as a key barrier to getting deals done.
        </Text>
        <View style={styles.barrierDetails}>
          <Text style={styles.barrierDetailsTitle}>THE NEXT-MOST CITED BARRIERS</Text>
          <View style={styles.barrierDetailRow}>
            <Pressable
              accessibilityRole="link"
              onPress={() => openSource(sourceLinks.barriers)}
              style={({ pressed }) => [styles.barrierDetailCard, pressed && styles.sourcePressed]}
            >
              <Text style={styles.barrierDetailNumber}>34%</Text>
              <Text style={styles.barrierDetailLabel}>LEGAL{`\n`}DILIGENCE</Text>
            </Pressable>
            <Pressable
              accessibilityRole="link"
              onPress={() => openSource(sourceLinks.barriers)}
              style={({ pressed }) => [styles.barrierDetailCard, pressed && styles.sourcePressed]}
            >
              <Text style={styles.barrierDetailNumber}>34%</Text>
              <Text style={styles.barrierDetailLabel}>FINANCIAL{`\n`}DILIGENCE</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

function FinaleStory({ compact, onRestart }: { compact: boolean; onRestart: () => void }) {
  const handleShare = async () => {
    try {
      await Share.share({
        message: 'My H2 2026 Music Finance Replay: stable prices, global growth, and mid-market energy. Explore the Duetti × Billboard Music Finance Index.',
      });
    } catch {
      // Web Share is not available in every desktop browser; the visual CTA remains useful in the MVP.
    }
  };

  return (
    <View style={styles.fill}>
      <View style={[styles.replayCard, compact && styles.replayCardCompact]}>
        <Text style={styles.replayKicker}>THE MARKET IN THREE TRACKS</Text>
        <Text style={[styles.replayTitle, compact && styles.replayTitleCompact]}>
          Stable prices.{`\n`}Global growth.{`\n`}Mid-market energy.
        </Text>
        <View style={styles.replayFooter}>
          <Text style={styles.replaySource}>MUSIC FINANCE INDEX · H2 2026</Text>
          <Text style={styles.replayMark}>d.</Text>
        </View>
      </View>
      <Text style={styles.finalNote}>
        Transparency starts when market data becomes understandable — and personally relevant.
      </Text>
      <Pressable
        accessibilityHint="Opens the complete H2 2026 Music Finance Index"
        accessibilityRole="link"
        onPress={() => openSource(sourceLinks.fullReport)}
        style={({ pressed }) => [styles.fullReportButton, pressed && styles.sourcePressed]}
      >
        <View>
          <Text style={styles.fullReportKicker}>DUETTI × BILLBOARD · H2 2026</Text>
          <Text style={styles.fullReportText}>Check out the full report</Text>
        </View>
        <View style={styles.fullReportArrow}>
          <Text style={styles.fullReportArrowText}>↗</Text>
        </View>
      </Pressable>
      <View style={styles.actionRow}>
        <Pressable onPress={handleShare} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
          <Text style={styles.primaryButtonText}>Share replay ↗</Text>
        </Pressable>
        <Pressable onPress={onRestart} style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
          <Text style={styles.secondaryButtonText}>Replay</Text>
        </Pressable>
      </View>
    </View>
  );
}

export function StoryContent({ story, compact, onRestart }: Props) {
  switch (story.kind) {
    case 'cover': return <CoverStory compact={compact} />;
    case 'mood': return <MoodStory compact={compact} />;
    case 'multiples': return <MultiplesStory compact={compact} />;
    case 'genres': return <GenresStory compact={compact} />;
    case 'regions': return <RegionsStory compact={compact} />;
    case 'deals': return <DealsStory compact={compact} />;
    case 'mechanics': return <MechanicsStory compact={compact} />;
    case 'barrier': return <BarrierStory compact={compact} />;
    case 'finale': return <FinaleStory compact={compact} onRestart={onRestart} />;
  }
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  bottomBlock: { marginTop: 'auto' },
  heroTitle: { color: palette.ink, fontFamily: type.display, fontSize: 55, letterSpacing: -3.7, lineHeight: 55 },
  heroTitleCompact: { fontSize: 43, letterSpacing: -3, lineHeight: 43 },
  storyTitleDark: { color: palette.ink, fontFamily: type.display, fontSize: 45, letterSpacing: -2.8, lineHeight: 45 },
  storyTitleLight: { color: palette.white, fontFamily: type.display, fontSize: 45, letterSpacing: -2.8, lineHeight: 45 },
  storyTitleCompact: { fontSize: 36, letterSpacing: -2.2, lineHeight: 36 },
  ledeDark: { color: palette.ink, fontFamily: type.regular, fontSize: 16, lineHeight: 23, marginTop: 22, maxWidth: 390 },
  ledeLight: { color: palette.white, fontFamily: type.regular, fontSize: 16, lineHeight: 23, marginTop: 22, maxWidth: 390 },
  coverOrb: { alignSelf: 'center', backgroundColor: palette.blue, borderRadius: 140, height: 280, marginTop: 10, position: 'relative', transform: [{ rotate: '-12deg' }], width: 280 },
  coverOrbCompact: { height: 210, width: 210 },
  yearSticker: { alignItems: 'center', backgroundColor: palette.lime, borderColor: palette.ink, borderRadius: 18, borderWidth: 2, flexDirection: 'row', gap: 8, paddingHorizontal: 15, paddingVertical: 9, position: 'absolute', right: -3, shadowColor: palette.ink, shadowOffset: { width: 5, height: 6 }, shadowOpacity: 0.22, shadowRadius: 0, top: 8, zIndex: 3 },
  yearStickerCompact: { borderRadius: 15, paddingHorizontal: 12, paddingVertical: 7, right: 0, top: 4 },
  yearDot: { backgroundColor: palette.coral, borderRadius: 5, height: 9, width: 9 },
  yearText: { color: palette.ink, fontFamily: type.display, fontSize: 31, letterSpacing: -2 },
  yearTextCompact: { fontSize: 25, letterSpacing: -1.5 },
  coverOrbInner: { borderColor: palette.lime, borderRadius: 110, borderWidth: 26, height: '72%', left: '14%', position: 'absolute', top: '14%', width: '72%' },
  coverOrbDot: { backgroundColor: palette.coral, borderRadius: 24, height: 48, position: 'absolute', right: -5, top: 42, width: 48 },
  hintRow: { alignItems: 'center', flexDirection: 'row', gap: 10, marginTop: 30 },
  hintLine: { backgroundColor: palette.ink, height: 1, width: 30 },
  hintText: { color: palette.ink, fontFamily: type.medium, fontSize: 10, letterSpacing: 1.3 },
  moodGraphic: { alignItems: 'center', alignSelf: 'center', justifyContent: 'center', marginTop: 4, minHeight: 326, position: 'relative', width: '100%' },
  moodGraphicCompact: { marginTop: 0, minHeight: 252 },
  moodRing: { borderColor: palette.lime, borderRadius: 160, borderWidth: 34, height: 310, position: 'absolute', transform: [{ rotate: '10deg' }], width: 310 },
  moodRingCompact: { borderRadius: 120, borderWidth: 26, height: 232, width: 232 },
  moodNumber: { color: palette.white, fontFamily: type.display, fontSize: 87, letterSpacing: -6.5, lineHeight: 94 },
  moodNumberCompact: { fontSize: 66, letterSpacing: -4.5, lineHeight: 72 },
  moodTag: { backgroundColor: palette.lime, borderRadius: radii.pill, color: palette.ink, fontFamily: type.display, fontSize: 9, letterSpacing: 1, paddingHorizontal: 13, paddingVertical: 7 },
  controlGroup: { marginTop: 22 },
  controlLabel: { color: palette.muted, fontFamily: type.medium, fontSize: 10, letterSpacing: 1.4, marginBottom: 8 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  chip: { borderColor: palette.ink, borderRadius: radii.pill, borderWidth: 1, paddingHorizontal: 13, paddingVertical: 8 },
  chipSelected: { backgroundColor: palette.ink },
  chipText: { color: palette.ink, fontFamily: type.medium, fontSize: 12 },
  chipTextSelected: { color: palette.white },
  pressed: { opacity: 0.68, transform: [{ scale: 0.98 }] },
  sourcePressed: { opacity: 0.72 },
  sourceCue: { alignItems: 'center', flexDirection: 'row', gap: 5, marginTop: 8 },
  sourceCueFloating: { bottom: 2, position: 'absolute', right: 2 },
  sourceDot: { backgroundColor: palette.ink, borderRadius: 3, height: 5, width: 5 },
  sourceDotLight: { backgroundColor: palette.white },
  sourceText: { color: palette.ink, fontFamily: type.medium, fontSize: 8, letterSpacing: 0.8 },
  sourceTextLight: { color: palette.white },
  multipleResult: { alignItems: 'flex-start', borderBottomColor: palette.ink, borderBottomWidth: 1, marginTop: 'auto', paddingBottom: 12 },
  multipleValue: { color: palette.coral, fontFamily: type.display, fontSize: 98, letterSpacing: -7, lineHeight: 102 },
  multipleValueCompact: { fontSize: 74, letterSpacing: -5, lineHeight: 78 },
  multipleMeta: { alignItems: 'flex-start', paddingBottom: 2 },
  multipleMetaTitle: { color: palette.muted, fontFamily: type.medium, fontSize: 9, letterSpacing: 1.1 },
  multipleMetaText: { color: palette.ink, fontFamily: type.medium, fontSize: 12, marginTop: 4 },
  disclaimer: { color: palette.muted, fontFamily: type.regular, fontSize: 10, lineHeight: 14, marginTop: 10 },
  genreStage: { alignItems: 'center', flex: 1, justifyContent: 'center', minHeight: 330, position: 'relative' },
  genreStageCompact: { minHeight: 260, transform: [{ scale: 0.86 }] },
  genreDisc: { alignItems: 'center', backgroundColor: palette.blue, borderRadius: 125, height: 250, justifyContent: 'center', transform: [{ rotate: '-7deg' }], width: 250 },
  genreNumber: { color: palette.white, fontFamily: type.display, fontSize: 70, letterSpacing: -5.5, lineHeight: 76 },
  genreNumberCompact: { fontSize: 59, letterSpacing: -4.5, lineHeight: 64 },
  genreName: { color: palette.lime, fontFamily: type.display, fontSize: 10, letterSpacing: 1.2 },
  genreOrbitOne: { alignItems: 'center', backgroundColor: palette.coral, borderRadius: 46, height: 92, justifyContent: 'center', position: 'absolute', right: 4, top: 36, transform: [{ rotate: '9deg' }], width: 92 },
  genreOrbitTwo: { alignItems: 'center', backgroundColor: palette.paper, borderRadius: 39, bottom: 25, height: 78, justifyContent: 'center', left: 6, position: 'absolute', transform: [{ rotate: '-9deg' }], width: 78 },
  orbitText: { color: palette.ink, fontFamily: type.display, fontSize: 11, lineHeight: 14, textAlign: 'center' },
  regionStack: { flex: 1, justifyContent: 'center', gap: 12 },
  regionBig: { backgroundColor: palette.lilac, borderRadius: radii.card, padding: 24, transform: [{ rotate: '-2deg' }] },
  regionBigValue: { color: palette.ink, fontFamily: type.display, fontSize: 96, letterSpacing: -7, lineHeight: 100 },
  regionBigValueCompact: { fontSize: 78, letterSpacing: -5.5, lineHeight: 82 },
  regionBigLabel: { color: palette.ink, fontFamily: type.medium, fontSize: 11, letterSpacing: 1.2, lineHeight: 16 },
  regionMover: { backgroundColor: palette.lime, borderRadius: 18, paddingHorizontal: 20, paddingVertical: 16, transform: [{ rotate: '1.5deg' }] },
  regionMoverLabel: { color: palette.muted, fontFamily: type.medium, fontSize: 9, letterSpacing: 1.2 },
  regionMoverValue: { color: palette.ink, fontFamily: type.display, fontSize: 21, letterSpacing: -0.8, marginTop: 4 },
  regionMoverValueCompact: { fontSize: 17, letterSpacing: -0.5 },
  dealComparison: { flex: 1, gap: 10, justifyContent: 'center', marginVertical: 18 },
  dealHeroCard: { backgroundColor: palette.paper, borderRadius: radii.card, padding: 20, transform: [{ rotate: '-1.5deg' }] },
  dealKicker: { color: palette.muted, fontFamily: type.medium, fontSize: 9, letterSpacing: 1.3 },
  dealMetricRow: { alignItems: 'flex-end', flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  dealHeroValue: { color: palette.blue, fontFamily: type.display, fontSize: 78, letterSpacing: -5.5, lineHeight: 84 },
  dealHeroValueCompact: { fontSize: 62, letterSpacing: -4.5, lineHeight: 68 },
  dealHeroBand: { color: palette.ink, fontFamily: type.display, fontSize: 21, letterSpacing: -1, marginBottom: 10 },
  dealDefinition: { borderTopColor: palette.hairline, borderTopWidth: 1, color: palette.muted, fontFamily: type.regular, fontSize: 10, lineHeight: 14, marginTop: 10, paddingTop: 10 },
  dealLargeCapCard: { alignItems: 'center', backgroundColor: palette.ink, borderRadius: 22, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 17, transform: [{ rotate: '1.5deg' }] },
  dealKickerLight: { color: palette.paper, fontFamily: type.medium, fontSize: 8, letterSpacing: 1.2, opacity: 0.7 },
  dealLargeCapBand: { color: palette.white, fontFamily: type.display, fontSize: 25, letterSpacing: -1.2, marginTop: 3 },
  dealLargeCapValue: { color: palette.lime, fontFamily: type.display, fontSize: 42, letterSpacing: -2.5 },
  dealTakeaway: { alignItems: 'center', flexDirection: 'row', gap: 12 },
  dealTakeawayMark: { backgroundColor: palette.ink, borderRadius: 5, height: 10, width: 10 },
  dealTakeawayText: { color: palette.ink, flex: 1, fontFamily: type.regular, fontSize: 12, lineHeight: 17 },
  splitMetrics: { flex: 1, gap: 10, justifyContent: 'center', marginVertical: 20 },
  splitMetricBlue: { backgroundColor: palette.blue, borderRadius: radii.card, minHeight: 160, overflow: 'hidden', padding: 20, position: 'relative', transform: [{ rotate: '-1.5deg' }] },
  splitMetricPaper: { backgroundColor: palette.paper, borderRadius: radii.card, minHeight: 160, overflow: 'hidden', padding: 20, position: 'relative', transform: [{ rotate: '1.5deg' }] },
  metricValue: { fontFamily: type.display, fontSize: 65, letterSpacing: -5, lineHeight: 68 },
  metricLabel: { fontFamily: type.medium, fontSize: 9, letterSpacing: 1.2, lineHeight: 13 },
  miniFundMark: { borderColor: palette.lime, borderRadius: 55, borderWidth: 18, height: 110, position: 'absolute', right: -16, top: 25, width: 110 },
  miniHandshake: { height: 80, position: 'absolute', right: 15, top: 40, width: 105 },
  handOne: { backgroundColor: palette.coral, borderRadius: 20, height: 38, left: 0, position: 'absolute', top: 15, transform: [{ rotate: '22deg' }], width: 72 },
  handTwo: { backgroundColor: palette.blue, borderRadius: 20, height: 38, position: 'absolute', right: 0, top: 22, transform: [{ rotate: '-22deg' }], width: 72 },
  barrierTop: { alignItems: 'center', flex: 1, justifyContent: 'center', position: 'relative' },
  gapLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, width: '100%' },
  gapLabel: { color: palette.white, fontFamily: type.medium, fontSize: 8, letterSpacing: 0.8, opacity: 0.82 },
  gapTrack: { flexDirection: 'row', gap: 34, width: '100%' },
  gapSeller: { backgroundColor: palette.coral, borderRadius: 6, flex: 1, height: 12 },
  gapBuyer: { backgroundColor: palette.white, borderRadius: 6, flex: 1, height: 12 },
  barrierNumber: { color: palette.white, fontFamily: type.display, fontSize: 132, letterSpacing: -11 },
  barrierNumberCompact: { fontSize: 104 },
  barrierMetricLabel: { color: palette.coral, fontFamily: type.medium, fontSize: 9, letterSpacing: 1.2, marginTop: -10 },
  barrierDetails: { marginTop: 20 },
  barrierDetailsTitle: { color: palette.white, fontFamily: type.medium, fontSize: 9, letterSpacing: 1.1, marginBottom: 8, opacity: 0.82 },
  barrierDetailRow: { flexDirection: 'row', gap: 8 },
  barrierDetailCard: { alignItems: 'center', backgroundColor: palette.lime, borderRadius: 15, flex: 1, flexDirection: 'row', gap: 10, paddingHorizontal: 13, paddingVertical: 11 },
  barrierDetailNumber: { color: palette.ink, fontFamily: type.display, fontSize: 25, letterSpacing: -1.5 },
  barrierDetailLabel: { color: palette.ink, fontFamily: type.medium, fontSize: 8, letterSpacing: 0.5, lineHeight: 10 },
  replayCard: { backgroundColor: palette.blue, borderRadius: radii.card, flex: 1, justifyContent: 'space-between', maxHeight: 470, minHeight: 390, overflow: 'hidden', padding: 24, position: 'relative' },
  replayCardCompact: { maxHeight: 350, minHeight: 300, padding: 20 },
  replayKicker: { color: palette.lime, fontFamily: type.medium, fontSize: 9, letterSpacing: 1.4 },
  replayTitle: { color: palette.white, fontFamily: type.display, fontSize: 45, letterSpacing: -3, lineHeight: 47 },
  replayTitleCompact: { fontSize: 36, lineHeight: 38 },
  replayFooter: { alignItems: 'flex-end', flexDirection: 'row', justifyContent: 'space-between' },
  replaySource: { color: palette.white, fontFamily: type.medium, fontSize: 8, letterSpacing: 1 },
  replayMark: { color: palette.lime, fontFamily: type.display, fontSize: 36, letterSpacing: -2 },
  finalNote: { color: palette.ink, fontFamily: type.regular, fontSize: 13, lineHeight: 19, marginTop: 16 },
  fullReportButton: { alignItems: 'center', backgroundColor: palette.brandGreen, borderRadius: 20, flexDirection: 'row', justifyContent: 'space-between', marginTop: 13, paddingHorizontal: 17, paddingVertical: 13 },
  fullReportKicker: { color: palette.lime, fontFamily: type.medium, fontSize: 8, letterSpacing: 1.1 },
  fullReportText: { color: palette.white, fontFamily: type.display, fontSize: 17, letterSpacing: -0.6, marginTop: 3 },
  fullReportArrow: { alignItems: 'center', backgroundColor: palette.lime, borderRadius: 19, height: 38, justifyContent: 'center', width: 38 },
  fullReportArrowText: { color: palette.ink, fontFamily: type.display, fontSize: 18 },
  actionRow: { flexDirection: 'row', gap: 8, marginTop: 15 },
  primaryButton: { backgroundColor: palette.ink, borderRadius: radii.pill, paddingHorizontal: 18, paddingVertical: 12 },
  primaryButtonText: { color: palette.white, fontFamily: type.medium, fontSize: 12 },
  secondaryButton: { borderColor: palette.ink, borderRadius: radii.pill, borderWidth: 1, paddingHorizontal: 18, paddingVertical: 12 },
  secondaryButtonText: { color: palette.ink, fontFamily: type.medium, fontSize: 12 },
});
