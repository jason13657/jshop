const CATEGORY = ["pants, shirts, skirts, socks, outerwear"] as const;
export type Category = typeof CATEGORY;

type Props = {};

export default function Category({}: Props) {
  return <div>Category</div>;
}
