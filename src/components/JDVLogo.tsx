interface JDVLogoProps {
  className?: string;
}

export function JDVLogo({ className = "w-8 h-8" }: JDVLogoProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Fundo do logo - quadrado arredondado com gradiente */}
      <defs>
        <linearGradient id="jdv-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.7" />
        </linearGradient>
      </defs>

      {/* Fundo */}
      <rect
        x="5"
        y="5"
        width="90"
        height="90"
        rx="20"
        fill="url(#jdv-gradient)"
      />

      {/* Letra J */}
      <path
        d="M 25 30 L 25 55 Q 25 65 35 65 Q 40 65 40 60"
        stroke="white"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Letra D */}
      <path
        d="M 48 30 L 48 65 M 48 30 Q 65 30 65 47.5 Q 65 65 48 65"
        stroke="white"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Letra V */}
      <path
        d="M 72 30 L 80 65 L 88 30"
        stroke="white"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Detalhe decorativo - linha embaixo */}
      <rect
        x="20"
        y="75"
        width="60"
        height="3"
        rx="1.5"
        fill="white"
        opacity="0.5"
      />
    </svg>
  );
}
