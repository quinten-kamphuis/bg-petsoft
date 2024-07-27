import 'server-only'

import { auth } from "./auth";
import { redirect } from "next/navigation";

export async function checkAuth() {
  const session = await auth();
  if (!session || !session.user) {
    redirect("/login");
  }
  return session
}