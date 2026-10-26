import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View, type TextInputInstance } from 'react-native';
import Animated, { FadeIn, FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Logo } from '@/components/account/Logo';
import { noOutline, openLink } from '@/components/account/kit';
import { Ico, K } from '@/components/kit';
import { Button } from '@/components/ui';
import { MENU } from '@/data/eats';
import { Api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { C } from '@/lib/theme';

const RESEND = 45;
type Step = 'email' | 'code' | 'name';
const BAND = 330;

/** One real TextInput under six boxes: paste, SMS/email autofill and backspace all just work. */
function OtpBoxes({ value, onChange, error, disabled }: { value: string; onChange: (v: string) => void; error?: boolean; disabled?: boolean }) {
  const ref = useRef<TextInputInstance>(null);
  const [focused, setFocused] = useState(true);
  return (
    <Pressable onPress={() => ref.current?.focus()} style={st.otpRow} accessibilityLabel="6-digit code">
      {Array.from({ length: 6 }, (_, i) => {
        const ch = value[i] ?? '';
        const active = focused && (i === value.length || (i === 5 && value.length === 6));
        return (
          <View key={i} style={[st.box, ch && { borderColor: '#9CA3AF', backgroundColor: '#fff' }, active && { borderColor: C.green, borderWidth: 2, backgroundColor: '#fff' }, error && { borderColor: C.red }]}>
            <Text style={st.boxTxt}>{ch}</Text>
          </View>
        );
      })}
      <TextInput ref={ref} value={value} autoFocus editable={!disabled}
        onChangeText={t => onChange(t.replace(/\D/g, '').slice(0, 6))}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        keyboardType="number-pad" textContentType="oneTimeCode" autoComplete="one-time-code" maxLength={6}
        caretHidden style={st.hiddenInput} accessibilityLabel="Enter the 6-digit code" />
    </Pressable>
  );
}

/** Tilted collage of real product photos (Zepto login). Falls back to dish photos offline. */
function Collage() {
  const q = useQuery({ queryKey: ['products', 'signin-collage'], queryFn: () => Api.products({ limit: 60 }), staleTime: 10 * 60_000 });
  const imgs = useMemo(() => {
    const real = (q.data ?? []).filter(p => p.imageStatus === 'ready' && p.image).map(p => ({ uri: p.image, contain: true }));
    const pool = real.length >= 8 ? real : [...real, ...MENU.map(m => ({ uri: m.image, contain: false }))];
    return pool.slice(0, 18);
  }, [q.data]);
  const rows = [imgs.slice(0, 6), imgs.slice(6, 12), imgs.slice(12, 18)];
  return (
    <View style={st.collage} pointerEvents="none">
      {rows.map((row, r) => (
        <View key={r} style={{ flexDirection: 'row', gap: 12, marginLeft: r % 2 ? -46 : 0 }}>
          {row.map((im, i) => (
            <Animated.View key={i} entering={FadeIn.delay(80 * (r * 6 + i)).duration(400)} style={st.tile}>
              <Image source={im.uri} style={{ width: '100%', height: '100%', borderRadius: im.contain ? 0 : 14 }} contentFit={im.contain ? 'contain' : 'cover'} transition={200} />
            </Animated.View>
          ))}
        </View>
      ))}
    </View>
  );
}

export default function SignIn() {
  const insets = useSafeAreaInsets();
  const { requestCode, verify, updateProfile } = useAuth();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [token, setToken] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [left, setLeft] = useState(0);
  const [focus, setFocus] = useState(false);

  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft(l => l - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);

  const emailOk = /^\S+@\S+\.\S+$/.test(email.trim());

  async function send() {
    if (!emailOk) { setErr('Enter a valid email address'); return; }
    setErr(null); setBusy(true);
    try {
      setToken(await requestCode(email));
      setCode(''); setStep('code'); setLeft(RESEND);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Could not send the code. Try again.');
    } finally { setBusy(false); }
  }

  async function check(c: string) {
    if (c.length !== 6 || busy) return;
    setErr(null); setBusy(true);
    try {
      const u = await verify(email, c, token);
      if (!u.name?.trim()) setStep('name');
      else router.back();
    } catch (e) {
      setErr(e instanceof Error && e.message ? e.message : 'That code didn’t work. Check it and try again.');
      setCode('');
    } finally { setBusy(false); }
  }

  async function saveName() {
    if (name.trim().length < 2) { setErr('Enter your name'); return; }
    setErr(null); setBusy(true);
    try { await updateProfile({ name: name.trim() }); router.back(); }
    catch (e) { setErr(e instanceof Error ? e.message : 'Could not save. Try again.'); }
    finally { setBusy(false); }
  }

  const topPad = Platform.OS === 'ios' ? 0 : insets.top;

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#fff' }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar style="light" />
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1, paddingBottom: insets.bottom + 16 }} bounces={false} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={K.band} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[st.band, { height: BAND + topPad }]}>
          <Collage />
          <LinearGradient colors={['rgba(11,154,95,0)', 'rgba(11,154,95,.9)', '#0B9A5F']} locations={[0, 0.55, 1]} style={[StyleSheet.absoluteFill, { top: '38%' }]} />
          <Pressable onPress={() => router.back()} hitSlop={10} accessibilityRole="button" accessibilityLabel="Close" style={[st.close, { top: topPad + 14 }]}>
            <Ico name="close" size={20} color="#fff" />
          </Pressable>
          <View style={{ alignItems: 'center', gap: 10 }}>
            <Logo size={64} ring />
            <Text style={st.word}>zyphix</Text>
            <View style={st.tagPill}><Ico name="flash" size={12} color="#FDE68A" /><Text style={st.tagTxt}>THE SUPERLOCAL APP</Text></View>
          </View>
        </LinearGradient>

        <View style={st.sheet}>
          <Animated.View key={step} entering={FadeInRight.duration(240)} exiting={FadeOutLeft.duration(150)} style={{ gap: 16 }}>
            {step === 'email' && (
              <>
                <View style={{ alignItems: 'center' }}>
                  <Text style={st.h}>Groceries, food & services{'\n'}in minutes</Text>
                  <Text style={st.sub}>Log in or sign up with your email</Text>
                </View>
                <View>
                  <View style={[st.input, focus && { borderColor: C.green }, !!err && { borderColor: C.red }]}>
                    <Ico name="mail-outline" size={20} color={focus ? C.green : K.meta} />
                    <TextInput value={email} onChangeText={t => { setEmail(t); setErr(null); }} autoFocus placeholder="Enter your email address" placeholderTextColor="#9CA3AF"
                      onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
                      keyboardType="email-address" autoCapitalize="none" autoCorrect={false} autoComplete="email" textContentType="emailAddress"
                      returnKeyType="send" onSubmitEditing={send} style={st.inputTxt} accessibilityLabel="Email" />
                  </View>
                  {err ? <Text style={st.err}>{err}</Text> : null}
                </View>
                <Button title="Continue" onPress={send} loading={busy} disabled={!emailOk} style={st.cta} />
                <Text style={st.note}>No password needed — we email you a 6-digit code.</Text>
              </>
            )}
            {step === 'code' && (
              <>
                <View style={{ alignItems: 'center' }}>
                  <Text style={st.h}>Enter verification code</Text>
                  <Text style={st.sub}>Sent to <Text style={{ color: K.ink, fontWeight: '800' }}>{email.trim().toLowerCase()}</Text></Text>
                  <Pressable onPress={() => { setStep('email'); setErr(null); }} hitSlop={8} style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 }} accessibilityRole="button">
                    <Ico name="create-outline" size={14} color={C.green} /><Text style={{ color: C.green, fontWeight: '800', fontSize: 13 }}>Change email</Text>
                  </Pressable>
                </View>
                <OtpBoxes value={code} error={!!err} disabled={busy} onChange={v => { setCode(v); setErr(null); if (v.length === 6) check(v); }} />
                {err ? <Text style={[st.err, { textAlign: 'center' }]}>{err}</Text> : null}
                <Button title="Verify & continue" onPress={() => check(code)} loading={busy} disabled={code.length !== 6} style={st.cta} />
                <Pressable disabled={left > 0 || busy} onPress={send} style={{ alignSelf: 'center', padding: 6 }} accessibilityRole="button">
                  <Text style={{ fontSize: 14, fontWeight: '800', color: left > 0 ? '#9CA3AF' : C.green }}>
                    {left > 0 ? `Resend code in 0:${String(left).padStart(2, '0')}` : 'Resend code'}
                  </Text>
                </Pressable>
                <Text style={st.note}>Can&apos;t find it? Check spam or promotions.</Text>
              </>
            )}
            {step === 'name' && (
              <>
                <View style={{ alignItems: 'center' }}>
                  <View style={st.done}><Ico name="checkmark" size={26} color="#fff" /></View>
                  <Text style={[st.h, { marginTop: 10 }]}>You&apos;re in! What&apos;s your name?</Text>
                  <Text style={st.sub}>So riders and pros know who to ask for.</Text>
                </View>
                <View>
                  <View style={[st.input, focus && { borderColor: C.green }, !!err && { borderColor: C.red }]}>
                    <Ico name="person-outline" size={20} color={focus ? C.green : K.meta} />
                    <TextInput value={name} onChangeText={t => { setName(t); setErr(null); }} autoFocus placeholder="Your full name" placeholderTextColor="#9CA3AF"
                      onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
                      autoComplete="name" textContentType="name" returnKeyType="done" onSubmitEditing={saveName} style={st.inputTxt} accessibilityLabel="Your name" />
                  </View>
                  {err ? <Text style={st.err}>{err}</Text> : null}
                </View>
                <Button title="Continue" onPress={saveName} loading={busy} style={st.cta} />
                <Pressable onPress={() => router.back()} style={{ alignSelf: 'center', padding: 6 }}><Text style={{ fontSize: 14, fontWeight: '700', color: K.meta }}>Skip for now</Text></Pressable>
              </>
            )}
          </Animated.View>
          <Text style={st.terms}>
            By continuing, you agree to our{' '}
            <Text style={st.link} onPress={() => openLink('https://zyphix.in/terms')}>Terms of Service</Text> &{' '}
            <Text style={st.link} onPress={() => openLink('https://zyphix.in/privacy')}>Privacy Policy</Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const st = StyleSheet.create({
  band: { justifyContent: 'flex-end', paddingBottom: 46, overflow: 'hidden' },
  collage: { position: 'absolute', top: -30, left: -40, right: -40, gap: 12, transform: [{ rotate: '-10deg' }], opacity: 0.95 },
  tile: { width: 84, height: 84, borderRadius: 18, backgroundColor: '#fff', padding: 8, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  close: { position: 'absolute', right: 16, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,.28)', alignItems: 'center', justifyContent: 'center' },
  word: { color: '#fff', fontSize: 32, fontWeight: '900', letterSpacing: -1 },
  tagPill: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(0,0,0,.18)', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4, marginTop: -4 },
  tagTxt: { color: '#fff', fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  sheet: { flex: 1, backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, marginTop: -26, paddingHorizontal: 20, paddingTop: 26 },
  h: { fontSize: 22, lineHeight: 27, fontWeight: '900', color: K.ink, textAlign: 'center', letterSpacing: -0.5 },
  sub: { fontSize: 14, color: K.meta, marginTop: 6, textAlign: 'center' },
  input: { height: 56, borderRadius: 14, borderWidth: 1.5, borderColor: '#DDE1E7', backgroundColor: '#FAFBFC', flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16 },
  inputTxt: { flex: 1, fontSize: 16, color: K.ink, height: '100%', fontWeight: '500', ...noOutline },
  cta: { height: 54, borderRadius: 14 },
  note: { fontSize: 12.5, color: '#9CA3AF', textAlign: 'center' },
  err: { color: C.red, fontSize: 13, marginTop: 6, fontWeight: '600' },
  otpRow: { flexDirection: 'row', justifyContent: 'center', gap: 8 },
  box: { flex: 1, maxWidth: 50, height: 56, borderRadius: 12, borderWidth: 1.5, borderColor: '#DDE1E7', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAFBFC' },
  boxTxt: { fontSize: 24, fontWeight: '800', color: K.ink },
  hiddenInput: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.011, color: 'transparent', fontSize: 1 },
  done: { width: 52, height: 52, borderRadius: 26, backgroundColor: C.green, alignItems: 'center', justifyContent: 'center' },
  terms: { fontSize: 12, lineHeight: 17, color: '#9CA3AF', textAlign: 'center', marginTop: 'auto', paddingTop: 24, paddingHorizontal: 12 },
  link: { color: '#4B5563', fontWeight: '700', textDecorationLine: 'underline' },
});
