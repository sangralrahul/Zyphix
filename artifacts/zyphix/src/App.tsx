import React, { Suspense, lazy } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import NotFound from "@/pages/not-found";
import { LazyMotion, domAnimation } from "@/lib/motion";


import { Landing } from "@/pages/Landing";
const Home = lazy(() => import("@/pages/Home").then(m => ({ default: m.Home })));
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { PromoProvider } from "@/context/PromoContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { ReviewsProvider } from "@/context/ReviewsContext";
import { NotificationsProvider } from "@/context/NotificationsContext";
const AuthModal = lazy(() => import("@/components/AuthModal").then(m => ({ default: m.AuthModal })));
import { Navbar } from "@/components/layout/Navbar";
import { SiteFooter } from "@/components/layout/SiteChrome";
const BottomNav = lazy(() => import("@/components/layout/BottomNav").then(m => ({ default: m.BottomNav })));


const PartnerSite = lazy(() => import("@/sites/PartnerSite"));
const AdvertiseSite = lazy(() => import("@/sites/AdvertiseSite"));
const AuthSite = lazy(() => import("@/sites/AuthSite"));
const SupportSite = lazy(() => import("@/sites/SupportSite"));

/**
 * One Worker serves zyphix.in and its sub-sites. The hostname (or ?site= for local previews)
 * decides which site renders: partner.zyphix.in → partner portal, advertise.zyphix.in → ads site,
 * auth.zyphix.in → the shared sign-in page.
 */
export { detectSite } from "@/lib/site";
import { detectSite } from "@/lib/site";
import { AppErrorBoundary } from "@/components/AppErrorBoundary";
import { useSeoSync } from "@/lib/seoSync";

const HomeLight = lazy(() => import("@/pages/HomeLight").then(m => ({ default: m.HomeLight })));
const Privacy = lazy(() => import("@/pages/Privacy").then(m => ({ default: m.Privacy })));
const Terms = lazy(() => import("@/pages/Terms").then(m => ({ default: m.Terms })));
const About = lazy(() => import("@/pages/About").then(m => ({ default: m.About })));
const Contact = lazy(() => import("@/pages/Contact").then(m => ({ default: m.Contact })));
const Blog = lazy(() => import("@/pages/Blog").then(m => ({ default: m.Blog })));
const Investors = lazy(() => import("@/pages/Investors").then(m => ({ default: m.Investors })));
const MerchantSetup = lazy(() => import("@/pages/MerchantSetup").then(m => ({ default: m.MerchantSetup })));
const DeliverySetup = lazy(() => import("@/pages/DeliverySetup").then(m => ({ default: m.DeliverySetup })));
const RestaurantSetup = lazy(() => import("@/pages/RestaurantSetup").then(m => ({ default: m.RestaurantSetup })));
const SplashVideo = lazy(() => import("@/pages/SplashVideo").then(m => ({ default: m.SplashVideo })));
const ZyphixNow = lazy(() => import("@/pages/ZyphixNow").then(m => ({ default: m.ZyphixNow })));
const ZyphixEats = lazy(() => import("@/pages/ZyphixEats").then(m => ({ default: m.ZyphixEats })));
const ZyphixBook = lazy(() => import("@/pages/ZyphixBook").then(m => ({ default: m.ZyphixBook })));
const KiranaMap = lazy(() => import("@/pages/KiranaMap").then(m => ({ default: m.KiranaMap })));
const Offers = lazy(() => import("@/pages/Offers").then(m => ({ default: m.Offers })));
const AppComingSoon = lazy(() => import("@/pages/AppComingSoon").then(m => ({ default: m.AppComingSoon })));
const Account = lazy(() => import("@/pages/Account").then(m => ({ default: m.Account })));
const ServiceProSetup = lazy(() => import("@/pages/ServiceProSetup").then(m => ({ default: m.ServiceProSetup })));
const PartnerLanding = lazy(() => import("@/pages/PartnerLanding").then(m => ({ default: m.PartnerLanding })));
const ProductDetail = lazy(() => import("@/pages/ProductDetail").then(m => ({ default: m.ProductDetail })));
const CartPage = lazy(() => import("@/pages/Cart").then(m => ({ default: m.Cart })));
const CheckoutPage = lazy(() => import("@/pages/Checkout").then(m => ({ default: m.Checkout })));
const OrderConfirmation = lazy(() => import("@/pages/OrderConfirmation").then(m => ({ default: m.OrderConfirmation })));
const WalletPage = lazy(() => import("@/pages/Wallet").then(m => ({ default: m.Wallet })));
const WishlistPage = lazy(() => import("@/pages/Wishlist").then(m => ({ default: m.Wishlist })));
const NotificationsPage = lazy(() => import("@/pages/Notifications").then(m => ({ default: m.Notifications })));
const AccountsSite = lazy(() => import("@/sites/AccountsSite"));
const Admin = lazy(() => import("@/pages/Admin").then(m => ({ default: m.Admin })));
const PartnerDashboard = lazy(() => import("@/pages/PartnerDashboard").then(m => ({ default: m.PartnerDashboard })));


