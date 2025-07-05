'use client';
import React, { useEffect, useState,FormEvent } from 'react'
import { Carousel,CarouselItem,CarouselContent } from '@/components/ui/carousel'
import Image from 'next/image'
import Link from 'next/link'
import { BrandItem } from '@/components/BrandItem'
import { useUser } from '@clerk/nextjs'
import { api } from '@/convex/_generated/api'
import { useQuery,useMutation } from 'convex/react'
import { Loader2,X,Eye,Upload } from 'lucide-react';
import { toast } from 'sonner';
const Page = () => {
    const {user}=useUser();
    const [Admin,SetAdmin]=useState(false);
    const GetUserByEmail=useQuery(api.users.GetUserByEmail,user?{email:user?.emailAddresses[0].emailAddress??""}:"skip");
    const data=useQuery(api.Brand.GetBrand);
    const [edit,SetEdit]=useState(false);
    const [model,showModel]=useState(false);
    const [BrandName,setBrandName]=useState("");
    const [BrandDescription,setBrandDescription]=useState("");
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState('');
    const [uploading,setUploading]=useState(false);
    const url=useMutation(api.Storage.GenerateUploadUrl);
    const add=useMutation(api.Brand.AddBrand);
    useEffect(()=>{
        if(!user)return;
    
        if(GetUserByEmail?.isAdmin==true)
        {
          SetAdmin(true);
        }else{
          SetAdmin(false);
        }
    },[GetUserByEmail,user]);
    //Toggle Edit function
  function ToggleEdit(){
    return (edit?SetEdit(false):SetEdit(true));
  }
  //ToggleModel Function
  function ToggleModel(args:boolean){
    if(args){
      showModel(false);
    }else{
      showModel(true);
    }
  }
  //Image Upload function
   const handleImageUpload = (event:React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e:ProgressEvent<FileReader>) => {
        const result=e.target?.result;
        if(typeof result==="string")
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };
  // Handle Submit function
  async function handleSubmit(e:FormEvent){
    e.preventDefault();
    setUploading(true);
    if(BrandName.trim() &&BrandDescription.trim() && selectedImage){
        const postUrl=await url();
        const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": selectedImage!.type },
        body: selectedImage,
      });
      const { storageId } = await result.json();
      await add({name:BrandName,ImageStorageId:storageId,description:BrandDescription});
      showModel(false);
      setBrandName("");
      setBrandDescription("");
      setImagePreview("");
      setSelectedImage(null);
      toast("SuccessFully Added!");
      setBrandName("");
      setImagePreview("");
      setSelectedImage(null);
      setUploading(false);
    }
  }
  return (
    <div>
        <div className="w-full  h-[65vh] md:h-[55vh] lg:h-[75vh] custom-height relative overflow-hidden">
        <Carousel className="w-full h-full relative">
          <CarouselContent className="w-full h-full ml-0 cursor-pointer hover:text-red-500">
            <CarouselItem className="relative w-full h-[65vh] md:h-[55vh] lg:h-[75vh] custom-height pl-0">
              <div className="h-full w-full relative z-0">
                <Image src={'/slider.webp'} alt="Slider" fill priority className="object-cover"/>
              </div>
              <div className="absolute inset-0 bg-black/60 z-20 w-full h-full"></div>
              <div className="absolute inset-0 flex items-center justify-center text-center w-full h-full z-30 text-white">
                <div className="bg-black/10 p-20 w-full h-full items-center justify-center flex flex-col">
                  <div className="">
                    <h1 className="text-3xl md:text-6xl lg:text-8xl font-extrabold">Brands</h1>
                    <p className="text-base pt-5 md:p-10 ">We Proudly distribute products from a wide array of renowned brands</p>
                    {
                    Admin?(    
                      <button onClick={()=>ToggleModel(false)} className="bg-red-500 px-4 py-3 cursor-pointer rounded-md text-white text-center border border-red-500 hover:text-red-500 hover:bg-transparent transition-colors duration-300 mb-3">
                        Add Brand
                      </button>
                    ):(null)
                  }
                  </div>
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </div>
      <div className='px-4 md:px-8 lg:px-14 xl:pr-15 my-20 w-full'>
        <div className='grid grid-cols-1 xl:grid-cols-2 justify-center items-center xl:items-start gap-5'>
          <div className='w-full sm:w-full md:w-full xl:w-auto'>
            <Image 
              src={'/tracter.webp'} 
              alt='tracter Image' 
              width={600} 
              height={600} 
              priority 
              className='w-full h-auto lg:h-full object-cover rounded-lg'
            />
          </div>
          <div className='flex flex-col items-center justify-center  xl:items-start gap-5'>
            <h1 className='text-4xl xl:text-6xl font-bold '>The Sun Hing Brands Story</h1>
            <p className='text-justify text-base'>Sysco lives at the heart of food and service. With every product, and every delivery, we demonstrate our passionate commitment to the success of every customer, supplier, community and partner. To support this mission, we routinely evaluate our services and develop solutions to meet our customers&apos; diverse needs. As a result, we have recently undertaken a large-scale revitalization to update our Sysco Brand product designs. Customers will benefit from the clean, consistent look of product names, descriptions and reorder numbers on each package. As always, each of our family of products comes backed by the largest Quality Assurance team in the industry.</p>
          </div>
        </div>
        </div>
      {/* Add Brand Model */}
        {model && (
            <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Add New Brand</h2>
                <button
                    onClick={()=>ToggleModel(true)}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                    title='Close Model'
                >
                    <X size={24} />
                </button>
                </div>
    
                <div className="space-y-4">
                {/* Brand Name Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brand Name
                    </label>
                    <input
                    type="text"
                    value={BrandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter category name"
                    required
                    />
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brand Description
                    </label>
                    <input
                    type="text"
                    value={BrandDescription}
                    onChange={(e) => setBrandDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter category description"
                    required
                    />
                </div>
    
                {/* Image Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brand Image
                    </label>
                    <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span>
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                        </div>
                        <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                        required
                        />
                    </label>
                    </div>
                    {selectedImage && (
                    <p className="text-sm text-gray-600 mt-2">
                        Selected: {selectedImage.name}
                    </p>
                    )}
                </div>
    
                {/* Image Preview */}
                {imagePreview && (
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                        <Eye size={16} />
                        Preview
                    </label>
                    <div className="border rounded-md p-2 bg-gray-50">
                        <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-40 object-cover rounded-md"
                        />
                    </div>
                    </div>
                )}
    
                {/* Submit Button */}
                <div className="flex gap-3 pt-4">
                    <button
                    type="button"
                    onClick={()=>ToggleModel(true)}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                    >
                    Cancel
                    </button>
                    <button
                    type="button"
                    onClick={handleSubmit}
                    className="flex-1 px-4 py-2 bg-red-500 text-center text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50"
                    disabled={!BrandName.trim() || !selectedImage}
                    >
                    {
                        uploading?(<Loader2 className='mx-auto w-4 h-4 animate-spin'></Loader2>):(<span>Add Brand</span>)
                    }
                    </button>
                </div>
                </div>
            </div>
            </div>
        )}
      {/* Brand Grid */}
    <div className='px-4 md:px-8 lg:px-14 xl:pr-15 my-5 w-full'>
        <div className='flex flex-col items-center justify-center gap-10 w-full'>
        <h1 className='text-4xl xl:text-6xl font-bold text-center'>
            Leading Quality - Leading Brands
        </h1>
        <p className='text-base text-center'>We&apos;ve built our reputation and success by focusing on quality, consistency, savings, and variety. We bring the very best to you and your customers.</p>
        {
            Admin?(    
            <button onClick={ToggleEdit} className="bg-red-500 px-4 py-3 cursor-pointer rounded-md text-white text-center border border-red-500 hover:text-red-500 hover:bg-transparent transition-colors duration-300 mb-3">
                Edit Brands
            </button>
            ):(null)
        }
        </div>
        <div className='my-5 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
        {data && data.length > 0 ? (
            data.map((brand) => (
            <BrandItem key={brand._id} Brand={brand} isDelete={edit}/>
            ))
        ) : (
            <div className="col-span-full text-center py-8">
            <p className="text-gray-500">No Brand found.</p>
            </div>
        )}
        </div>
    </div>
      {/* Featured Recipe */}
      <div className="px-4 md:px-8 lg:px-14 xl:px-15 my-10 w-full">
        <div className="flex flex-col items-center justify-center gap-10 w-full">
          <h1 className="text-4xl xl:text-6xl font-bold text-center">Featured Recipe</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
            <div className="flex flex-col items-center md:items-start justify-between gap-5 h-full">
              <div className="rounded-lg relative w-full aspect-[16/9] overflow-hidden">
                <Image
                  src="/r1.webp"
                  alt="Special Food image"
                  fill
                  priority
                  className="object-cover"
                />
              </div>
              <h1 className="text-2xl  font-semibold text-center md:text-left">Cheddar & Grilled Onion Topped Burgers</h1>
              <p className="text-justify text-base text-gray-700">
               Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&apos;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
              </p>
            </div>
            <div className="flex flex-col items-center md:items-start justify-between gap-5 h-full">
              <div className="rounded-lg relative w-full aspect-[16/9] overflow-hidden">
                <Image
                  src="/r2.webp"
                  alt="Special Food image2"
                  fill
                  priority
                  className="object-cover"
                />
              </div>
              <h1 className="text-2xl  font-semibold text-center md:text-left">Stuffed Poblano Peppers</h1>
              <p className="text-justify text-base text-gray-700">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&apos;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
              </p>
            </div>
            <div className="flex flex-col items-center md:items-start justify-between gap-5 h-full">
              <div className="rounded-lg relative w-full aspect-[16/9] overflow-hidden">
                <Image
                  src="/r3.webp"
                  alt="Special Food image3"
                  fill
                  priority
                  className="object-cover"
                />
              </div>
              <h1 className="text-2xl  font-semibold text-center md:text-left">Roasted Guacamole</h1>
              <p className="text-justify text-base  text-gray-700">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&apos;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
              </p>
            </div>
          </div>
          <Link href={'/Recipe'} className="text-white hover:text-red-500 bg-red-500 px-5 py-2 rounded-md border border-red-500 hover:bg-transparent transition-colors duration-300">View More</Link>
        </div>
      </div>
    </div>
  )
}

export default Page
