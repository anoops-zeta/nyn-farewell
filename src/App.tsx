import { AppShell } from "@/components/shell/AppShell";
import { AppStoreProvider, useAppStore } from "@/state/AppState";
import { Agentation } from "agentation";
import { useEffect } from "react";

function TitleSync() {
  const { config } = useAppStore();
  useEffect(() => {
    document.title = config.siteTitle;

    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute("content", config.siteDescription);
  }, [config.siteTitle, config.siteDescription]);
  return null;
}

export default function App() {
  return (
    <AppStoreProvider>
      <TitleSync />
      <AppShell />
      {import.meta.env.DEV ? <Agentation endpoint="http://localhost:4747" /> : null}
    </AppStoreProvider>
  );
}
