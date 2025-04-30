declare namespace JSX {
  interface IntrinsicElements {
    'l-newtons-cradle': any;
    'l-ring': any;
    'l-orbit': any;
    'l-quantum': any;
    'l-tailspin': any;
    'l-dotwave': any;
    'l-spiral': any;
    'l-pulsar': any;
    'l-ripples': any;
    'l-bouncy': any;
    'l-helix': any;
    'l-infinity': any;
    'l-wobble': any;
    'l-waveform': any;
    'l-square': any;
    'l-dotspinner': any;
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