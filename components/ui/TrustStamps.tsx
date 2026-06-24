import { FlaskConical, MapPin, Activity, Fingerprint } from "lucide-react";

interface TrustStampsProps {
  accentColor: string; // hex
  className?: string;
}

const stamps = [
  {
    icon: FlaskConical,
    stat: "7×",
    label: ["Independently", "tested"],
  },
  {
    icon: MapPin,
    stat: "US lab",
    label: ["Verified", "purity"],
  },
  {
    icon: Activity,
    stat: "98%+",
    label: ["HPLC", "purity"],
  },
  {
    icon: Fingerprint,
    stat: "Batch",
    label: ["Lot-matched", "COA"],
  },
];

export default function TrustStamps({ accentColor, className = "" }: TrustStampsProps) {
  return (
    <div className={`flex flex-col items-center ${className}`} style={{ gap: 0 }}>
      {stamps.map((stamp, index) => {
        const Icon = stamp.icon;
        return (
          <div key={index}>
            {/* Stamp Unit */}
            <div
              className="flex flex-col items-center"
              style={{ gap: "4px" }}
            >
              {/* Stamp Circle */}
              <div
                className="relative flex flex-col items-center justify-center"
                style={{
                  width: "68px",
                  height: "68px",
                  borderRadius: "50%",
                  background: "#EBE2CF",
                  border: `1.5px solid ${accentColor}`,
                }}
              >
                {/* Inner dashed ring */}
                <div
                  style={{
                    position: "absolute",
                    inset: "8px",
                    borderRadius: "50%",
                    border: `1px dashed ${accentColor}`,
                    opacity: 0.45,
                    pointerEvents: "none",
                  }}
                />

                {/* Icon */}
                <Icon size={14} color={accentColor} strokeWidth={2} />

                {/* Stat */}
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    color: "#1A1814",
                    marginTop: "2px",
                  }}
                >
                  {stamp.stat}
                </div>
              </div>

              {/* Caption */}
              <div
                style={{
                  fontSize: "7.5px",
                  color: accentColor,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  textAlign: "center",
                  lineHeight: 1.45,
                  maxWidth: "72px",
                }}
              >
                {stamp.label[0]}
                <br />
                {stamp.label[1]}
              </div>
            </div>

            {/* Connector line (except after last stamp) */}
            {index < stamps.length - 1 && (
              <div
                style={{
                  width: "1px",
                  height: "12px",
                  background: "#c4b89e",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
