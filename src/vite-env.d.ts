/// <reference types="vite/client" />

interface Window {
  aistudio?: {
    openSelectKey: () => Promise<void>;
    hasSelectedApiKey: () => Promise<boolean>;
  };
}
