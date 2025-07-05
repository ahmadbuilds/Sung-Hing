import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  //users Table
  users: defineTable({
    email: v.string(),
    name:v.string(),
    isAdmin:v.optional(v.boolean()),
  }).index("by_email",["email"])
  .index("is_Admin",["isAdmin"]),

  //Categories Table
  Categories:defineTable({
    name:v.string(),
    ImageUrl:v.id("_storage"),
    description:v.string()
  })
  .index("by_name",["name"]),

  //Product Table
  Product:defineTable({
    name:v.string(),
    ImageUrl:v.id("_storage"),
    description:v.string(),
    Quantity:v.number(),
    CategoryId:v.id("Categories"),
    price:v.number(),
    BrandId:v.optional(v.id("Brand")),
  }).index("by_CategoryId",["CategoryId"])
  .index("by_BrandId",["BrandId"]),

  //Brand Table
  Brand:defineTable({
    name:v.string(),
    ImageUrl:v.id("_storage"),
    description:v.string()
  }),

  //Cart Table
  Cart:defineTable({
    userId:v.id("users"),
    ProductId:v.id("Product"),
    Quantity:v.number(),
  }).index("by_userId",["userId"])
  .index("by_ProductId",["ProductId"]),

  //Recipe Table
  Recipe:defineTable({
    name:v.string(),
    BrandId:v.id("Brand"),
    description:v.string(),
    ImageUrl:v.id("_storage"),
  }).index("by_BrandId",["BrandId"])
});