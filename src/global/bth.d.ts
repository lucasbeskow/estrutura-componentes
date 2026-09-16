type BthEnvEndpoints = Record<string, string>;

interface BthGlobal {
  envs: {
    suite: Record<string, Record<string, BthEnvEndpoints>>;
  };
}

interface Window {
  ___bth?: BthGlobal;
}
