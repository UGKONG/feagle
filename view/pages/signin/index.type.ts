import React from 'react';

export type Key = "id" | "pw" | "isKeep";
export type KeyDownEvent = React.KeyboardEvent<HTMLInputElement>;
export interface Value {
  id: string;
  pw: string;
  isKeep: boolean;
}
