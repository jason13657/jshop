import Header from "./Header";
import Sidebar from "./Sidebar";

type Props = {
  children?: JSX.Element;
};
export default function Layout({ children }: Props) {
  return (
    <>
      <Header />
      <div className="flex">
        <Sidebar />
        {children}
      </div>
    </>
  );
}