function RouteFallback() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFFFFF' }}>
      <div style={{ width: 36, height: 36, borderRadius: '50%', border: '3px solid rgba(13,163,102,.2)', borderTopColor: '#0DA366', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/** The sign-in modal is only downloaded the first time someone opens it. */
function LazyAuthModal() {
  const { showModal } = useAuth();
  const [wanted, setWanted] = React.useState(false);
  React.useEffect(() => { if (showModal) setWanted(true); }, [showModal]);
  if (!wanted) return null;
  return <Suspense fallback={null}><AuthModal /></Suspense>;
}

/** zyphix.in/advertise → the real site at advertise.zyphix.in (keeps one canonical address).
 *  Off production (previews) it renders in place under a /advertise base. */
function AdvertiseAtPath() {
  const prod = typeof window !== 'undefined' && /(^|\.)zyphix\.in$/.test(window.location.hostname);
  React.useEffect(() => { if (prod) window.location.replace('https://advertise.zyphix.in/' + window.location.hash); }, [prod]);
  if (prod) return null;
  return <WouterRouter base="/advertise"><AdvertiseSite /></WouterRouter>;
}

/** Old landing experiments → home. */
function ToHome() {
  const [, setLoc] = useLocation();
  React.useEffect(() => { setLoc('/', { replace: true }); }, [setLoc]);
  return null;
}

function LightLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FA', color: '#111827' }}>
      <Navbar />
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 16px 96px', boxSizing: 'border-box' as const }}>
        {children}
      </div>
      <div className="pb-16 md:pb-0"><SiteFooter /></div>
      <Suspense fallback={null}><BottomNav /></Suspense>
    </div>
  );
}

// All app pages now share the same light layout.
const DarkLayout = LightLayout;

const MAIN_ONLY = ["/about", "/contact", "/blog", "/investors", "/privacy", "/terms", "/app", "/partner", "/merchant-setup", "/restaurant-setup", "/delivery-setup", "/service-setup"];

