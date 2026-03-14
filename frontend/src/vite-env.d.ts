/// <reference types="vite/client" />

declare module '@splidejs/react-splide' {
  import { ComponentType, ReactNode } from 'react';

  interface SplideProps {
    options?: Record<string, unknown>;
    children?: ReactNode;
    className?: string;
    [key: string]: unknown;
  }

  interface SplideSlideProps {
    children?: ReactNode;
    className?: string;
    [key: string]: unknown;
  }

  export const Splide: ComponentType<SplideProps>;
  export const SplideSlide: ComponentType<SplideSlideProps>;
}

declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.jpg' {
  const value: string;
  export default value;
}

declare module '*.svg' {
  const value: string;
  export default value;
}
