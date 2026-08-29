import { PRODUCT_RESEARCH } from '@/data/research';

interface ResearchSectionProps {
  slug: string;
}

export default function ResearchSection({ slug }: ResearchSectionProps) {
  const studies = PRODUCT_RESEARCH[slug];

  // If no studies exist for this product, render nothing
  if (!studies || studies.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 pt-8 border-t border-[#EBE2CF]">
      <h2 className="text-[10px] font-medium tracking-widest uppercase text-[#1A1814]/80 mb-4">
        RESEARCH
      </h2>

      <div>
        {studies.map((study, index) => (
          <div
            key={index}
            className="py-4 flex gap-4 items-start border-b border-[#EBE2CF]"
          >
            {/* Left: Icon */}
            <i
              className="ti ti-book-2"
              style={{ fontSize: 16, color: '#607A5C', marginTop: 2, flexShrink: 0 }}
            />

            {/* Middle: Title, Authors, Summary */}
            <div className="flex-1">
              <a
                href={study.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-[#1A1814] hover:text-[#B8624A] transition-colors"
              >
                {study.title}
              </a>
              <div className="text-[11px] text-[#1A1814]/80 mt-1">
                {study.authors} · {study.journal} · {study.year}
              </div>
              <div
                className="text-[12px] text-[#1A1814]/80 mt-1"
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {study.summary}
              </div>
            </div>

            {/* Right: PMID Badge */}
            {study.pmid && (
              <a
                href={study.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: '9px',
                  fontWeight: 500,
                  padding: '2px 8px',
                  borderRadius: '20px',
                  background: 'rgba(96,122,92,0.12)',
                  color: '#3B5438',
                  whiteSpace: 'nowrap',
                }}
              >
                PMID {study.pmid}
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
