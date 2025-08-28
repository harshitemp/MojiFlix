// components/AdminLayout.tsx
"use client";

import { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { LogOut, LayoutDashboard, Film, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card/50 p-4 flex flex-col items-center sticky top-0 h-screen transition-all duration-300 ease-in-out">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="MojiFlix Logo"
            width={120}
            height={30}
            priority
            className="mb-6"
          />
        </Link>
        <nav className="flex-1 w-full space-y-2">
          <Link href="/admin">
            <Button variant="ghost" className="w-full justify-start text-sm">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </Link>
          <Link href="/admin/upload">
            <Button variant="ghost" className="w-full justify-start text-sm">
              <Film className="h-4 w-4 mr-2" />
              Upload Video
            </Button>
          </Link>
         
        </nav>
        <div className="w-full">
          <Separator className="my-4" />
          <Link href="/">
            <Button
              variant="ghost"
              className="w-full justify-start text-sm text-red-500 hover:bg-red-500/10 hover:text-red-600"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
