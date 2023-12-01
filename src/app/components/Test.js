"use client";

import {useFormState, useFormStatus} from "react-dom";
import {createTodo} from "@/app/lib/actions";
// import { v4 as uuidv4 } from 'uuid';

export default function MyComponent() {
  // Generate a UUID
  // const myUuid = uuidv4();

  const [ state, formAction ] = useFormState(createTodo, {
    initialState: {
      error: null,
    },
  });

  return (
    <div>
      {/* <p>Your UUID: {myUuid}, length of UUID: {myUuid.length}</p> */}
      <form action={formAction}>
        <input type="text" name="username"></input>
        <input type="password" name="password"></input>
        <button type="submit">go</button>
      </form>
    </div>
  );
}
