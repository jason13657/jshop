import Navbar from "./Navbar";

export default function Header() {
  return (
    <header className="flex justify-center bg-white p-4 relative items-center">
      <h1 className="text-2xl font-bold">J Shop</h1>
      <Navbar />
    </header>
  );
}
