export default function ResearchDisclaimerBox() {
  return (
    <div className="bg-cream hairline-border p-6">
      <div className="flex items-start space-x-3">
        <span className="text-clay font-mono text-lg">●</span>
        <div>
          <h3 className="font-mono text-xs uppercase tracking-mono text-ink font-medium mb-3">
            RESEARCH USE ONLY
          </h3>
          <p className="font-editorial text-sm text-ink opacity-80 leading-relaxed mb-3">
            This compound is intended strictly for{" "}
            <span className="font-medium">in vitro research and laboratory use only</span>.
            Not for human consumption, clinical, therapeutic, diagnostic, or veterinary use.
          </p>
          <ul className="font-mono text-xs text-ink opacity-60 space-y-1">
            <li>· Not for human or animal administration</li>
            <li>· Qualified researchers and institutions only</li>
            <li>· Must be 21+ years of age to purchase</li>
            <li>· Compliance with applicable regulations required</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
