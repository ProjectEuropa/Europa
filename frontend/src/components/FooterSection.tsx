type FooterSectionProps = {
  title: string;
  links: { jp: string; en?: string; href?: string }[];
};

const FooterSection = ({ title, links }: FooterSectionProps) => (
  <div className="min-w-[150px] mb-8">
    <h3 className="text-base font-semibold mb-3 text-primary">{title}</h3>
    <ul className="space-y-2">
      {links.map((item, i) => (
        <li key={i}>
          <a
            href={item.href || "#"}
            className="text-white hover:text-[#00c8ff] transition-colors duration-200 text-sm"
          >
            {item.jp}
            {item.en && <span className="ml-2 text-xs text-gray-400">({item.en})</span>}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

export default FooterSection;
