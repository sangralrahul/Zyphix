import React, { useState, Suspense, lazy } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { SplashScreen } from "@/components/SplashScreen";

import { Home } from "@/pages/Home";
import { AuthProvider } from "@/context/AuthContext";
import { AuthModal } from "@/components/AuthModal";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";

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
const PartnerLanding = lazy(() => import("@/pages/PartnerLanding").then(m => ({ default: m.PartnerLanding })));

function RouteFallback() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0A0F1A' }}>
      <div style={{ width: 36, height: 36, borderRadius: '50%', border: '3px solid rgba(13,163,102,.2)', borderTopColor: '#0DA366', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

const queryClient = new QueryClient();

const DARK_ROUTES = ['/now', '/eats', '/book', '/offers', '/kirana-map'];

function DarkLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#0A0E1A', color: '#fff' }}>
      <Navbar />
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 16px 96px', boxSizing: 'border-box' as const }}>
        {children}
      </div>
      <BottomNav />
    </div>
  );
}

function LightLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FA', color: '#111827' }}>
      <Navbar />
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 16px 96px', boxSizing: 'border-box' as const }}>
        {children}
      </div>
      <BottomNav />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/light" component={HomeLight} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/blog" component={Blog} />
      <Route path="/investors" component={Investors} />
      <Route path="/merchant-setup" component={MerchantSetup} />
      <Route path="/delivery-setup" component={DeliverySetup} />
      <Route path="/restaurant-setup" component={RestaurantSetup} />
      <Route path="/splash-video" component={SplashVideo} />
      <Route path="/now">
        <LightLayout><ZyphixNow /></LightLayout>
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
      <Route path="/app" component={AppComingSoon} />
      <Route path="/account">
        <DarkLayout><Account /></DarkLayout>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Suspense fallback={<RouteFallback />}>
              <Router />
            </Suspense>
            <AuthModal />
          </WouterRouter>
        </AuthProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
