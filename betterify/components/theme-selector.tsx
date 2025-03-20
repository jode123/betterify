"use client"

import { useTheme } from "@/lib/theme-context"
import { themes, type ThemeColor } from "@/lib/themes"
import { Check, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export function ThemeSelector() {
  const { themeColor, setThemeColor, isDarkMode, setIsDarkMode } = useTheme()

  return (
    <div className="flex items-center space-x-2">
      <Button variant="ghost" size="icon" onClick={() => setIsDarkMode(!isDarkMode)} className="rounded-full">
        {isDarkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        <span className="sr-only">Toggle dark mode</span>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="rounded-full w-8 h-8 p-0"
            style={{ backgroundColor: themes[themeColor].primaryColor }}
          >
            <span className="sr-only">Change theme color</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <div className="grid grid-cols-3 gap-1 p-1">
            {Object.entries(themes).map(([key, theme]) => (
              <DropdownMenuItem
                key={key}
                className={cn("flex h-8 w-8 items-center justify-center rounded-full p-0 cursor-pointer")}
                style={{ backgroundColor: theme.primaryColor }}
                onClick={() => setThemeColor(key as ThemeColor)}
              >
                {key === themeColor && <Check className="h-4 w-4 text-white" />}
                <span className="sr-only">{theme.name}</span>
              </DropdownMenuItem>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

