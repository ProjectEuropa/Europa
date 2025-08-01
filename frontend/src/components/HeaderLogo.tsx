import { Icons } from '../icons';

const HeaderLogo = () => (
  <div className="flex flex-col">
    <div className="flex items-center gap-3">
      <Icons.Logo size={32} color="#03C6F9" />
      <div className="text-2xl font-bold text-white leading-tight">EUROPA</div>
    </div>
    <div className="text-sm text-gray-400 ml-10">カルネージハート EXA</div>
  </div>
);

export default HeaderLogo;