function Router() {
  useSeoSync();
  const site = detectSite();
  if (site === "admin") return <Admin />;
  if (site === "accounts") return <AccountsSite />;
  if (site === "partner") return <PartnerSite />;
  if (site === "advertise") return <AdvertiseSite />;
  if (site === "auth") return <AuthSite />;
  if (site === "support") return <SupportSite />;
  // Company / legal pages live on zyphix.in only: forward from shop subdomains so there is one copy of each.
  if ((site === "now" || site === "eats" || site === "book") && typeof window !== "undefined"
    && /(^|\.)zyphix\.in$/.test(window.location.hostname) && MAIN_ONLY.includes(window.location.pathname.replace(/\/$/, ""))) {
    window.location.replace("https://zyphix.in" + window.location.pathname);
    return null;
  }
  // now.|eats.|book.zyphix.in: the app section is the root; all other paths keep working.
  const appRoot = site === "now" ? <LightLayout><ZyphixNow /></LightLayout>
    : site === "eats" ? <LightLayout><ZyphixEats /></LightLayout>
    : site === "book" ? <LightLayout><ZyphixBook /></LightLayout> : null;
  return (
    <Switch>
      {appRoot && <Route path="/">{appRoot}</Route>}
      {site === "now" && <Route path="/product/:id">{() => <LightLayout><ProductDetail /></LightLayout>}</Route>}
      {site === "now" && <Route path="/cart"><LightLayout><CartPage /></LightLayout></Route>}
      {site === "now" && <Route path="/checkout"><LightLayout><CheckoutPage /></LightLayout></Route>}
      {site === "now" && <Route path="/order/:id">{() => <LightLayout><OrderConfirmation /></LightLayout>}</Route>}
      <Route path="/" component={Landing} />
      <Route path="/launch" component={ToHome} />
      <Route path="/light" component={ToHome} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/blog" component={Blog} />
      <Route path="/investors" component={Investors} />
      <Route path="/merchant-setup" component={MerchantSetup} />
      <Route path="/delivery-setup" component={DeliverySetup} />
      <Route path="/restaurant-setup" component={RestaurantSetup} />
      <Route path="/splash-video" component={ToHome} />
      <Route path="/now">
        <LightLayout><ZyphixNow /></LightLayout>
      </Route>
      <Route path="/now/product/:id">
        {params => <LightLayout><ProductDetail /></LightLayout>}
      </Route>
      <Route path="/now/cart">
        <LightLayout><CartPage /></LightLayout>
      </Route>
      <Route path="/now/checkout">
        <LightLayout><CheckoutPage /></LightLayout>
      </Route>
      <Route path="/now/order/:id">
        {params => <LightLayout><OrderConfirmation /></LightLayout>}
      </Route>
      <Route path="/wallet">
        <LightLayout><WalletPage /></LightLayout>
      </Route>
      <Route path="/wishlist">
        <LightLayout><WishlistPage /></LightLayout>
      </Route>
      <Route path="/notifications">
        <LightLayout><NotificationsPage /></LightLayout>
      </Route>
      <Route path="/admin" component={Admin} />
      <Route path="/partner-dashboard">
        <LightLayout><PartnerDashboard /></LightLayout>
      </Route>


      <Route path="/eats">
        <LightLayout><ZyphixEats /></LightLayout>
      </Route>
      <Route path="/book">
        <DarkLayout><ZyphixBook /></DarkLayout>
      </Route>
      <Route path="/offers">
        <DarkLayout><Offers /></DarkLayout>
      </Route>
      <Route path="/kirana-map">
        <DarkLayout><KiranaMap /></DarkLayout>
      </Route>
      <Route path="/partner" component={PartnerLanding} />
      <Route path="/service-setup" component={ServiceProSetup} />
      <Route path="/advertise">{() => <AdvertiseAtPath />}</Route>
      <Route path="/auth" component={AuthSite} />
      <Route path="/support" component={SupportSite} />
      <Route path="/support/:rest*" component={SupportSite} />
      <Route path="/app" component={AppComingSoon} />
      <Route path="/account">
        {() => {
          // The account lives on accounts.zyphix.in; forward from the shop sites in production.
          if (typeof window !== "undefined" && /(^|\.)zyphix\.in$/.test(window.location.hostname)) { window.location.replace("https://accounts.zyphix.in/" + window.location.search); return null; }
          return <DarkLayout><Account /></DarkLayout>;
        }}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <LazyMotion features={domAnimation}>
        <AuthProvider>
          <NotificationsProvider>
            <WishlistProvider>
              <ReviewsProvider>
                <CartProvider>
                  <PromoProvider>
                    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
                      <AppErrorBoundary>
                        <Suspense fallback={<RouteFallback />}>
                          <Router />
                        </Suspense>
                      </AppErrorBoundary>
                      <LazyAuthModal />
                    </WouterRouter>
                  </PromoProvider>
                </CartProvider>
              </ReviewsProvider>
            </WishlistProvider>
          </NotificationsProvider>
        </AuthProvider>
    </LazyMotion>
  );
}

export default App;
