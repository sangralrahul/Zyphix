import { NativeTabs } from 'expo-router/native-tabs';

import { useCart } from '@/lib/cart';
import { C } from '@/lib/theme';

/** Five native tabs (Android allows at most five). Detail screens push on the root stack above the tabs. */
export default function AppTabs() {
  const cart = useCart();
  return (
    <NativeTabs tintColor={C.green} disableTransparentOnScrollEdge>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'house', selected: 'house.fill' }} md="home" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="now">
        <NativeTabs.Trigger.Label>Now</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'basket', selected: 'basket.fill' }} md="shopping_basket" />
        {cart.count('now') > 0 && <NativeTabs.Trigger.Badge>{String(Math.min(cart.count('now'), 99))}</NativeTabs.Trigger.Badge>}
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="eats">
        <NativeTabs.Trigger.Label>Eats</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'fork.knife', selected: 'fork.knife' }} md="restaurant" />
        {cart.count('eats') > 0 && <NativeTabs.Trigger.Badge>{String(Math.min(cart.count('eats'), 99))}</NativeTabs.Trigger.Badge>}
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="book">
        <NativeTabs.Trigger.Label>Book</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'wrench.and.screwdriver', selected: 'wrench.and.screwdriver.fill' }} md="home_repair_service" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="account">
        <NativeTabs.Trigger.Label>Account</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'person.crop.circle', selected: 'person.crop.circle.fill' }} md="account_circle" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
