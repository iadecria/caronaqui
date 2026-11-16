import Image from "next/image"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
}

export function Logo({ size = "md", showText = true }: LogoProps) {
  const sizes = {
    sm: 28,
    md: 36,
    lg: 48
  }

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl"
  }

  return (
    <div className="flex items-center gap-2">
      <Image
        src="/logo.jpg"
        alt="CaronAqui Logo"
        width={sizes[size]}
        height={sizes[size]}
        className="rounded-lg"
        priority
      />
      {showText && (
        <span className={`font-bold text-foreground ${textSizes[size]}`}>
          Caron<span className="text-primary">Aqui</span>
        </span>
      )}
    </div>
  )
}
