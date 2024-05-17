import React from "react";
import { ProductService } from "./service/product";
import Layout from "./component/Layout";

type Props = {};

function App({}: Props) {
  return (
    <>
      <Layout>
        <div className="bg-sky-300 w-full">Hello</div>
      </Layout>
    </>
  );
}

export default App;
