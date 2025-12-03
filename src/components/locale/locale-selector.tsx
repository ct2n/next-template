"use client";

import { Check, Globe } from "lucide-react";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function LocaleSelector() {
  const router = useRouter();
  const locale = useLocale();
  const pathname = usePathname();

  function ChangeLocale({
    currentPath,
    locale,
  }: {
    currentPath: string;
    locale: string;
  }) {
    router.replace(currentPath, { locale: locale });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Globe className="size-4" />
          <span className="sr-only">Change locale</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className={cn(locale === "vi" && "bg-muted")}
          onClick={() => ChangeLocale({ currentPath: pathname, locale: "vi" })}
        >
          {locale === "vi" ? (
            <Check className="size-4" />
          ) : (
            <div className="size-4" />
          )}
          Tiếng Việt
        </DropdownMenuItem>

        <DropdownMenuItem
          className={cn(locale === "en" && "bg-muted")}
          onClick={() => ChangeLocale({ currentPath: pathname, locale: "en" })}
        >
          {locale === "en" ? (
            <Check className="size-4" />
          ) : (
            <div className="size-4" />
          )}
          English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
