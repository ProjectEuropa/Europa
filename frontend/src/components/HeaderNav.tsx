import { Icons } from '../icons';

const HeaderNav = () => (
  <nav className="flex gap-8">
    <a
      href="#"
      className="flex items-center gap-2 text-lg text-[#00c8ff] font-normal no-underline hover-glow hover-scale"
    >
      <Icons.Login size={22} color="#00c8ff" />
      ログイン
    </a>
    <a
      href="#"
      className="flex items-center gap-2 text-lg text-[#00c8ff] font-normal no-underline hover-glow hover-scale"
    >
      <Icons.Register size={22} color="#00c8ff" />
      新規登録
    </a>
  </nav>
);

export default HeaderNav;
