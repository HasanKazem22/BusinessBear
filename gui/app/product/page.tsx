import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const products = [
  {
    id: 1,
    name: "realme Note 60x (4/64GB)",
    price: "Tk. 12,999",
    originalPrice: "",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80",
    brandLogo: "realme",
    rating: 5.0,
  },
  {
    id: 2,
    name: "iPhone 17",
    price: "Tk. 1,47,499",
    originalPrice: "Tk. 1,79,999",
    image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&q=80",
    brandLogo: "Authorized Reseller",
    rating: 5.0,
  },
  {
    id: 3,
    name: "iPhone 17 Pro",
    price: "Tk. 1,97,499",
    originalPrice: "Tk. 2,29,999",
    image: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=800&q=80",
    brandLogo: "Authorized Reseller",
    rating: 5.0,
  },
  {
    id: 4,
    name: "iPhone Air",
    price: "Tk. 1,64,999",
    originalPrice: "Tk. 1,89,999",
    image: "https://images.unsplash.com/photo-1592890288564-76628a30a657?w=800&q=80",
    brandLogo: "Authorized Reseller",
    rating: 5.0,
  },
  {
    id: 5,
    name: "Samsung Galaxy S26",
    price: "Tk. 1,29,999",
    originalPrice: "Tk. 1,49,999",
    image: "https://images.unsplash.com/photo-1610792516307-ea5acd3c3800?w=800&q=80",
    brandLogo: "Authorized Reseller",
    rating: 5.0,
  },
  {
    id: 6,
    name: "Samsung Galaxy S26",
    price: "Tk. 1,29,999",
    originalPrice: "Tk. 1,49,999",
    image: "https://images.unsplash.com/photo-1610792516307-ea5acd3c3800?w=800&q=80",
    brandLogo: "Authorized Reseller",
    rating: 5.0,
  },
];

export default function ProductPage() {
  return (
    <div className="h-full overflow-y-auto py-8 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {products.map((product) => (
            <Card key={product.id} className="shadow-none border border-zinc-200/60 dark:border-zinc-800/60 bg-card transition-colors duration-300">
              <div className="p-3 flex flex-col items-center flex-1">
                {/* Product Image */}
                <div className="relative w-full aspect-[4/3] mb-3">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain"
                  />
                </div>

                {/* Brand Logo Placeholder */}
                <div className="mb-1 h-4 flex items-center justify-center">
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">
                    {product.brandLogo}
                  </span>
                </div>

                {/* Product Name */}
                <h3 className="text-center font-medium text-[#1e293b] dark:text-zinc-100 text-xs mb-2 line-clamp-2 px-1">
                  {product.name}
                </h3>

                {/* Price */}
                <div className="flex flex-col items-center gap-0.5 mb-2">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-zinc-950 dark:text-[#25D379] font-bold text-sm">
                      {product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-zinc-400 text-[9px] line-through">
                        {product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-2.5 h-2.5 text-[#facc15] fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-[9px] text-zinc-400 font-medium">
                    ({product.rating.toFixed(1)})
                  </span>
                </div>

                {/* Buy Now Button */}
                <Button
                  variant="outline"
                  className="w-full mt-auto rounded-full border-zinc-200 dark:border-[#25D379] text-zinc-950 dark:text-[#25D379] hover:bg-zinc-950 hover:text-white dark:hover:bg-[#25D379] dark:hover:text-black transition-colors py-1 h-8 text-[11px] font-semibold bg-white dark:bg-[#25D379]/5"
                >
                  Buy Now
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
