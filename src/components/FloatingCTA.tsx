import { LinkButton } from "@/components/ui/Button";

export function FloatingCTA() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-navy/95 p-3 backdrop-blur-xl md:hidden">
      <LinkButton href="/register" className="w-full bg-orange-500 hover:bg-orange-400 text-white border-0 shadow-[0_0_15px_rgba(249,115,22,0.5)] rounded-xl py-3 font-bold">
        Ro'yxatdan o'tish →
      </LinkButton>
    </div>
  );
}
