/* ────────────────────────────────────────────────────────────────────────────
   support.zyphix.in — help centre content. Typed so pages can filter, search
   and render consistently. Keep answers factual: policies below mirror what
   the product pages promise (30-min delivery target, free delivery on bigger baskets,
   free cancellation windows, 7-day work guarantee on Book).
──────────────────────────────────────────────────────────────────────────── */

export type TopicId = 'now' | 'eats' | 'book' | 'partners' | 'account' | 'refunds';

export type Topic = {
  id: TopicId;
  title: string;
  short: string;
  blurb: string;
  /** Key into PHOTOS (src/data/media.ts) for the topic tile. */
  photo: string;
  /** Deep link into the product for "quick actions". */
  product?: { label: string; href: string };
};

export type Block =
  | { type: 'p'; text: string }
  | { type: 'h'; text: string }
  | { type: 'steps'; items: string[] }
  | { type: 'list'; items: string[] }
  | { type: 'note'; text: string };

export type Article = {
  slug: string;
  topic: TopicId;
  title: string;
  summary: string;
  keywords?: string[];
  updated: string; // YYYY-MM-DD
  body: Block[];
  related?: string[];
};

export const TOPICS: Topic[] = [
  { id: 'now', title: 'Zyphix Now orders', short: 'Now orders', blurb: 'Groceries and essentials in 30 minutes: tracking, delivery fees, missing items.', photo: 'grocery', product: { label: 'Open my Now orders', href: 'https://now.zyphix.in/account' } },
  { id: 'eats', title: 'Zyphix Eats', short: 'Eats', blurb: 'Food orders from restaurants near you: late deliveries, wrong items, restaurant hours.', photo: 'restaurant', product: { label: 'Open Zyphix Eats', href: 'https://eats.zyphix.in' } },
  { id: 'book', title: 'Zyphix Book', short: 'Book', blurb: 'Home services from verified professionals: slots, rescheduling, the work guarantee.', photo: 'cleaning', product: { label: 'Open Zyphix Book', href: 'https://book.zyphix.in' } },
  { id: 'partners', title: 'Partners & payouts', short: 'Partners', blurb: 'Stores, restaurants, professionals and delivery partners: onboarding, verification, payouts.', photo: 'team', product: { label: 'Partner portal', href: 'https://partner.zyphix.in' } },
  { id: 'account', title: 'Account & payments', short: 'Account', blurb: 'Sign-in codes, addresses, payment methods, coupons and deleting your account.', photo: 'people', product: { label: 'Manage my account', href: 'https://now.zyphix.in/account' } },
  { id: 'refunds', title: 'Refunds & cancellations', short: 'Refunds', blurb: 'When you can cancel for free, how refunds are issued and how long they take.', photo: 'rider' },
];

export const topicById = (id: string) => TOPICS.find(t => t.id === id);

const p = (text: string): Block => ({ type: 'p', text });
const h = (text: string): Block => ({ type: 'h', text });
const steps = (...items: string[]): Block => ({ type: 'steps', items });
const list = (...items: string[]): Block => ({ type: 'list', items });
const note = (text: string): Block => ({ type: 'note', text });

