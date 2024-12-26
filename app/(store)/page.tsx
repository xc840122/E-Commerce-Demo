import ProductsView from "@/components/ProductsView";
import { getAllProducts } from "@/sanity/lib/products/getAllProducts";


export default async function Home() {
  const products = await getAllProducts();
  return (
    <div>
      <h1>hello world</h1>

      <div>
        <ProductsView products={products} />
      </div>
    </div>
  );
}
