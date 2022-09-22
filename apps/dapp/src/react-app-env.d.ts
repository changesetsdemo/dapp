declare namespace NodeJS {
  interface Process {
    readonly NODE_ENV: 'development';
  }
}
declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const src: string;
  export default src;
}
