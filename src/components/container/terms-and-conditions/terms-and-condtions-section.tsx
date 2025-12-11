interface BulletListProps {
  id: number;
  title: string;
  content: string[];
}

interface DepositTableProps {
  label: string;
  value: string;
}

interface SubsectionItemProps {
  subtitle: string;
  bullets: string[];
}

interface TermsSectionProps {
  id: number;
  title: string;
  type: "bullet-list" | "complex" | "subsection-list";
  content?: string[];
  subsections?: any[];
}

function BulletListSection({ id, title, content }: BulletListProps) {
  return (
    <div className="mb-8 max-w-7xl mx-auto">
      <h3 className="text-2xl font-bold text-gray-900 mb-4">
        {id}. {title}
      </h3>
      <ul className="space-y-3 ml-4">
        {content?.map((item, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <span className="text-blue-500 font-bold mt-1">•</span>
            <span className="text-gray-700">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DepositTable({ data }: { data: DepositTableProps[] }) {
  return (
    <div className="bg-blue-50 rounded-lg p-6 mb-6 container mx-auto">
      <div className="space-y-3">
        {data.map((row, idx) => (
          <div key={idx} className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">{row.label}</span>
            <span className="text-gray-900 font-semibold">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SubsectionItem({ subtitle, bullets }: SubsectionItemProps) {
  return (
    <div className="mb-6 container mx-auto">
      <h4 className="text-lg font-semibold text-gray-900 mb-3">{subtitle}</h4>
      <ul className="space-y-2 ml-4">
        {bullets.map((bullet, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <span className="text-blue-500 font-bold">•</span>
            <span className="text-gray-700">{bullet}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TermsAndConditionsSection(props: TermsSectionProps) {
  const { id, title, type, content, subsections } = props;

  if (type === "bullet-list") {
    return <BulletListSection id={id} title={title} content={content || []} />;
  }

  if (type === "complex") {
    return (
      <div className="mb-8 container mx-auto">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          {id}. {title}
        </h3>
        {subsections?.map((subsection, idx) => (
          <div key={idx} className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              {subsection.subtitle}
            </h4>
            {subsection.table && <DepositTable data={subsection.table} />}
            {subsection.bullets && (
              <ul className="space-y-2 ml-4">
                {subsection.bullets.map((bullet: string, bulletIdx: number) => (
                  <li key={bulletIdx} className="flex items-start gap-3">
                    <span className="text-blue-500 font-bold">•</span>
                    <span className="text-gray-700">{bullet}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (type === "subsection-list") {
    return (
      <div className="mb-8 container mx-auto">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          {id}. {title}
        </h3>
        {subsections?.map((subsection, idx) => (
          <SubsectionItem
            key={idx}
            subtitle={subsection.subtitle}
            bullets={subsection.bullets}
          />
        ))}
      </div>
    );
  }

  return null;
}
