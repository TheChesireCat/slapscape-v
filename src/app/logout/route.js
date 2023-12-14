import { logout } from "../lib/actionsSupa";

export async function GET() {

  await logout();

  return {
    status: 200,
    body: {
      message: 'Logout successful'
    }
  };
}