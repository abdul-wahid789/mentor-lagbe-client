import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";

export function Footer() {
  return (
    <footer className="mt-auto bg-[#0E0B16] text-[#F5F3FF] border-t border-[#2A2342]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          <div className="md:col-span-5 space-y-2.5">
            <BrandLogo size={26} textClassName="text-[#F5F3FF]" />
            <p className="max-w-xs text-sm text-[#9D96B8] leading-relaxed">
              A little guidance. A world of possibilities.
            </p>
          </div>

          <div className="md:col-span-3 space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9D96B8]">
              Explore
            </p>
            <ul className="space-y-1.5 text-sm text-[#DDD6FE]/90">
              <li>
                <Link href="/tuitions" className="hover:text-white transition-colors">
                  Browse Tuitions
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9D96B8]">
              Get in touch
            </p>
            <div className="space-y-1 text-sm text-[#DDD6FE]/90">
              <p>abdulwahid.contact@gmail.com</p>
              <p className="font-mono text-xs text-[#9D96B8]">
                +880 18494 50075 · Dhaka, Bangladesh
              </p>
            </div>
          </div>

          <div className="md:col-span-2 space-y-2 md:text-right">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9D96B8]">
              Follow along
            </p>
            <div className="flex items-center gap-3 md:justify-end text-sm font-medium text-[#DDD6FE]">
              <Link href="https://x.com" target="_blank" className="hover:text-white">
                𝕏
              </Link>
              <Link href="https://facebook.com" target="_blank" className="hover:text-white">
                f
              </Link>
              <Link href="https://linkedin.com" target="_blank" className="hover:text-white">
                in
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-[#2A2342] pt-6 text-xs text-[#9D96B8]">
          © 2026 MentorLagbe. All rights reserved.
        </div>
      </div>
    </footer>
  );
}