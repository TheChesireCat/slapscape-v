import { v4 as uuidv4 } from 'uuid';

export default function MyComponent() {
  // Generate a UUID
  const myUuid = uuidv4();

  return (
    <div>
      <p>Your UUID: {myUuid}, length of UUID: {myUuid.length}</p>
    </div>
  );
}
