import { mutation, query } from "./_generated/server";
import {v} from "convex/values";

export const SyncWithClerk=mutation({
    args:{
        name:v.string(),
        email:v.string(),
        isAdmin:v.optional(v.boolean()),
    },
    handler:async(ctx,{email,name,isAdmin})=>{
        if(!email)return null;

        // check if the user exists or not
        const user=await ctx.db.query("users").withIndex("by_email",q=>q.eq("email",email)).first();

        let admin=isAdmin;
        //updating the user if the user exists
        if(user)
            {
            //check if the current user is admin or not
            const checkAdmin=await ctx.db.get(user._id);
            if(checkAdmin?.isAdmin==true)
            {
                admin=true;
            }

            
            await ctx.db.patch(user._id,{
                name,
                isAdmin:admin,
            });

            // Fetch updated user document
            const updatedUser = await ctx.db.get(user._id);
            return updatedUser;
        }
        //creating a new user 
        const newUser=await ctx.db.insert("users",{email,name,isAdmin});
        if(!newUser)return "Failed to Create a New User";
        //returning a new user
        return newUser;
    }
});

export const GetUserByEmail=query({
    args:{
        email:v.string(),
    },
    handler:async(ctx,{email})=>{
        const user=await ctx.db.query("users").withIndex("by_email",q=>q.eq("email",email)).first();
        return user;
    }
})