import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get all recipes
export const GetRecipes = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("Recipe").collect();
  },
});

// Get recipe by ID
export const GetRecipeById = query({
  args: { id: v.id("Recipe") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get recipes by Brand ID
export const GetRecipesByBrand = query({
  args: { brandId: v.id("Brand") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("Recipe")
      .withIndex("by_BrandId", (q) => q.eq("BrandId", args.brandId))
      .collect();
  },
});


// Add new recipe
export const AddRecipe = mutation({
  args: {
    name: v.string(),
    BrandId: v.id("Brand"),
    description: v.string(),
    ImageUrl: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const newRecipe = await ctx.db.insert("Recipe", {
      name: args.name,
      BrandId: args.BrandId,
      description: args.description,
      ImageUrl: args.ImageUrl,
    });
    return newRecipe;
  },
});

// Update recipe
export const UpdateRecipe = mutation({
  args: {
    id: v.id("Recipe"),
    name: v.string(),
    BrandId: v.id("Brand"),
    description: v.string(),
    ImageUrl: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;
    await ctx.db.patch(id, updateData);
    return id;
  },
});

// Delete recipe
export const DeleteRecipe = mutation({
  args: { id: v.id("Recipe") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return args.id;
  },
});
