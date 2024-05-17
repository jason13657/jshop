type Props = {
  text: string;
};

export default function SidebarCard({ text }: Props) {
  return (
    <li>
      <p className="uppercase text-lg font-semibold text-neutral-600">{text}</p>
    </li>
  );
}
