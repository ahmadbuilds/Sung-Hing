'use client'
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs'
import { useMutation } from 'convex/react';
import { useEffect } from 'react'

const SyncUserWithConvex = () => {
    const {user}=useUser();
    console.log(user);
    const updatedUser=useMutation(api.users.SyncWithClerk);
    useEffect(()=>{
        if(!user)return;

        const syncUser=async()=>{
            
            try{
                await updatedUser({
                    email:user?.emailAddresses[0]?.emailAddress??"",
                    name:`${user.username??""}`.trim(),
                    isAdmin:false
                });
            }catch(err)
            {
                console.log("Error "+err);
            }
        }

        syncUser();

    },[user,updatedUser]);
    return null
}

export default SyncUserWithConvex
