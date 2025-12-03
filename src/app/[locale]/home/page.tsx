import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { LocaleSelector } from "@/components/locale/locale-selector";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export default function Home() {
  const t = useTranslations("HomePage");

  return (
    <div className="flex min-h-screen items-center justify-center font-sans">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between px-16 py-32 sm:items-start">
        <div className="flex w-full justify-end gap-2">
          <ThemeToggle />
          <LocaleSelector />
        </div>
        <div className="flex items-center gap-4">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={100}
            height={20}
            priority
          />
        </div>
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl leading-10 font-semibold tracking-tight">
            {t("title")}
          </h1>
          <p className="max-w-md text-lg leading-8">{t("description")}</p>
        </div>
        <Button size="lg" className="w-full text-lg font-medium" asChild>
          <Link href="/users">
            <ArrowRight className="size-4" />
            API Test
          </Link>
        </Button>
      </main>
    </div>
  );
}
