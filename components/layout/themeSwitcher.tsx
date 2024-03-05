"use client";

import { Button } from "@nextui-org/react";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Button
      onPress={() => setTheme(theme === "dark" ? "light" : "dark")}
      size="sm"
      radius="full"
      isIconOnly
      variant="light"
      startContent={
        theme === "light" ? (
          <IconMoon size={20} className="text-default-600" />
        ) : (
          <IconSun size={20} className="text-default-600" />
        )
      }
    />
  );
}
