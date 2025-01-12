import { ThemeProvider } from "./theme-provider"

interface BaseProviderProps {
  children: React.ReactNode
}

export default function BaseProvider({ children }: BaseProviderProps) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  )
}
