import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";

export const useConvert=(ImageUrl:Id<"_storage">)=>{
    const Image=useQuery(api.Storage.ConvertToUrl,{
        ImageStorageId:ImageUrl
    });
    return Image;
}