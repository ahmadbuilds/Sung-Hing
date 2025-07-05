import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import { Id } from "@/convex/_generated/dataModel";

interface Product {
  _id: Id<"Product">;
  name: string;
  ImageUrl: Id<"_storage">;
  price?: number;
  description?: string;
  _creationTime: number;
}

export const ProductItem = ({ product }: { product: Product }) => {
  const ImageUrl = useQuery(api.Storage.ConvertToUrl, { ImageStorageId: product.ImageUrl });

  return (
    <div  key={product._id} className="group cursor-pointer">
      <div className="relative w-full h-48 md:h-56 lg:h-64 overflow-hidden rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105">
        {ImageUrl ? (
          <Image 
            src={ImageUrl} 
            alt={product.name || 'Product image'} 
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <div className="text-gray-500">Loading...</div>
          </div>
        )}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white font-semibold text-lg">{product.name}</h3>
          {product.price && (
            <p className="text-white/90 text-sm font-medium">${product.price}</p>
          )}
        </div>
      </div>
    </div>
  );
};