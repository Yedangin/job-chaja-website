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
    <div className="mb-6 sm:mb-8 container-responsive">
      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
        {id}. {title}
      </h3>
      <ul className="space-y-2 sm:space-y-3 ml-2 sm:ml-4">
        {content?.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2 sm:gap-3">
            <span className="text-blue-500 font-bold mt-1 text-sm sm:text-base">
              •
            </span>
            <span className="text-gray-700 text-sm sm:text-base leading-relaxed">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DepositTable({ data }: { data: DepositTableProps[] }) {
  return (
    <div className="bg-blue-50 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 container-responsive">
      <div className="space-y-2 sm:space-y-3">
        {data.map((row, idx) => (
          <div
            key={idx}
            className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-4"
          >
            <span className="text-gray-700 font-medium text-sm sm:text-base">
              {row.label}
            </span>
            <span className="text-gray-900 font-semibold text-sm sm:text-base">
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SubsectionItem({ subtitle, bullets }: SubsectionItemProps) {
  return (
    <div className="mb-4 sm:mb-6 container-responsive">
      <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
        {subtitle}
      </h4>
      <ul className="space-y-2 ml-2 sm:ml-4">
        {bullets.map((bullet, idx) => (
          <li key={idx} className="flex items-start gap-2 sm:gap-3">
            <span className="text-blue-500 font-bold text-sm sm:text-base">
              •
            </span>
            <span className="text-gray-700 text-sm sm:text-base leading-relaxed">
              {bullet}
            </span>
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
      <div className="mb-6 sm:mb-8 container-responsive">
        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
          {id}. {title}
        </h3>
        {subsections?.map((subsection, idx) => (
          <div key={idx} className="mb-4 sm:mb-6">
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
              {subsection.subtitle}
            </h4>
            {subsection.table && <DepositTable data={subsection.table} />}
            {subsection.bullets && (
              <ul className="space-y-2 ml-2 sm:ml-4">
                {subsection.bullets.map((bullet: string, bulletIdx: number) => (
                  <li
                    key={bulletIdx}
                    className="flex items-start gap-2 sm:gap-3"
                  >
                    <span className="text-blue-500 font-bold text-sm sm:text-base">
                      •
                    </span>
                    <span className="text-gray-700 text-sm sm:text-base leading-relaxed">
                      {bullet}
                    </span>
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
      <div className="mb-6 sm:mb-8 container-responsive">
        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
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
