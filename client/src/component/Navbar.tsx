type Props = {};

export default function Navbar({}: Props) {
  return (
    <nav className="flex items-center gap-4 absolute right-5">
      <p className="text-sm font-semibold text-neutral-600">LOGIN</p>
      <p className="text-sm font-semibold text-neutral-600">JOIN</p>
      <p className="text-sm font-semibold text-neutral-600">CART(0)</p>
    </nav>
  );
}
