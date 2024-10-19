import { ZIndexContextProvider } from "@/components/ZIndexContextProvider";
import { SortContextProvider } from "@/components/SortContextProvider";
import { NewFileContextProvider } from "@/components/NewFileContextProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ZIndexContextProvider>
      <SortContextProvider>
        <NewFileContextProvider>{children}</NewFileContextProvider>
      </SortContextProvider>
    </ZIndexContextProvider>
  );
}
