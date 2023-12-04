import { logout } from "../lib/actions";

export async function GET() {

  await logout();

  return {
    status: 200,
    body: {
      message: 'Logout successful'
    }
  };
}