export const ARTICLES: Article[] = [
  /* ── Zyphix Now ─────────────────────────────────────────────────────── */
  {
    slug: 'track-an-order', topic: 'now', title: 'Tracking a Zyphix Now order', updated: '2026-10-20',
    summary: 'See where your order is, from the store packing it to the rider at your gate.',
    keywords: ['track', 'where is my order', 'rider', 'live location', 'status'],
    body: [
      p('Every Zyphix Now order moves through four statuses: Confirmed, Packing, On the way and Delivered. You can watch it move in real time from your account.'),
      steps('Open now.zyphix.in/account (or the Orders tab in the app).', 'Tap the order at the top of the list; the newest order is always first.', 'The status bar shows the current step. Once a rider is assigned, their name and a live map appear below it.', 'Use "Call rider" if you need to share a gate code or landmark.'),
      p('Our target is 30 minutes from confirmation. The promised time on the order page already accounts for the store\'s packing time and the distance to you.'),
      note('If the page shows "Confirmed" for more than 10 minutes, the store has not yet accepted the order. You can cancel at no charge until it moves to Packing.'),
    ],
    related: ['late-delivery', 'missing-or-damaged-item'],
  },
  {
    slug: 'late-delivery', topic: 'now', title: 'My order is late', updated: '2026-10-20',
    summary: 'What happens when an order runs past its promised time, and what you can do.',
    keywords: ['late', 'delayed', 'delay', 'slow', '30 minutes'],
    body: [
      p('Most orders arrive within 30 minutes. Heavy rain, road closures and a store running short-staffed can push that out. When it does, the promised time on your order page updates and we send a notification.'),
      h('If the order is more than 15 minutes past the promised time'),
      list('You can cancel from the order page without any charge, even if the rider has already picked it up.', 'If you keep the order, any delivery fee on it is refunded to your original payment method automatically within 24 hours.', 'Riders are never penalised for safe riding; we would rather an order be late than unsafe.'),
      h('If the status has not changed for a long time'),
      p('Tap "Help with this order" on the order page. Support can see the rider\'s last location and will call the store or rider for you.'),
    ],
    related: ['track-an-order', 'cancel-an-order'],
  },
  {
    slug: 'missing-or-damaged-item', topic: 'now', title: 'An item is missing, wrong or damaged', updated: '2026-10-18',
    summary: 'Report the item from the order page within 24 hours and we refund it to your original payment method or wallet.',
    keywords: ['missing', 'damaged', 'wrong item', 'broken', 'spilled', 'expired'],
    body: [
      p('Stores pack orders by hand, so occasionally an item is missed, swapped or arrives damaged. You do not need to call anyone; report it from the order and we handle the rest.'),
      steps('Open the order in your account and tap "Help with this order".', 'Choose "Item missing", "Wrong item" or "Damaged / expired".', 'Select the affected items. For damaged or expired items, add a photo; it speeds up the review.', 'Submit. You will get a confirmation in the app and by email.'),
      h('What you get back'),
      list('Missing items: refunded in full, including any tax on them.', 'Wrong items: refunded in full. Keep the item; no return is needed.', 'Damaged or expired: refunded in full once the photo is reviewed, usually within 2 hours during store hours.'),
      p('Refunds go to your original payment method (3–5 working days) or instantly to your Zyphix wallet if you choose that option. Cash orders are refunded to the wallet.'),
      note('Reports must be made within 24 hours of delivery. For perishables, please report on the same day.'),
    ],
    related: ['refund-timeline', 'track-an-order'],
  },
  {
    slug: 'delivery-fees-and-minimums', topic: 'now', title: 'Delivery fees and free delivery', updated: '2026-10-15',
    summary: 'Bigger baskets are delivered free. Below the threshold, the fee is shown at checkout before you pay.',
    keywords: ['delivery fee', 'free delivery', '199', 'charges', 'minimum order'],
    body: [
      p('There is no minimum order on Zyphix Now. Baskets at or above the free-delivery threshold are delivered free; your cart shows the threshold and how much more you need to add. Below it, a small delivery fee applies and is shown on the checkout page before you confirm.'),
      list('No surge pricing, in rain or at peak hours.', 'No handling or packaging charge.', 'Prices are the store\'s own shelf prices; we do not mark them up.'),
      p('Coupons are applied before the threshold is checked, so a coupon that drops your cart below the threshold may add a delivery fee. Checkout always shows the final total before you pay.'),
    ],
    related: ['coupons-and-offers'],
  },

  /* ── Zyphix Eats ────────────────────────────────────────────────────── */
  {
    slug: 'eats-order-late-or-cold', topic: 'eats', title: 'My food order is late or arrived cold', updated: '2026-10-19',
    summary: 'Restaurants set their own prep times; here is what we do when an order runs late or arrives in poor condition.',
    keywords: ['late food', 'cold', 'eats late', 'restaurant delay'],
    body: [
      p('Each restaurant sets a preparation time and the order page shows an estimated arrival that includes it. On busy evenings a kitchen can run behind; when that happens the estimate updates and we notify you.'),
      h('If it is more than 20 minutes past the estimate'),
      list('You can cancel at no charge from the order page until the rider picks it up.', 'If you keep the order, the delivery fee is refunded automatically.'),
      h('If the food arrived cold, spilled or incomplete'),
      p('Tap "Help with this order", choose the issue and add a photo. Support reviews it with the restaurant and refunds the affected items, usually within 2 hours during restaurant hours.'),
    ],
    related: ['eats-wrong-item', 'refund-timeline'],
  },
  {
    slug: 'eats-wrong-item', topic: 'eats', title: 'I received the wrong dish or a missing item', updated: '2026-10-19',
    summary: 'Report it from the order within 24 hours; you are refunded for the affected items.',
    keywords: ['wrong dish', 'missing dish', 'wrong order', 'eats missing'],
    body: [
      steps('Open the order at eats.zyphix.in or in the app and tap "Help with this order".', 'Select "Missing item" or "Wrong item" and tick the dishes affected.', 'Add a photo of what you received if it was the wrong dish.', 'Submit. Keep whatever was delivered; nothing needs to be returned.'),
      p('Refunds for missing or wrong dishes are issued in full, to your original payment method or instantly to your Zyphix wallet.'),
      note('Customisations the restaurant missed (less spicy, no onion) are reviewed case by case; add a note in the report.'),
    ],
    related: ['eats-order-late-or-cold', 'refund-timeline'],
  },
  {
    slug: 'eats-restaurant-hours-and-availability', topic: 'eats', title: 'Why a restaurant shows as closed or unavailable', updated: '2026-10-10',
    summary: 'Restaurants control their own hours and can pause orders when the kitchen is full.',
    keywords: ['closed', 'unavailable', 'restaurant not showing', 'hours'],
    body: [
      p('A restaurant appears as closed when it is outside the hours it set, or when the owner has paused new orders because the kitchen is at capacity. Pauses usually last 15–30 minutes.'),
      p('If a restaurant you expect to see is missing entirely, it may be outside the delivery radius for your address, or it may not have joined Zyphix Eats yet. Restaurants can register free at partner.zyphix.in.'),
    ],
    related: ['restaurant-onboarding'],
  },

  /* ── Zyphix Book ────────────────────────────────────────────────────── */
  {
    slug: 'book-reschedule-or-cancel', topic: 'book', title: 'Rescheduling or cancelling a service booking', updated: '2026-10-21',
    summary: 'Reschedule free any time; cancel free up to 1 hour before the slot.',
    keywords: ['reschedule', 'cancel booking', 'change slot', 'book cancel'],
    body: [
      p('Plans change. On Zyphix Book you can move a booking to another slot as often as you need, at no cost.'),
      steps('Open the booking from your account.', 'Tap "Reschedule" and pick a new day and slot.', 'The professional is notified instantly. If they cannot make the new slot, we assign another verified pro.'),
      h('Cancelling'),
      list('More than 1 hour before the slot: free.', 'Within 1 hour of the slot, or after the professional has arrived: the visit charge shown at booking applies.'),
    ],
    related: ['book-late-professional', 'book-work-guarantee'],
  },
  {
    slug: 'book-late-professional', topic: 'book', title: 'The professional is late or has not arrived', updated: '2026-10-21',
    summary: 'We notify you when a pro is running behind. More than 30 minutes late: a credit on the visit charge, or reschedule or cancel free.',
    keywords: ['late professional', 'not arrived', 'no show', 'waiting', 'credit'],
    body: [
      p('Professionals share their location once they start towards you, so the booking page shows an arrival estimate. If they are running behind, you get a notification.'),
      list('Up to 30 minutes late: you can wait, or reschedule free.', 'More than 30 minutes late: a credit comes off the visit charge automatically, and you can still reschedule or cancel at no cost.', 'No-show: the booking is cancelled at no charge and support contacts you to rebook with another pro at priority.'),
    ],
    related: ['book-reschedule-or-cancel'],
  },
  {
    slug: 'book-work-guarantee', topic: 'book', title: 'The 7-day work guarantee', updated: '2026-10-21',
    summary: 'If a completed job has an issue within 7 days, we send a professional back to fix it at no charge.',
    keywords: ['guarantee', 'warranty', 'redo', 'job not done properly', 'came back'],
    body: [
      p('Every completed job on Zyphix Book is covered for 7 days. If the problem the pro fixed comes back, or the work was not finished to the scope you booked, we send a professional back at no charge.'),
      steps('Open the completed booking and tap "Report an issue".', 'Describe what went wrong and add a photo if you can.', 'Support reviews it the same day and schedules a revisit, usually within 48 hours.'),
      note('The guarantee covers the work done. Spare parts carry the manufacturer\'s warranty, and the professional gives you the receipt for them.'),
    ],
    related: ['book-pricing-and-parts'],
  },
  {
    slug: 'book-pricing-and-parts', topic: 'book', title: 'How pricing works on Zyphix Book', updated: '2026-10-16',
    summary: 'The visit charge is shown before you confirm. Parts and extra work are quoted before they start.',
    keywords: ['price', 'visit charge', 'quote', 'parts', 'cost', 'estimate'],
    body: [
      p('When you select a service, the booking panel shows the visit charge for that service before you confirm. That is the amount for the professional to come, inspect and do the standard scope of the job.'),
      list('If the job needs parts (a tap, a wire, a gas refill), the professional quotes them before starting and you approve in the app.', 'If the job turns out larger than the scope, the extra time is quoted in the same way.', 'You pay after the job through the app: card, UPI, wallet or cash.'),
    ],
    related: ['book-work-guarantee', 'cod-and-upi'],
  },

  /* ── Account & payments ─────────────────────────────────────────────── */
  {
    slug: 'sign-in-otp-not-received', topic: 'account', title: 'I did not receive my sign-in code', updated: '2026-10-22',
    summary: 'Codes arrive by email within a minute. Check spam, then request a new one.',
    keywords: ['otp', 'code', 'sign in', 'login', 'email code', 'verification'],
    body: [
      p('Zyphix uses a one-time code sent to your email instead of a password. The code is valid for 10 minutes.'),
      steps('Check your spam or promotions folder for a message from no-reply@zyphix.in.', 'Make sure the address you typed has no typos; the sign-in page shows it above the code field.', 'Tap "Resend code". You can request a new code every 60 seconds.', 'Still nothing after three tries? Write to support@zyphix.in from the same address and we will check the delivery log.'),
      note('Add no-reply@zyphix.in to your contacts so future codes land in your inbox.'),
    ],
    related: ['change-email-or-phone'],
  },
  {
    slug: 'change-email-or-phone', topic: 'account', title: 'Changing your name, email or phone number', updated: '2026-10-12',
    summary: 'Name and phone can be changed from your account page. Email changes go through support.',
    keywords: ['change phone', 'change email', 'update name', 'profile'],
    body: [
      p('Open your account page and tap "Edit profile" to change your name or phone number. Changes apply to future orders immediately.'),
      p('Because your email is how you sign in, changing it requires a quick check. Write to support@zyphix.in from your current email with the new address, and we will switch it within one working day.'),
    ],
    related: ['sign-in-otp-not-received', 'delete-account'],
  },
  {
    slug: 'addresses', topic: 'account', title: 'Adding, editing and setting a default address', updated: '2026-10-12',
    summary: 'Save as many addresses as you like and pick a default so checkout is one tap.',
    keywords: ['address', 'default address', 'location', 'add address', 'delete address'],
    body: [
      steps('Open your account and tap "Addresses".', 'Tap "Add address", pin the location on the map and add your flat, floor and a landmark.', 'Label it (Home, Work) and save.', 'Use "Set as default" on the address you use most. Checkout and the location pill on the home page use it automatically.'),
      p('A precise pin matters more than the text; riders navigate to the pin. If your building is hard to find, add a landmark in the instructions field.'),
    ],
  },
  {
    slug: 'cod-and-upi', topic: 'account', title: 'Paying by card, UPI, wallet or cash on delivery', updated: '2026-10-14',
    summary: 'Cards, UPI, net banking and wallets online. Cash on delivery on eligible orders.',
    keywords: ['upi', 'cash on delivery', 'cod', 'card', 'payment', 'pay', 'wallet', 'net banking'],
    body: [
      p('At checkout you can pay with a debit or credit card, any UPI app, net banking or a supported wallet. Payment is taken when the order is confirmed by the store or restaurant, not before.'),
      h('Cash on delivery'),
      list('Available on eligible Now and Eats orders (checkout shows when it is), and on Book jobs after the work is done.', 'Keep change ready; riders carry a limited float.', 'Refunds on cash orders go to your Zyphix wallet, which you can use on any Zyphix product.'),
      h('Payment failed but money was debited'),
      p('This is a bank-side hold. It is reversed automatically, usually within 2 working days and at most 7. If it is not back by then, send the transaction reference to support@zyphix.in.'),
    ],
    related: ['refund-timeline'],
  },
  {
    slug: 'coupons-and-offers', topic: 'account', title: 'Using coupons and why a coupon might not apply', updated: '2026-10-14',
    summary: 'Enter the code at checkout. Most coupons have a minimum cart value or a product category.',
    keywords: ['coupon', 'promo code', 'offer', 'discount', 'code not working'],
    body: [
      p('Enter your code in the "Coupon" field at checkout and tap Apply. The discount appears in the bill summary before you pay. Offers that are live right now are listed on the Offers page.'),
      h('Common reasons a coupon does not apply'),
      list('The cart is below the minimum value shown on the coupon.', 'The coupon is for a specific product (Now, Eats or Book) or category.', 'It is a first-order coupon and you have ordered before.', 'It has expired or reached its usage limit.', 'Only one coupon applies per order.'),
    ],
    related: ['delivery-fees-and-minimums'],
  },
  {
    slug: 'delete-account', topic: 'account', title: 'Deleting your Zyphix account and data', updated: '2026-10-22',
    summary: 'Request deletion from your account page or by email. Deletion completes within 30 days.',
    keywords: ['delete account', 'remove account', 'close account', 'erase data'],
    body: [
      p('You can delete your Zyphix account at any time. Deletion removes your profile, saved addresses, wallet balance and order history from our systems.'),
      steps('Open your account page and tap "Delete account" at the bottom, or email support@zyphix.in from your registered address with the subject "Delete my account".', 'We confirm the request by email within one working day.', 'Any open orders or bookings must complete first; any wallet balance is refunded to your original payment method before deletion.', 'Deletion completes within 30 days. Invoices are kept for the period required by applicable tax law, with personal details removed.'),
      note('Deletion cannot be undone. If you only want to stop notifications, you can turn them off in your account settings instead.'),
    ],
    related: ['privacy-and-data-requests'],
  },

  /* ── Refunds & cancellations ───────────────────────────────────────── */
  {
    slug: 'cancel-an-order', topic: 'refunds', title: 'Cancellation windows for Now, Eats and Book', updated: '2026-10-21',
    summary: 'Now: free until packing starts. Eats: free until the restaurant accepts. Book: free up to 1 hour before.',
    keywords: ['cancel', 'cancellation', 'cancel order', 'cancellation fee', 'window'],
    body: [
      h('Zyphix Now (groceries)'),
      list('Free cancellation until the store starts packing (status "Packing").', 'After packing starts, a cancellation may carry a fee equal to the delivery charge; it is shown before you confirm the cancellation.', 'If the order is more than 15 minutes late, cancellation is always free.'),
      h('Zyphix Eats (food)'),
      list('Free cancellation until the restaurant accepts the order, usually within 2–3 minutes.', 'Once cooking has started, the food cost is charged; the delivery fee is refunded.', 'If the order is more than 20 minutes past the estimate, cancellation is free.'),
      h('Zyphix Book (home services)'),
      list('Reschedule free any time.', 'Cancel free up to 1 hour before the slot.', 'Within 1 hour, or after the professional has arrived, the visit charge applies.'),
    ],
    related: ['refund-timeline', 'book-reschedule-or-cancel'],
  },
  {
    slug: 'refund-timeline', topic: 'refunds', title: 'How long refunds take', updated: '2026-10-21',
    summary: 'Wallet refunds are instant. Card, UPI and net-banking refunds take 3–5 working days.',
    keywords: ['refund', 'refund status', 'money back', 'how long', 'refund not received'],
    body: [
      p('When a refund is approved you receive an email with the amount and the method. From there:'),
      list('Zyphix wallet: instant. Usable on any Zyphix product.', 'UPI: 1–3 working days.', 'Debit or credit card: 3–5 working days, occasionally up to 7 depending on the bank.', 'Net banking and wallets: 3–5 working days.', 'Cash on delivery orders: refunded to the Zyphix wallet instantly.'),
      h('Refund not received'),
      p('Check the refund email for the reference ID, then check your bank statement for a credit from "Zyphix". If it is not there after the window above, reply to that email or write to support@zyphix.in with the reference ID and we chase it with the payment partner.'),
    ],
    related: ['cancel-an-order', 'missing-or-damaged-item'],
  },

  /* ── Partners & payouts ─────────────────────────────────────────────── */
  {
    slug: 'restaurant-onboarding', topic: 'partners', title: 'Listing your restaurant on Zyphix Eats', updated: '2026-10-18',
    summary: 'Register free at partner.zyphix.in. An onboarding manager calls within two working days.',
    keywords: ['restaurant', 'register restaurant', 'list restaurant', 'onboarding', 'food licence', 'fssai'],
    body: [
      steps('Go to partner.zyphix.in and choose "Restaurant".', 'Enter the restaurant name, the owner\'s name, phone, city and locality, and your cuisine types.', 'Submit. Your listing appears in the live directory immediately and an onboarding manager calls within two working days.', 'On the call, share your food-safety licence number, tax registration details (if registered), your menu with prices and your opening hours.', 'Once the menu is live you receive orders on the partner app and a weekly settlement to your bank account.'),
      h('What you need'),
      list('A valid food-safety licence (mandatory).', 'Bank account for settlements.', 'A menu with prices; a photo of each dish helps but is optional.'),
      note('Listing is free. Commission is a flat percentage per order, agreed before you go live, and there are no hidden marketing charges.'),
    ],
    related: ['partner-payouts'],
  },
  {
    slug: 'store-onboarding', topic: 'partners', title: 'Listing your corner store on Zyphix Now', updated: '2026-10-18',
    summary: 'Register free at partner.zyphix.in. We import your catalogue and you pack orders from your own shelves.',
    keywords: ['store', 'corner store', 'local store', 'shop', 'register store', 'merchant', 'catalogue'],
    body: [
      p('Zyphix Now runs on the stores already in your neighbourhood, not dark stores. You keep your shelf prices, pack orders from your own stock and a rider from your area delivers.'),
      steps('Go to partner.zyphix.in and choose "Store".', 'Enter the store name, owner, phone, city, locality and the categories you stock.', 'Submit. Your store appears in the live directory immediately.', 'An onboarding manager visits or calls within two working days to set up your catalogue. A printed price list or a photo of your shelves is enough to start.', 'You receive orders on the partner app; the rider collects and delivers.'),
      note('Free delivery on bigger baskets is paid for by Zyphix, not by your store.'),
    ],
    related: ['partner-payouts'],
  },
  {
    slug: 'professional-verification', topic: 'partners', title: 'How professional verification works on Zyphix Book', updated: '2026-10-21',
    summary: 'Government ID, address proof, police verification and a skill call, usually completed within a few days.',
    keywords: ['verification', 'professional', 'police verification', 'id proof', 'electrician register', 'plumber register'],
    body: [
      p('Customers book on Zyphix Book because every professional is verified before their first job. Verification is free and most pros complete it within 3–5 working days.'),
      steps('Register at partner.zyphix.in under "Professional" with your trade, city and localities you serve.', 'Upload a government photo ID (national ID card, driving licence or passport) and an address proof.', 'Upload a police verification certificate from your local station, or ask us to initiate one on your behalf (a small fee applies and is deducted from your first payout).', 'Complete a 15-minute skill confirmation call with our onboarding team.', 'Once approved you appear in "Pros near you" on book.zyphix.in and start receiving bookings.'),
      list('You set your own working days and hours.', 'The visit charge for each service is standard across the platform; parts and extra work are quoted by you and approved by the customer in the app.', 'Payouts are weekly.'),
    ],
    related: ['partner-payouts', 'book-work-guarantee'],
  },
  {
    slug: 'delivery-partner-payouts', topic: 'partners', title: 'Delivery partner earnings and payouts', updated: '2026-10-17',
    summary: 'Per-delivery pay plus distance, paid out weekly to your bank account.',
    keywords: ['rider', 'delivery partner', 'earnings', 'payout', 'weekly pay', 'bike'],
    body: [
      p('Delivery partners are paid per completed delivery, with a distance component on top. Because Zyphix orders are hyperlocal, most trips are short and you complete more of them per hour.'),
      list('Earnings for every delivery are shown in the partner app the moment it is marked delivered.', 'Payouts are made weekly, every Monday, for the previous Monday to Sunday.', 'Cash collected on COD orders is adjusted against your payout; the app shows the running balance.', 'Tips from customers are passed on in full.'),
      h('Payout not received'),
      p('Payouts land by Tuesday evening in most banks. If yours has not arrived by Wednesday, check that the bank account in the partner app is correct, then write to partners@zyphix.in with your partner ID.'),
    ],
    related: ['partner-payouts'],
  },
  {
    slug: 'partner-payouts', topic: 'partners', title: 'Settlements for stores, restaurants and professionals', updated: '2026-10-17',
    summary: 'Weekly settlement to your bank account with an itemised statement in the partner app.',
    keywords: ['settlement', 'payout', 'commission', 'statement', 'bank account', 'invoice'],
    body: [
      p('All partner earnings are settled weekly. Every Monday you receive the previous week\'s orders or jobs, minus the agreed commission, in the bank account on your partner profile.'),
      list('An itemised statement for each settlement is available in the partner portal; it lists every order, the customer payment, refunds and the commission.', 'Refunds issued for missing or damaged items are deducted only when the store or restaurant is responsible; rider-caused issues are not charged to you.', 'Tax invoices for the commission are issued monthly.'),
      p('To change your bank account, update it in the partner portal; changes made before Friday apply to the next Monday\'s settlement.'),
    ],
    related: ['restaurant-onboarding', 'store-onboarding', 'delivery-partner-payouts'],
  },
  {
    slug: 'advertising-enquiries', topic: 'partners', title: 'Advertising on Zyphix', updated: '2026-10-10',
    summary: 'Brands and local businesses can run placements on Now, Eats and Book. Start at advertise.zyphix.in.',
    keywords: ['advertise', 'ads', 'promotion', 'sponsored', 'banner', 'marketing'],
    body: [
      p('Zyphix offers placements such as home-page banners, sponsored listings and sampling inserts, targeted by locality. Pricing is flat and quoted up front; there is no auction.'),
      p('Share a brief at advertise.zyphix.in or email partnerships@zyphix.in with your business name, the areas you serve and what you would like to run. Partnerships replies with the areas where Zyphix is live, suggested formats and a quote.'),
    ],
  },
  {
    slug: 'privacy-and-data-requests', topic: 'account', title: 'Privacy, data access and data deletion requests', updated: '2026-10-22',
    summary: 'Ask for a copy of your data or its deletion by email. We respond within 30 days.',
    keywords: ['privacy', 'data', 'gdpr', 'dpdp', 'export data', 'my data', 'personal information'],
    body: [
      p('Zyphix collects only what is needed to deliver your orders: your name, contact details, addresses, order history and payment references (never full card numbers). Our full privacy policy is at zyphix.in/privacy.'),
      h('Requesting a copy of your data'),
      p('Email support@zyphix.in from your registered address with the subject "Data access request". We send a machine-readable export within 30 days.'),
      h('Requesting deletion'),
      p('See "Deleting your Zyphix account and data". Deletion requests are also handled within 30 days.'),
      h('Marketing preferences'),
      p('Turn promotional emails and notifications off from your account settings at any time. Transactional messages about orders you place are still sent.'),
    ],
    related: ['delete-account'],
  },
];

