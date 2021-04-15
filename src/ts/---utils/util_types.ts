
type Mutable<T> = { //so you can edit readonly
   -readonly [k in keyof T]: T[k];
};

type WindowInterval = number|null;

type jsonStr = string;