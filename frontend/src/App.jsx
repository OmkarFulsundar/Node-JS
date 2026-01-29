import Category from "./components/Category";
import Product from "./components/Product";

export default function App() {
  return (
    <>
      <h1 style={{ textAlign: "center" }}>Category & Product Master</h1>
      <Category />
      <hr />
      <Product />
    </>
  );
}
