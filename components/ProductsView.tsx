import { Product } from '@/sanity.types'

interface ProductsViewProps {
  products: Product[]
}

const ProductsView = ({ products }: ProductsViewProps) => {
  return (
    <div className='flex flex-col'>
      {/* categories */}
      <div className='w-full sm:w-[200px]'>
        {/* CategorySelectorComponent categories={categories} /> */}
      </div>

      {/* products */}
      <div>
        <div>
          {/* <ProductGrid products={products} /> */}

          <hr className='w-1/2 sm:w-3/4' />
        </div>
      </div>
    </div>)
}

export default ProductsView