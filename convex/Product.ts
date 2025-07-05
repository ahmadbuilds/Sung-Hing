import { mutation, query } from "./_generated/server";
import {v} from "convex/values";

export const GetProductByCategory=query({
    args:{
        id:v.id("Categories"),
    },
    handler:async(ctx,{id})=>{
        const products=await ctx.db.query("Product")
        .withIndex("by_CategoryId",q=>q.eq("CategoryId",id))
        .collect();

        const filteredProducts = products.filter(product => product.Quantity !== 0);

        return filteredProducts;
    }
});

export const UpdateQuantity = mutation({
    args: {
        id: v.id("Product"),
        quantity: v.number(),
    },
    handler: async (ctx, { id, quantity }) => {
        await ctx.db.patch(id, {
            Quantity: quantity,
        });
    }
});


export const AddProduct=mutation({
    args:{
        name:v.string(),
        ImageUrl:v.id("_storage"),
        description:v.string(),
        Quantity:v.number(),
        CategoryId:v.id("Categories"),
        price:v.number(),
        brandId:v.optional(v.id("Brand")),
    },
    handler:async(ctx,args)=>{
        const newProduct=await ctx.db.insert("Product",{
            name:args.name,
            ImageUrl:args.ImageUrl,
            description:args.description,
            Quantity:args.Quantity,
            CategoryId:args.CategoryId,
            price:args.price,
            BrandId:args.brandId
        });

        return newProduct;
    }
});

export const DeleteProduct=mutation({
    args:{
        id:v.id("Product")
    },
    handler:async(ctx,{id})=>{
        await ctx.db.delete(id);
    }
});

export const GetProductByBrandId=query({
    args:{
        id:v.id("Brand"),
    },
    handler:async(ctx,{id})=>{
        const products=await ctx.db.query("Product").withIndex("by_BrandId",q=>q.eq("BrandId",id))
        .collect();

        const filteredProducts = products.filter(product=>product.Quantity!==0);

        return filteredProducts;
    }
});

export const GetProduct=query({
    handler:async(ctx)=>{
        return await ctx.db.query("Product").collect();
    }
});

export const UpdateProduct = mutation({
  args: {
    id: v.id("Product"), 
    name: v.string(), 
    ImageUrl:v.id("_storage"),
    description:v.string(),
    Quantity: v.number(),
    CategoryId:v.id("Categories"),
    price: v.number(),
    BrandId: v.optional(v.id("Brand")),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;

    const existingProduct = await ctx.db.get(id);
    if (!existingProduct) {
      throw new Error("Product not found");
    }

    await ctx.db.patch(id, {
      ...updates,
    });

    return { success: true, message: "Product updated successfully" };
  },
});
