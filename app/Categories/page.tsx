'use client'
import Image from 'next/image'
import { Carousel,CarouselItem,CarouselContent } from '@/components/ui/carousel'
import { useUser } from '@clerk/nextjs'
import { FormEvent, useEffect, useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import {X, Upload, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { CategoryItem } from '@/components/CategoryItem';
import Link from 'next/link';
const Page = () => {
  const [categoryName,setCategoryName]=useState("");
  const [categoryDescription,setCategoryDescription]=useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [Admin,SetAdmin]=useState(false);
  const [model,showModel]=useState(false);
  const [edit,SetEdit]=useState(false);
  const {user}=useUser();
  const [uploading,setUploading]=useState(false);
  const data=useQuery(api.Categories.GetCategories);
  const add=useMutation(api.Categories.AddCategories);
  const url=useMutation(api.Storage.GenerateUploadUrl);
  const GetUserByEmail=useQuery(api.users.GetUserByEmail,user?{email:user?.emailAddresses[0].emailAddress??""}:"skip");
  useEffect(()=>{
    if(!user)return;

    if(GetUserByEmail?.isAdmin==true)
    {
      SetAdmin(true);
    }else{
      SetAdmin(false);
    }
  },[GetUserByEmail,user]);

  //ToggleModel Function
  function ToggleModel(args:boolean){
    if(args){
      showModel(false);
    }else{
      showModel(true);
    }
  }
  //Toggle Edit function
  function ToggleEdit(){
    return (edit?SetEdit(false):SetEdit(true));
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
    if(categoryName.trim() &&categoryDescription.trim() && selectedImage){
        const postUrl=await url();
        const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": selectedImage!.type },
        body: selectedImage,
      });
      const { storageId } = await result.json();
      await add({name:categoryName,ImageStorageId:storageId,description:categoryDescription});
      showModel(false);
      setCategoryName("");
      setCategoryDescription("");
      setImagePreview("");
      setSelectedImage(null);
      toast("SuccessFully Added!");
      setCategoryName("");
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
                    <h1 className="text-3xl md:text-6xl lg:text-8xl font-extrabold">Categories</h1>
                    <p className="text-base pt-5 md:p-10 ">Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                    Lorem Ipsum has been the industry&apos;s standard dummy text ever since the 1500s.</p>
                  </div>
                  {
                    Admin?(    
                      <button onClick={()=>ToggleModel(false)} className="bg-red-500 px-4 py-3 cursor-pointer rounded-md text-white text-center border border-red-500 hover:text-red-500 hover:bg-transparent transition-colors duration-300 mb-3">
                        Add Categories
                      </button>
                    ):(null)
                  }
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </div>
      {/* Add Categories Model */}
      {model && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Add New Category</h2>
              <button
                onClick={()=>ToggleModel(true)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                title='Close Model'
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Category Name Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter category name"
                  required
                />
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Description
                </label>
                <input
                  type="text"
                  value={categoryDescription}
                  onChange={(e) => setCategoryDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter category description"
                  required
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Image
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
                  disabled={!categoryName.trim() || !selectedImage}
                >
                  {
                    uploading?(<Loader2 className='mx-auto w-4 h-4 animate-spin'></Loader2>):(<span>Add Category</span>)
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Categories Grid */}
      <div className='px-4 md:px-8 lg:px-14 xl:pr-15 my-5 w-full'>
        <div className='flex flex-col items-center justify-center gap-10 w-full'>
          <h1 className='text-4xl xl:text-6xl font-bold'>
              Our Products
          </h1>
          <p className='text-base text-center'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&apos;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
          {
            Admin?(    
              <button onClick={ToggleEdit} className="bg-red-500 px-4 py-3 cursor-pointer rounded-md text-white text-center border border-red-500 hover:text-red-500 hover:bg-transparent transition-colors duration-300 mb-3">
                Edit Categories
              </button>
            ):(null)
          }
        </div>
        
        <div className='my-5 w-full flex flex-wrap gap-5 items-center justify-center'>
          {data && data.length > 0 ? (
            data.map((category) => (
              <div key={category._id} className="w-full md:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)] xl:w-[calc(25%-15px)]">
                <CategoryItem category={category} isDelete={edit}/>
              </div>
            ))
          ) : (
            <div className="w-full text-center py-8">
              <p className="text-gray-500">No categories found.</p>
            </div>
          )}
        </div>
      </div>
      {/* Specialty Foods */}
      <div className="px-4 md:px-8 lg:px-14 xl:pr-15 my-10 w-full">
        <div className="flex flex-col items-center justify-center gap-10 w-full">
          <h1 className="text-4xl xl:text-6xl font-bold">Featured Recipe</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center md:items-start justify-center gap-5">
              <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden">
                <Image
                  src="/special.webp"
                  alt="Special Food image"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              </div>
              <h1 className="text-3xl font-semibold">Lorem Ipsum</h1>
              <p className="text-justify text-base">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&apos;s standard dummy text ever since the 1500s, when an unknown printer.
              </p>
              <Link href={'/Product'} className='text-red-500 underline text-base'>Learn More</Link>
            </div>
            <div className="hidden md:flex flex-col items-center md:items-start justify-center gap-5">
              <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden">
                <Image
                  src="/about.webp"
                  alt="Special Food image"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              </div>
              <h1 className="text-3xl font-semibold">Lorem Ipsum</h1>
              <p className="text-justify text-base">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&apos;s standard dummy text ever since the 1500s, when an unknown printer.
              </p>
              <Link href={'/Product'} className='text-red-500 underline text-base'>Learn More</Link>
            </div>
          </div>
        </div>
      </div>
      {/* Featured Recipes */}
      <div className="px-4 md:px-8 lg:px-14 xl:px-15 my-10 w-full">
        <div className="flex flex-col items-center justify-center gap-10 w-full">
          <h1 className="text-4xl xl:text-6xl font-bold text-center">Specialty Foods</h1>
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
              <h1 className="text-3xl  font-semibold text-center md:text-left">Cheddar & Grilled Onion Topped Burgers</h1>
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
              <h1 className="text-3xl font-semibold text-center md:text-left">Stuffed Poblano Peppers</h1>
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
              <h1 className="text-3xl  font-semibold text-center md:text-left">Roasted Guacamole</h1>
              <p className="text-justify text-base text-gray-700">
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
