import React from "react";
import { RestTimerProvider } from "./components/timer/RestTimer.jsx";
import { PlanStoreProvider, usePlanStore } from "./state/PlanStore.jsx";
import Header from "./components/layout/Header.jsx";
import SessionPage from "./pages/SessionPage.jsx";
import HistoryPage from "./pages/HistoryPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import PlanPage from "./pages/PlanPage.jsx";

function Body() {
  const { tab } = usePlanStore();
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col">
      <Header />
      {tab === "sesion" && <SessionPage />}
      {tab === "plan" && <PlanPage />}
      {tab === "historial" && <HistoryPage />}
      {tab === "ajustes" && <SettingsPage />}
      <footer className="h-6" />
    </div>
  );
}

export default function MobilePlanGiovanni() {
  return (
    <RestTimerProvider>
      <PlanStoreProvider>
        <Body />
      </PlanStoreProvider>
    </RestTimerProvider>
  );
}
