import { mutation, query } from "./_generated/server";
import {v} from "convex/values"
export const GenerateUploadUrl=mutation({
    handler:async(ctx)=>{
        return await ctx.storage.generateUploadUrl();
    }
});

export const ConvertToUrl=query({
    args:{
        ImageStorageId:v.id("_storage")
    },
    handler:async(ctx,{ImageStorageId})=>{
        return await ctx.storage.getUrl(ImageStorageId);
    }
})