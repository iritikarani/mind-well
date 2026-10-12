import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log in",
  description: "Come back to your cozy room.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
