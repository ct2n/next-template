import { LocaleSelector } from "@/components/locale/locale-selector";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Link } from "@/i18n/navigation";

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center font-sans">
      <main className="flex min-h-screen w-full max-w-5xl flex-col items-center justify-between px-16 py-8 sm:items-start">
        <div className="flex w-full items-center justify-between gap-2">
          <Link href="/">Home</Link>
          <div className="flex gap-2">
            <ThemeToggle />
            <LocaleSelector />
          </div>
        </div>
        <div className="w-full">{children}</div>
      </main>
    </div>
  );
}
