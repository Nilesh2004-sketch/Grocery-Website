import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import ProductCard from './ProductCard';

const BestSeller = () => {
    const { products, navigate } = useContext(AppContext);
  return (
    <div className='mt-16'>
        <div className='flex justify-between items-center'>
            <p className='text-2xl font-medium md:text-3xl '>Best Sellers</p>
            <button
                onClick={() => { navigate('/products'); scrollTo(0, 0); }}
                className='text-indigo-600 font-medium hover:underline text-sm md:text-base cursor-pointer'
            >
                View All &rarr;
            </button>
        </div>
        <div className='my-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 items-center justify-center'>
            {
                products?.filter((product)=>product?.inStock)
                .slice(0, 10)
                .map((product, index)=>(
                   product && <ProductCard key={product._id || index} product={product} />
                ))
            }
        </div>
    </div>
  )
}

export default BestSeller  
