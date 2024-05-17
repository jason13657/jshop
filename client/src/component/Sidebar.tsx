import Category from "./Category";

type Props = {};

export default function Sidebar({}: Props) {
  return (
    <section className="flex flex-col bg-white p-3 w-48">
      <Category />
    </section>
  );
}
