import { mutation, query } from "./_generated/server";
import {v} from "convex/values";

export const AddCategories=mutation({
    args:{
        name:v.string(),
        ImageStorageId:v.id("_storage"),
        description:v.string(),
    },
    handler:async(ctx,{name,ImageStorageId,description})=>{
        await ctx.db.insert("Categories",{
            name,
            ImageUrl:ImageStorageId,
            description
        });
    }
});

export const GetCategories=query({
    handler:async(ctx)=>{
        const values=await ctx.db
        .query("Categories").collect();

        return values;
    }
});

export const GetCategoriesById=query({
    args:{
        id:v.id("Categories")
    },
    handler:async(ctx,{id})=>{
        return await ctx.db.query("Categories").withIndex("by_id",q=>q.eq("_id",id)).first();
    }
})

export const DeleteCategories=mutation({
    args:{
        _id:v.id("Categories")
    },
    handler:async(ctx,{_id})=>{
        
        const products = await ctx.db
        .query("Product")
        .withIndex("by_CategoryId", (q) => q.eq("CategoryId", _id))
        .collect();


        for(const Products of products){
            const carts=await ctx.db.query("Cart").withIndex("by_ProductId",q=>q.eq("ProductId",Products._id)).collect();
            for(const Cart of carts)
            {
                await ctx.db.delete(Cart._id);
            }
            await ctx.db.delete(Products._id);
        }

        await ctx.db.delete(_id);
        return;
    }
});

