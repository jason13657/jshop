import SidebarCard from "./SidebarCard";

const CATEGORY = ["all", "best", "pants", "shirts", "skirts", "socks", "outerwear"] as const;
export type Category = typeof CATEGORY;

type Props = {};

export default function Category({}: Props) {
  return (
    <ul className="flex flex-col gap-4">
      {CATEGORY.map((category) => (
        <SidebarCard text={category} />
      ))}
    </ul>
  );
}
