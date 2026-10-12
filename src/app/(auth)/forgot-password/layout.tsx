import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset your password",
  description: "Get back into your room.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
