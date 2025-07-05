import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import { Id } from "@/convex/_generated/dataModel";
import { X } from "lucide-react";
import Link from "next/link";
interface Brand {
  _id: Id<"Brand">;
  name: string;
  ImageUrl: Id<"_storage">;
  _creationTime:number;
}
export const BrandItem = ({ Brand,isDelete }: { Brand: Brand;isDelete:boolean }) => {
  const ImageUrl = useQuery(api.Storage.ConvertToUrl, { ImageStorageId: Brand.ImageUrl });
  const del=useMutation(api.Brand.DeleteBrand);

    const DeleteBrand = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation(); 
    event.preventDefault();  

    try {
      await del({ _id: Brand._id });
    } catch (err) {
      console.error("Failed to delete the Brand", err);
    }
  };

  //console.log(ImageUrl);
  return (
    <Link href={`/Brand/${Brand._id}`} key={Brand._id} className="group cursor-pointer">
      <div className="relative w-full h-48 md:h-56 lg:h-64 overflow-hidden rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105">
        {ImageUrl ? (
          <Image 
            src={ImageUrl} 
            alt={Brand.name || 'Brand image'} 
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
          <h3 className="text-white font-semibold text-lg">{Brand.name}</h3>
        </div>
        {
          isDelete&&(
            <button type="button" className="absolute right-4 top-4" title="Delete" onClick={DeleteBrand}>
              <X className="w-6 h-6 text-white rounded-full bg-red-500 hover:bg-red-600 cursor-pointer"></X>
            </button>
          )
        }
      </div>
    </Link>
  );
};