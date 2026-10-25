import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View, type TextInputInstance } from 'react-native';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Field } from '@/components/account/kit';
import { Button, VideoBg } from '@/components/ui';
import { CLIPS } from '@/data/media';
import { useAuth } from '@/lib/auth';
import { C, R, S, T } from '@/lib/theme';

const RESEND = 45;
type Step = 'email' | 'code' | 'name';

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
          <View key={i} style={[st.box, ch && { borderColor: C.text }, active && { borderColor: C.green, borderWidth: 2 }, error && { borderColor: C.red }]}>
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

  const title = step === 'email' ? <>Sign in to <Text style={[T.accent, { color: C.mint }]}>Zyphix</Text></>
    : step === 'code' ? <>Check your <Text style={[T.accent, { color: C.mint }]}>inbox</Text></>
    : <>What should we <Text style={[T.accent, { color: C.mint }]}>call</Text> you?</>;

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: C.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar style="light" />
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1, paddingBottom: insets.bottom + S.xl }} bounces={false}>
        <View style={[st.band, { paddingTop: Platform.OS === 'ios' ? S.x4 : insets.top + S.x4 }]}>
          <VideoBg clip={CLIPS.doorHandoff} dim={0.35} />
          <LinearGradient colors={['rgba(5,8,14,.2)', 'rgba(5,8,14,.85)']} style={StyleSheet.absoluteFill} />
          <Pressable onPress={() => router.back()} hitSlop={10} accessibilityRole="button" accessibilityLabel="Close"
            style={[st.close, { top: (Platform.OS === 'ios' ? 0 : insets.top) + 14 }]}>
            <Text style={{ color: C.white, fontSize: 16, fontWeight: '700' }}>✕</Text>
          </Pressable>
          <Text style={st.kicker}>THE SUPERLOCAL APP</Text>
          <Text style={[T.h1, { color: C.white, fontSize: 32, lineHeight: 36 }]}>{title}</Text>
        </View>

        <Animated.View key={step} entering={FadeInRight.duration(260)} exiting={FadeOutLeft.duration(160)} style={st.body}>
          {step === 'email' && (
            <>
              <Text style={[T.body, { color: C.text2 }]}>Enter your email and we&apos;ll send you a 6-digit code. New here? This creates your account.</Text>
              <Field label="Email" value={email} onChangeText={t => { setEmail(t); setErr(null); }} error={err} autoFocus
                keyboardType="email-address" autoCapitalize="none" autoCorrect={false} autoComplete="email" textContentType="emailAddress"
                returnKeyType="send" onSubmitEditing={send} placeholder="you@example.com" />
              <Button title="Send code" onPress={send} loading={busy} disabled={!emailOk} />
            </>
          )}
          {step === 'code' && (
            <>
              <Text style={[T.body, { color: C.text2 }]}>
                We sent a code to <Text style={{ color: C.text, fontWeight: '600' }}>{email.trim().toLowerCase()}</Text>.{' '}
                <Text style={{ color: C.green, fontWeight: '600' }} onPress={() => { setStep('email'); setErr(null); }}>Change</Text>
              </Text>
              <OtpBoxes value={code} error={!!err} disabled={busy} onChange={v => { setCode(v); setErr(null); if (v.length === 6) check(v); }} />
              {err ? <Text style={st.err}>{err}</Text> : null}
              <Button title="Verify" onPress={() => check(code)} loading={busy} disabled={code.length !== 6} />
              <Pressable disabled={left > 0 || busy} onPress={send} style={{ alignSelf: 'center', padding: 10 }} accessibilityRole="button">
                <Text style={[T.bodyStrong, { color: left > 0 ? C.text3 : C.green }]}>
                  {left > 0 ? `Resend code in 0:${String(left).padStart(2, '0')}` : 'Resend code'}
                </Text>
              </Pressable>
              <Text style={[T.small, { color: C.text3, textAlign: 'center' }]}>Can&apos;t find it? Check spam or promotions.</Text>
            </>
          )}
          {step === 'name' && (
            <>
              <Text style={[T.body, { color: C.text2 }]}>You&apos;re signed in. Add your name so pros and riders know who to ask for.</Text>
              <Field label="Your name" value={name} onChangeText={t => { setName(t); setErr(null); }} error={err} autoFocus
                autoComplete="name" textContentType="name" returnKeyType="done" onSubmitEditing={saveName} />
              <Button title="Continue" onPress={saveName} loading={busy} />
              <Pressable onPress={() => router.back()} style={{ alignSelf: 'center', padding: 10 }}><Text style={[T.bodyStrong, { color: C.text2 }]}>Skip for now</Text></Pressable>
            </>
          )}
        </Animated.View>
        <Text style={[T.small, { color: C.text3, textAlign: 'center', paddingHorizontal: S.xxl, marginTop: 'auto' }]}>
          By continuing you agree to Zyphix&apos;s Terms and Privacy Policy.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const st = StyleSheet.create({
  band: { height: 260, justifyContent: 'flex-end', paddingHorizontal: S.xl, paddingBottom: S.xxl, backgroundColor: C.ink, overflow: 'hidden' },
  close: { position: 'absolute', right: S.lg, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,.18)', alignItems: 'center', justifyContent: 'center' },
  kicker: { color: C.mint, fontWeight: '800', fontSize: 12, letterSpacing: 1.6, marginBottom: 8 },
  body: { padding: S.xl, gap: S.lg },
  otpRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8, marginTop: 4 },
  box: { flex: 1, maxWidth: 52, aspectRatio: 0.86, borderRadius: R.md, borderWidth: 1.5, borderColor: C.line, alignItems: 'center', justifyContent: 'center', backgroundColor: C.bgSoft },
  boxTxt: { fontSize: 24, fontWeight: '700', color: C.text },
  hiddenInput: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.011, color: 'transparent', fontSize: 1 },
  err: { color: C.red, fontSize: 13, marginTop: -6 },
});
