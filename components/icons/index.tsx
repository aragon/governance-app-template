export const CloseIcon = ({ className }: { className?: string }) => (
  <svg className={className ?? ""} height="24" viewBox="0 0 48 48" width="24" xmlns="http://www.w3.org/2000/svg">
    <path
      fill="#414C58"
      d="M38 12.83l-2.83-2.83-11.17 11.17-11.17-11.17-2.83 2.83 11.17 11.17-11.17 11.17 2.83 2.83 11.17-11.17 11.17 11.17 2.83-2.83-11.17-11.17z"
    />
    <path d="M0 0h48v48h-48z" fill="none" />
  </svg>
);

export const MenuIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 512 512" className={className ?? ""}>
    <line
      style={{
        fill: "none",
        stroke: "#414C58",
        strokeLinecap: "round",
        strokeMiterlimit: 10,
        strokeWidth: "48px",
      }}
      x1="88"
      x2="424"
      y1="152"
      y2="152"
    />
    <line
      style={{
        fill: "none",
        stroke: "#414C58",
        strokeLinecap: "round",
        strokeMiterlimit: 10,
        strokeWidth: "48px",
      }}
      x1="88"
      x2="424"
      y1="256"
      y2="256"
    />
    <line
      style={{
        fill: "none",
        stroke: "#414C58",
        strokeLinecap: "round",
        strokeMiterlimit: 10,
        strokeWidth: "48px",
      }}
      x1="88"
      x2="424"
      y1="360"
      y2="360"
    />
  </svg>
);
