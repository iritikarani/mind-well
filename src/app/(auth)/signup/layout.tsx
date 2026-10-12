import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create your account",
  description: "Make a small space of your own — free, and no pressure.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
