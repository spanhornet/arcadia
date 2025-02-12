"use client";

import * as React from "react";
import { SunIcon, MoonIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ModeToggle() {
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    return (
        <Button variant="outline" size="icon" onClick={toggleTheme} className="relative cursor-pointer">
            <MoonIcon className="scale-100 transition-all dark:scale-0" />
            <SunIcon className="absolute scale-0 transition-all dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}