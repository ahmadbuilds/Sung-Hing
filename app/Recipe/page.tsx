'use client';

import React from 'react'
import { Carousel, CarouselItem, CarouselContent } from '@/components/ui/carousel'
import { useState, useEffect, FormEvent, useMemo } from 'react'
import { useUser } from '@clerk/nextjs'
import Image from 'next/image'
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { X, Upload, Eye, Search, ChevronDown, Edit, Trash2, Plus, BookOpen, ChefHat } from 'lucide-react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Id } from '@/convex/_generated/dataModel';
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// Types
interface RecipeType {
  _id: Id<"Recipe">,
  name: string,
  BrandId: Id<"Brand">,
  description: string,
  ImageUrl: Id<"_storage">,
  _creationTime: number
}

interface BrandType {
  _id: Id<"Brand">,
  name: string,
  ImageUrl: Id<"_storage">,
  description: string
}

type Option = {
  value: string;
  label: string;
};

type CustomDropdownProps = {
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  options: Option[];
  className?: string;
  width?: string;
};

// Custom Dropdown Component
const CustomDropdown: React.FC<CustomDropdownProps> = ({
  value,
  onValueChange,
  placeholder,
  options,
  className = "",
  width = "w-[180px]",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className={`relative ${width}`} ref={dropdownRef}>
      <button
        title='Button'
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`${width} min-h-12 px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-red-500 hover:text-white hover:border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none transition-colors duration-300 cursor-pointer flex items-center justify-between ${className}`}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 ml-2 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              title='Options'
              onClick={() => {
                onValueChange(option.value);
                setIsOpen(false);
              }}
              className="w-full px-3 py-2 text-left text-sm hover:bg-red-500 hover:text-white cursor-pointer transition-colors duration-200 border-b border-gray-100 last:border-b-0 focus:outline-none focus:ring-0"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Recipe Details Modal Component
const RecipeDetailsModal: React.FC<{
  recipe: RecipeType;
  brand: BrandType | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ recipe, brand, isOpen, onClose }) => {
  const url = useQuery(api.Storage.ConvertToUrl, { ImageStorageId: recipe.ImageUrl });
  const brandImageUrl = useQuery(api.Storage.ConvertToUrl, 
    brand ? { ImageStorageId: brand.ImageUrl } : "skip"
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-red-500" />
            Recipe Details
          </h2>
          <button
            title='Close'
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Recipe Image */}
          <div className="relative h-64 w-full rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={url || '/placeholder.png'}
              alt={recipe.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Recipe Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800 break-words">{recipe.name}</h3>
            
            {/* Brand Info */}
            {brand && (
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 relative rounded-full overflow-hidden bg-gray-200">
                  <Image
                    src={brandImageUrl || '/placeholder.png'}
                    alt={brand.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-600">By Brand</p>
                  <p className="font-semibold text-gray-800 break-words">{brand.name}</p>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-800">Description</h4>
              <p className="text-gray-600 leading-relaxed break-words whitespace-pre-wrap overflow-wrap-anywhere">
                {recipe.description}
              </p>
            </div>

            {/* Recipe Badge */}
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                <ChefHat className="w-4 h-4 mr-1" />
                Recipe
              </span>
              {brand && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 break-words">
                  {brand.name}
                </span>
              )}
            </div>
          </div>

          <div className="pt-4">
            <Button
              onClick={onClose}
              className="w-full bg-red-500 hover:bg-red-600 text-white"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
const RecipeCard: React.FC<{ 
  recipe: RecipeType; 
  brand: BrandType | null;
  isAdmin: boolean; 
  onEdit: (recipe: RecipeType) => void;
  onViewDetails: (recipe: RecipeType) => void;
}> = ({ recipe, brand, isAdmin, onEdit, onViewDetails }) => {
  const ImageUrl = useQuery(api.Storage.ConvertToUrl, { 
    ImageStorageId: recipe.ImageUrl 
  });

  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card 
      className="group relative overflow-hidden bg-white border-0 shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 rounded-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Recipe Image Container */}
      <div className="relative h-64 w-full overflow-hidden rounded-t-2xl bg-gradient-to-br from-gray-100 to-gray-200">
        {ImageUrl ? (
          <Image
            src={ImageUrl}
            alt={recipe.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <div className="animate-pulse">
              <div className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-gray-600" />
              </div>
            </div>
          </div>
        )}
        
        {/* Recipe Badge */}
        <div className="absolute top-4 left-4">
          <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
            <ChefHat className="w-4 h-4" />
            Recipe
          </div>
        </div>

        {/* Brand Badge */}
        {brand && (
          <div className="absolute top-4 right-4">
            <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
              {brand.name}
            </div>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      {/* Recipe Info */}
      <CardContent className="p-6 space-y-4">
        <CardTitle className="text-xl font-bold text-gray-800 line-clamp-2 leading-tight group-hover:text-red-600 transition-colors duration-300">
          {recipe.name}
        </CardTitle>
        
        <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
          {recipe.description || 'Discover this amazing recipe with delicious ingredients and easy-to-follow instructions.'}
        </p>
        
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <ChefHat className="w-3 h-3 mr-1" />
            Recipe
          </span>
          {brand && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {brand.name}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          {/* View Details Button */}
          <Button
            onClick={() => onViewDetails(recipe)}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            View Recipe
          </Button>

          {/* Edit Button for Admin */}
          {isAdmin && (
            <Button
              onClick={() => onEdit(recipe)}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit Recipe
            </Button>
          )}
        </div>
      </CardContent>

      {/* Hover Effect Border */}
      <div className={`absolute inset-0 rounded-2xl transition-all duration-300 pointer-events-none ${
        isHovered ? 'ring-2 ring-red-500 ring-offset-2' : ''
      }`} />
    </Card>
  );
};

const Page = () => {
  const [Admin, SetAdmin] = useState(false);
  const [model, showModel] = useState(false);
  const [editModel, setEditModel] = useState(false);
  const [detailsModel, setDetailsModel] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<RecipeType | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeType | null>(null);
  const [uploading, setUploading] = useState(false);
  const [recipeName, setRecipeName] = useState("");
  const [recipeDescription, setRecipeDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [brandId, setBrandId] = useState<Id<"Brand"> | "">("");
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [brandFilter, setBrandFilter] = useState('all');
  const [deleting, setDeleting] = useState(false);
  
  const { user } = useUser();
  const getBrand = useQuery(api.Brand.GetBrand);
  const getAllRecipes = useQuery(api.Recipe.GetRecipes);
  const url = useMutation(api.Storage.GenerateUploadUrl);
  const add = useMutation(api.Recipe.AddRecipe);
  const updateRecipe = useMutation(api.Recipe.UpdateRecipe);
  const deleteRecipe = useMutation(api.Recipe.DeleteRecipe);
  const GetUserByEmail = useQuery(api.users.GetUserByEmail, user ? { email: user?.emailAddresses[0].emailAddress ?? "" } : "skip");
  
  useEffect(() => {
    if (!user) return;

    if (GetUserByEmail?.isAdmin == true) {
      SetAdmin(true);
    } else {
      SetAdmin(false);
    }
  }, [GetUserByEmail, user]);

  // Dropdown options
  const sortOptions = [
    { value: 'name', label: 'Sort by Name' },
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' }
  ];

  const brandOptions = [
    { value: 'all', label: 'All Brands' },
    ...(getBrand?.map(brand => ({ value: brand._id, label: brand.name })) || [])
  ];

  // Filter and sort recipes
  const filteredAndSortedRecipes = useMemo(() => {
    if (!getAllRecipes) return [];
    
    let filtered = getAllRecipes.filter(recipe =>
      recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Brand filter
    if (brandFilter !== 'all') {
      filtered = filtered.filter(recipe => recipe.BrandId === brandFilter);
    }

    // Sort recipes
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b._creationTime - a._creationTime;
        case 'oldest':
          return a._creationTime - b._creationTime;
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [getAllRecipes, searchTerm, sortBy, brandFilter]);

  // Get brand info for recipe
  const getBrandInfo = (brandId: Id<"Brand">) => {
    return getBrand?.find(brand => brand._id === brandId) || null;
  };

  // Toggle Model Function
  function ToggleModel(args: boolean) {
    if (args) {
      showModel(false);
    } else {
      showModel(true);
    }
  }

  // Edit Recipe Function
  const handleEditRecipe = (recipe: RecipeType) => {
    setEditingRecipe(recipe);
    setRecipeName(recipe.name);
    setRecipeDescription(recipe.description);
    setBrandId(recipe.BrandId);
    setEditModel(true);
  };

  // View Recipe Details
  const handleViewDetails = (recipe: RecipeType) => {
    setSelectedRecipe(recipe);
    setDetailsModel(true);
  };

  // Reset Edit Form
  const resetEditForm = () => {
    setEditingRecipe(null);
    setRecipeName("");
    setRecipeDescription("");
    setImagePreview("");
    setSelectedImage(null);
    setBrandId("");
    setEditModel(false);
  };

  // Image Upload function
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result;
        if (typeof result === "string")
          setImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Submit function
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setUploading(true);
    
    if (recipeName.trim() && recipeDescription.trim() && selectedImage && brandId) {
      try {
        const postUrl = await url();
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": selectedImage!.type },
          body: selectedImage,
        });
        const { storageId } = await result.json();
        await add({
          name: recipeName,
          BrandId: brandId as Id<"Brand">,
          description: recipeDescription,
          ImageUrl: storageId,
        });
        
        // Reset form
        showModel(false);
        setRecipeName("");
        setRecipeDescription("");
        setImagePreview("");
        setSelectedImage(null);
        setBrandId("");
        
        toast("Recipe Successfully Added!");
      } catch (error) {
        console.error("Error adding recipe:", error);
        toast("Error adding recipe. Please try again.");
      } finally {
        setUploading(false);
      }
    } else {
      toast("Please fill in all required fields.");
      setUploading(false);
    }
  }

  // Handle Edit Submit
  async function handleEditSubmit(e: FormEvent) {
    e.preventDefault();
    if (!editingRecipe) return;
    
    setUploading(true);
    
    if (recipeName.trim() && recipeDescription.trim() && brandId) {
      try {
        let imageStorageId = editingRecipe.ImageUrl;
        
        // If new image is selected, upload it
        if (selectedImage) {
          const postUrl = await url();
          const result = await fetch(postUrl, {
            method: "POST",
            headers: { "Content-Type": selectedImage.type },
            body: selectedImage,
          });
          const { storageId } = await result.json();
          imageStorageId = storageId;
        }
        
        await updateRecipe({
          id: editingRecipe._id,
          name: recipeName,
          BrandId: brandId as Id<"Brand">,
          description: recipeDescription,
          ImageUrl: imageStorageId,
        });
        
        resetEditForm();
        toast("Recipe Successfully Updated!");
      } catch (error) {
        console.error("Error updating recipe:", error);
        toast("Error updating recipe. Please try again.");
      } finally {
        setUploading(false);
      }
    } else {
      toast("Please fill in all required fields.");
      setUploading(false);
    }
  }

  // Handle Delete Recipe
  async function handleDeleteRecipe() {
    if (!editingRecipe) return;
    
    setDeleting(true);
    try {
      await deleteRecipe({ id: editingRecipe._id });
      resetEditForm();
      toast("Recipe Successfully Deleted!");
    } catch (error) {
      console.error("Error deleting recipe:", error);
      toast("Error deleting recipe. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="w-full h-[65vh] md:h-[55vh] lg:h-[75vh] custom-height relative overflow-hidden">
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
                    <h1 className="text-3xl md:text-6xl lg:text-8xl font-extrabold">Recipe</h1>
                    <p className="text-base pt-5 md:p-10">Discover delicious recipes from renowned brands with step-by-step instructions.</p>
                    {Admin && (
                      <button onClick={() => ToggleModel(false)} className="bg-red-500 px-4 py-3 cursor-pointer rounded-md text-white text-center border border-red-500 hover:text-red-500 hover:bg-transparent transition-colors duration-300 mb-3">
                        Add Recipe
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </div>

      {/* Search and Filter Section */}
      <div className='px-4 md:px-8 lg:px-14 xl:pr-15 my-10 w-full'>
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search recipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 border-gray-300 focus:border-red-500 focus:ring-red-500 bg-white"
            />
          </div>
          {/* Sort and Filter Dropdowns */}
          <div className="flex gap-2">
            <CustomDropdown
              value={sortBy}
              onValueChange={setSortBy}
              placeholder="Sort by"
              options={sortOptions}
              width="w-[150px]"
            />

            <CustomDropdown
              value={brandFilter}
              onValueChange={setBrandFilter}
              placeholder="Filter by brand"
              options={brandOptions}
              width="w-[180px]"
            />
          </div>
        </div>

        {/* Recipes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredAndSortedRecipes.length > 0 ? (
            filteredAndSortedRecipes.map((recipe) => (
              <RecipeCard 
                key={recipe._id} 
                recipe={recipe} 
                brand={getBrandInfo(recipe.BrandId)}
                isAdmin={Admin}
                onEdit={handleEditRecipe}
                onViewDetails={handleViewDetails}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-500">
                <h3 className="text-xl font-medium mb-2">No recipes found</h3>
                <p className="mb-4">Try adjusting your search terms or filters.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recipe Details Modal */}
      {selectedRecipe && (
        <RecipeDetailsModal
          recipe={selectedRecipe}
          brand={getBrandInfo(selectedRecipe.BrandId)}
          isOpen={detailsModel}
          onClose={() => {
            setDetailsModel(false);
            setSelectedRecipe(null);
          }}
        />
      )}
    
      {/* Add Recipe Modal */}
      {model && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Add New Recipe</h2>
              <button
                onClick={() => ToggleModel(true)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                title='Close Modal'
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Recipe Name Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recipe Name *
                </label>
                <input
                  type="text"
                  value={recipeName}
                  onChange={(e) => setRecipeName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter recipe name"
                  required
                />
              </div>

              {/* Recipe Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recipe Description *
                </label>
                <textarea
                  value={recipeDescription}
                  onChange={(e) => setRecipeDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 resize-vertical"
                  placeholder="Enter recipe description"
                  rows={4}
                  required
                />
              </div>

              {/* Brand Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brand *
                </label>
                <select
                  title='Brand'
                  value={brandId}
                  onChange={(e) => setBrandId(e.target.value as Id<"Brand">)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                >
                  <option value="">Select a brand</option>
                  {getBrand?.map((brand) => (
                    <option key={brand._id} value={brand._id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recipe Image *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:border-red-500 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                    required
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    {imagePreview ? (
                      <div className="relative w-32 h-32 mb-2">
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                    ) : (
                      <div className="w-32 h-32 bg-gray-100 rounded-md flex items-center justify-center mb-2">
                        <Upload className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <span className="text-sm text-gray-600">
                      Click to upload image
                    </span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => ToggleModel(true)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading || !recipeName.trim() || !recipeDescription.trim() || !selectedImage || !brandId}
                  className="flex-1 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Recipe
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Recipe Modal */}
      {editModel && editingRecipe && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Edit Recipe</h2>
              <button
                onClick={resetEditForm}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                title='Close Modal'
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              {/* Recipe Name Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recipe Name *
                </label>
                <input
                  type="text"
                  value={recipeName}
                  onChange={(e) => setRecipeName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter recipe name"
                  required
                />
              </div>

              {/* Recipe Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recipe Description *
                </label>
                <textarea
                  value={recipeDescription}
                  onChange={(e) => setRecipeDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 resize-vertical"
                  placeholder="Enter recipe description"
                  rows={4}
                  required
                />
              </div>

              {/* Brand Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brand *
                </label>
                <select
                  title='Brand'
                  value={brandId}
                  onChange={(e) => setBrandId(e.target.value as Id<"Brand">)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                >
                  <option value="">Select a brand</option>
                  {getBrand?.map((brand) => (
                    <option key={brand._id} value={brand._id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recipe Image {!imagePreview && '*'}
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:border-red-500 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="edit-image-upload"
                  />
                  <label
                    htmlFor="edit-image-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    {imagePreview ? (
                      <div className="relative w-32 h-32 mb-2">
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                    ) : (
                      <div className="w-32 h-32 bg-gray-100 rounded-md flex items-center justify-center mb-2">
                        <Upload className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <span className="text-sm text-gray-600">
                      {imagePreview ? 'Change image' : 'Click to upload new image'}
                    </span>
                  </label>
                </div>
                {!imagePreview && (
                  <p className="text-xs text-gray-500 mt-1">
                    Leave empty to keep current image
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetEditForm}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  disabled={uploading || deleting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteRecipe}
                  disabled={deleting || uploading}
                  className="flex-1 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </>
                  )}
                </button>
                <button
                  type="submit"
                  disabled={uploading || deleting || !recipeName.trim() || !recipeDescription.trim() || !brandId}
                  className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4 mr-2" />
                      Update Recipe
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;