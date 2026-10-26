import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Ico, K } from '@/components/kit';

/** Simple bottom sheet (modal + slide-up card) used for filters and the menu jump list. */
export function Sheet({ visible, onClose, title, children, footer }: { visible: boolean; onClose: () => void; title?: string; children: React.ReactNode; footer?: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      {visible ? (
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <Animated.View entering={FadeIn.duration(160)} style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(11,15,25,.55)' }]}>
            <Pressable style={{ flex: 1 }} onPress={onClose} accessibilityLabel="Close" />
          </Animated.View>
          <Animated.View entering={SlideInDown.springify().damping(22).stiffness(220)} style={[sh.card, { paddingBottom: footer ? 0 : insets.bottom + 12 }]}>
            {title ? (
              <View style={sh.head}>
                <Text style={sh.title}>{title}</Text>
                <Pressable onPress={onClose} hitSlop={10} style={sh.close} accessibilityRole="button" accessibilityLabel="Close"><Ico name="close" size={18} color={K.ink} /></Pressable>
              </View>
            ) : null}
            {children}
            {footer ? <View style={[sh.footer, { paddingBottom: insets.bottom + 12 }]}>{footer}</View> : null}
          </Animated.View>
        </View>
      ) : null}
    </Modal>
  );
}

const sh = StyleSheet.create({
  card: { backgroundColor: '#fff', borderTopLeftRadius: 22, borderTopRightRadius: 22, maxHeight: '88%', overflow: 'hidden' },
  head: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingTop: 18, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: K.line },
  title: { flex: 1, fontSize: 18, fontWeight: '800', color: K.ink },
  close: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F1F3F6', alignItems: 'center', justifyContent: 'center' },
  footer: { flexDirection: 'row', gap: 12, paddingHorizontal: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: K.line, backgroundColor: '#fff' },
});
