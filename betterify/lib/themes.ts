export type ThemeColor = "blue" | "purple" | "green" | "red" | "orange" | "pink"

export interface Theme {
  name: string
  color: ThemeColor
  primaryColor: string
  primaryColorHover: string
  glowColor: string
}

export const themes: Record<ThemeColor, Theme> = {
  blue: {
    name: "Blue",
    color: "blue",
    primaryColor: "rgb(59, 130, 246)",
    primaryColorHover: "rgb(37, 99, 235)",
    glowColor: "rgba(59, 130, 246, 0.5)",
  },
  purple: {
    name: "Purple",
    color: "purple",
    primaryColor: "rgb(139, 92, 246)",
    primaryColorHover: "rgb(124, 58, 237)",
    glowColor: "rgba(139, 92, 246, 0.5)",
  },
  green: {
    name: "Green",
    color: "green",
    primaryColor: "rgb(34, 197, 94)",
    primaryColorHover: "rgb(22, 163, 74)",
    glowColor: "rgba(34, 197, 94, 0.5)",
  },
  red: {
    name: "Red",
    color: "red",
    primaryColor: "rgb(239, 68, 68)",
    primaryColorHover: "rgb(220, 38, 38)",
    glowColor: "rgba(239, 68, 68, 0.5)",
  },
  orange: {
    name: "Orange",
    color: "orange",
    primaryColor: "rgb(249, 115, 22)",
    primaryColorHover: "rgb(234, 88, 12)",
    glowColor: "rgba(249, 115, 22, 0.5)",
  },
  pink: {
    name: "Pink",
    color: "pink",
    primaryColor: "rgb(236, 72, 153)",
    primaryColorHover: "rgb(219, 39, 119)",
    glowColor: "rgba(236, 72, 153, 0.5)",
  },
}

export function getThemeColor(color: ThemeColor): Theme {
  return themes[color] || themes.blue
}

