declare namespace JSX {
  interface IntrinsicElements {
    'l-newtons-cradle': JSX.IntrinsicAttributes & { [key: string]: unknown };
    'l-ring': JSX.IntrinsicAttributes & { [key: string]: unknown };
    'l-orbit': JSX.IntrinsicAttributes & { [key: string]: unknown };
    'l-quantum': JSX.IntrinsicAttributes & { [key: string]: unknown };
    'l-tailspin': JSX.IntrinsicAttributes & { [key: string]: unknown };
    'l-dotwave': JSX.IntrinsicAttributes & { [key: string]: unknown };
    'l-spiral': JSX.IntrinsicAttributes & { [key: string]: unknown };
    'l-pulsar': JSX.IntrinsicAttributes & { [key: string]: unknown };
    'l-ripples': JSX.IntrinsicAttributes & { [key: string]: unknown };
    'l-bouncy': JSX.IntrinsicAttributes & { [key: string]: unknown };
    'l-helix': JSX.IntrinsicAttributes & { [key: string]: unknown };
    'l-infinity': JSX.IntrinsicAttributes & { [key: string]: unknown };
    'l-wobble': JSX.IntrinsicAttributes & { [key: string]: unknown };
    'l-waveform': JSX.IntrinsicAttributes & { [key: string]: unknown };
    'l-square': JSX.IntrinsicAttributes & { [key: string]: unknown };
    'l-dotspinner': JSX.IntrinsicAttributes & { [key: string]: unknown };
  }
}

declare module 'ldrs' {
  export const ring: {
    register: (name?: string) => void;
  };
  
  export const orbit: {
    register: (name?: string) => void;
  };
  
  export const newtonsCradle: {
    register: (name?: string) => void;
  };

  export const quantum: {
    register: (name?: string) => void;
  };
  
  export const tailspin: {
    register: (name?: string) => void;
  };
  
  export const dotWave: {
    register: (name?: string) => void;
  };
  
  export const spiral: {
    register: (name?: string) => void;
  };
  
  export const pulsar: {
    register: (name?: string) => void;
  };
  
  export const ripples: {
    register: (name?: string) => void;
  };
  
  export const helix: {
    register: (name?: string) => void;
  };
} 