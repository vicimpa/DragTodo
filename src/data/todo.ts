import { makeStore } from "lib/makeStore";

export interface ITodo {
  title: string;
  check: boolean;
}

export const todoStore = makeStore<ITodo>('todos');