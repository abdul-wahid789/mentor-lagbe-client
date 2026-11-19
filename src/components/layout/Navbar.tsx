"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/brand/BrandLogo";

const NAV_LINKS = [
    { label: "Home", href: "/" },
    { label: "Browse Tuitions", href: "/tuitions" },
    { label: "Pricing", href: "#pricing" },
    { label: "How It Works", href: "#how-it-works" },
];

export function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <BrandLogo size={26} />

                <nav
                    aria-label="Primary navigation"
                    className="hidden md:flex items-center gap-7 text-sm font-medium text-muted-foreground"
                >
                    {NAV_LINKS.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="transition-colors hover:text-foreground"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="hidden md:flex items-center gap-3">
                    <Link href="/login">
                        <Button variant="ghost" size="sm" className="text-foreground">
                            Sign in
                        </Button>
                    </Link>

                    <Link href="/register"><Button size="sm">
                        Get started
                    </Button> </Link>

                </div>

                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    aria-label={mobileOpen ? "Close menu" : "Open menu"}
                    aria-expanded={mobileOpen}
                    onClick={() => setMobileOpen((prev) => !prev)}
                    className="md:hidden h-9 w-9 border-border bg-card text-foreground"
                >
                    {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </Button>
            </div>

            {mobileOpen && (
                <div className="border-t border-border bg-card px-4 py-4 md:hidden">
                    <nav className="flex flex-col space-y-3 text-sm font-medium">
                        {NAV_LINKS.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                className="py-1 text-muted-foreground transition-colors hover:text-foreground"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                    <div className="mt-4 flex items-center gap-3 border-t border-border pt-4">
                        <Button variant="outline" size="sm" className="flex-1" render={<Link href="/login" onClick={() => setMobileOpen(false)}>
                            Sign in
                        </Link>}>

                        </Button>
                        <Button size="sm" className="flex-1" render={<Link href="/register" onClick={() => setMobileOpen(false)}>
                            Get started
                        </Link>}>

                        </Button>
                    </div>
                </div>
            )}
        </header>
    );
}