import { mutation, query } from "./_generated/server";
import {v} from "convex/values";
export const AddBrand=mutation({
    args:{
        name:v.string(),
        ImageStorageId:v.id("_storage"),
        description:v.string(),
    },
    handler:async(ctx,{name,ImageStorageId,description})=>{
        await ctx.db.insert("Brand",{
            name,
            ImageUrl:ImageStorageId,
            description
        });
    }

});

export const GetBrand=query({
    handler:async(ctx)=>{
        const values=await ctx.db
        .query("Brand").collect();

        return values;
    }
});

export const GetBrandById=query({
    args:{
        id:v.id("Brand")
    },
    handler:async(ctx,{id})=>{
        return await ctx.db.query("Brand").withIndex("by_id",q=>q.eq("_id",id)).first();
    }
});

export const DeleteBrand=mutation({
    args:{
        _id:v.id("Brand")
    },
    handler:async(ctx,{_id})=>{
        const products = await ctx.db
        .query("Product")
        .withIndex("by_BrandId", (q) => q.eq("BrandId", _id))
        .collect();

        for(const Products of products){
            const carts=await ctx.db.query("Cart").withIndex("by_ProductId",q=>q.eq("ProductId",Products._id)).collect();
            for(const Cart of carts)
            {
                await ctx.db.delete(Cart._id);
            }

            await ctx.db.delete(Products._id);
        }

        const recipe=await ctx.db.query
        ("Recipe").withIndex("by_BrandId",q=>q.eq("BrandId",_id)).collect();
        for (const Recipe of recipe)
        {
            await ctx.db.delete(Recipe._id);
        }

        await ctx.db.delete(_id);
        return;
    }
});