export const articleBySlug = (slug: string) => ARTICLES.find(a => a.slug === slug);
export const articlesForTopic = (id: TopicId) => ARTICLES.filter(a => a.topic === id);

/** Client-side search: title > summary > keywords > body. */
export function searchArticles(q: string): Article[] {
  const t = q.trim().toLowerCase();
  if (!t) return [];
  const terms = t.split(/\s+/).filter(Boolean);
  const score = (a: Article) => {
    const title = a.title.toLowerCase(), sum = a.summary.toLowerCase(), kw = (a.keywords || []).join(' ').toLowerCase();
    const body = a.body.map(b => 'text' in b ? b.text : b.items.join(' ')).join(' ').toLowerCase();
    let s = 0;
    for (const w of terms) {
      if (title.includes(w)) s += 6;
      if (kw.includes(w)) s += 4;
      if (sum.includes(w)) s += 3;
      if (body.includes(w)) s += 1;
    }
    return s;
  };
  return ARTICLES.map(a => [a, score(a)] as const).filter(([, s]) => s > 0).sort((a, b) => b[1] - a[1]).map(([a]) => a);
}

export const POPULAR: string[] = ['track-an-order', 'refund-timeline', 'cancel-an-order', 'sign-in-otp-not-received', 'missing-or-damaged-item', 'book-reschedule-or-cancel'];

export const SUPPORT_EMAIL = 'support@zyphix.in';
export const PARTNERS_EMAIL = 'partners@zyphix.in';
export const HOURS = 'Monday to Saturday, 9:00 AM to 9:00 PM IST';
