import { mutation, query } from "./_generated/server";
import {v} from "convex/values";

export const AddToCart=mutation({
    args:{
        userId:v.id("users"),
        ProductId:v.id("Product"),
        Quantity:v.number(),
    },
    handler:async(ctx,{userId,ProductId,Quantity})=>{
        const existing=await ctx.db.query("Cart").withIndex("by_ProductId",q=>q.eq("ProductId",ProductId)).first();
        if(existing)
        {
            const quantity=existing.Quantity+Quantity;

            return await ctx.db.patch(existing._id,{Quantity:quantity});
        }
        const newCart=await ctx.db.insert("Cart",{userId,ProductId,Quantity});
        return newCart;
    }
});
export const GetCartByUser=query({
    args:{
        userId:v.id("users"),
    },
    handler:async(ctx,{userId})=>{
        const carts=await ctx.db.query("Cart").withIndex("by_userId",q=>q.eq("userId",userId)).collect();
        return carts;
    }
})
export const DeleteCart=mutation({
    args:{
        id:v.id("Cart"),
    },
    handler:async(ctx,{id})=>{
        const existing=await ctx.db.get(id);
        if(!existing)
        {
            throw new Error("Cart not Found");
        }
        const itemsToAdd=existing?.Quantity;
        const pId=existing?.ProductId;
        
        const product=await ctx.db.get(pId);
        if(!product)
        {
            throw new Error("Product not found");
        }
        await ctx.db.patch(pId,{
            Quantity:product?.Quantity+itemsToAdd
        });

        return await ctx.db.delete(id);
    }
});

export const UpdateCart = mutation({
  args: {
    id: v.id("Cart"),
    Quantity: v.number(),
  },
  handler: async (ctx, { id, Quantity }) => {
    if (Quantity <= 0) {
      throw new Error("Quantity must be at least 1.");
    }

    const existing = await ctx.db.get(id);
    if (!existing) {
      throw new Error("Cart not found.");
    }

    if (Quantity === existing.Quantity) return;

    const product = await ctx.db.get(existing.ProductId);
    if (!product) {
      throw new Error("Product not found.");
    }

    const delta = Quantity - existing.Quantity;

    if (delta > 0) {
      if (product.Quantity < delta) {
        throw new Error(
          `Not enough stock available. Only ${product.Quantity} left.`
        );
      }
      await ctx.db.patch(product._id, {
        Quantity: product.Quantity - delta,
      });
    } else {
      await ctx.db.patch(product._id, {
        Quantity: product.Quantity + Math.abs(delta),
      });
    }

    await ctx.db.patch(id, { Quantity });

    return { success: true };
  },
});
