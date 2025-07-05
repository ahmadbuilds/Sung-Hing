'use client'
import React from 'react'
import { Carousel,CarouselItem,CarouselContent } from '@/components/ui/carousel'
import { useState,useEffect,FormEvent, useMemo } from 'react'
import {useUser } from '@clerk/nextjs'
import Image from 'next/image'
import {useQuery,useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import {X, Upload, Eye, Search, ChevronDown, Edit, Trash2, ShoppingCart, Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Id } from '@/convex/_generated/dataModel';
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// Types
interface ProductType{
    _id:Id<"Product">,
    name:string,
    ImageUrl:Id<"_storage">,
    description:string,
    Quantity:number,
    CategoryId:Id<"Categories">,
    price:number,
    BrandId?:Id<"Brand">,
    _creationTime:number
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

// Add to Cart Modal Component
const AddToCartModal: React.FC<{
  product: ProductType;
  isOpen: boolean;
  onClose: () => void;
}> = ({ product, isOpen, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const maxQuantity = product.Quantity || 0;
  const add = useMutation(api.Cart.AddToCart);
  const update = useMutation(api.Product.UpdateQuantity);
  const { user } = useUser();
  const GetUserByEmail = useQuery(api.users.GetUserByEmail, user ? { email: user?.emailAddresses[0].emailAddress ?? "" } : "skip");
  const url = useQuery(api.Storage.ConvertToUrl, { ImageStorageId: product.ImageUrl });

  const handleQuantityChange = (value: number) => {
    if (value >= 1 && value <= maxQuantity) {
      setQuantity(value);
    }
  };

  const handleAddToCart = async () => {
    if (!GetUserByEmail) return;
    
    await add({
      userId: GetUserByEmail._id,
      ProductId: product._id,
      Quantity: quantity,
    });
    const maxQuantity1 = maxQuantity - quantity;
    await update({ id: product._id, quantity: maxQuantity1 });
    onClose();
    setQuantity(1);
    toast("Product added to cart!");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-6">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-800">Add to Cart</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={url || '/placeholder.png'}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{product.name}</h3>
              <p className="text-red-600 font-bold">${product.price || 0}</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Quantity (Available: {maxQuantity})
            </label>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                className="w-8 h-8 p-0"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                min={1}
                max={maxQuantity}
                className="w-20 text-center"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= maxQuantity}
                className="w-8 h-8 p-0"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="text-sm">
            {maxQuantity > 0 ? (
              <span className="text-green-600">✓ In Stock ({maxQuantity} available)</span>
            ) : (
              <span className="text-red-600">✗ Out of Stock</span>
            )}
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddToCart}
              disabled={maxQuantity <= 0 || !GetUserByEmail}
              className="flex-1 bg-red-500 cursor-pointer hover:border hover:border-red-500 hover:text-red-500 text-white hover:bg-transparent"
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductCard: React.FC<{ product: ProductType; isAdmin: boolean; onEdit: (product: ProductType) => void }> = ({ product, isAdmin, onEdit }) => {
  const ImageUrl = useQuery(api.Storage.ConvertToUrl, { 
    ImageStorageId: product.ImageUrl 
  });

  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useUser();

  return (
    <>
      <Card 
        className="group relative overflow-hidden bg-white border-0 shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 rounded-2xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Product Image Container */}
        <div className="relative h-64 w-full overflow-hidden rounded-t-2xl bg-gradient-to-br from-gray-100 to-gray-200">
          {ImageUrl ? (
            <Image
              src={ImageUrl}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <div className="animate-pulse">
                <div className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center">
                  <Eye className="w-8 h-8 text-gray-600" />
                </div>
              </div>
            </div>
          )}
          
          {/* Price Badge */}
          <div className="absolute top-4 left-4">
            <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
              ${product.price || 0}
            </div>
          </div>

          {/* Stock Badge */}
          <div className="absolute top-4 right-4">
            <div className={`px-2 py-1 rounded-full text-xs font-bold shadow-lg ${
              product.Quantity > 0 
                ? 'bg-green-500 text-white' 
                : 'bg-red-500 text-white'
            }`}>
              {product.Quantity > 0 ? `${product.Quantity} left` : 'Out of Stock'}
            </div>
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        {/* Product Info */}
        <CardContent className="p-6 space-y-4">
          <CardTitle className="text-xl font-bold text-gray-800 line-clamp-2 leading-tight group-hover:text-red-600 transition-colors duration-300">
            {product.name}
          </CardTitle>
          
          <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
            {product.description || 'Discover this amazing product with exceptional quality and outstanding features that will exceed your expectations.'}
          </p>
          
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              Premium
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              product.Quantity > 0 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {product.Quantity > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          {isAdmin && (
            <div className="pt-2 absolute bottom-4 inline-block">
              <Button
                onClick={() => {
                  console.log('Edit button clicked!', product.name);
                  onEdit(product);
                }}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Product
              </Button>
            </div>
          )}

          {/* Add to Cart Button - Only show for non-admin users */}
          {(!isAdmin && user) && (
            <div className="pt-2 absolute inline-block bottom-4">
              <Button
                onClick={() => setIsModalOpen(true)}
                disabled={product.Quantity <= 0}
                className="cursor-pointer w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-4 h-4" />
                {product.Quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
              </Button>
            </div>
          )}
        </CardContent>

        {/* Hover Effect Border */}
        <div className={`absolute inset-0 rounded-2xl transition-all duration-300 pointer-events-none ${
          isHovered ? 'ring-2 ring-red-500 ring-offset-2' : ''
        }`} />
      </Card>

      {/* Add to Cart Modal */}
      {!isAdmin && (
        <AddToCartModal
          product={product}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

const Page = () => {
    const [Admin,SetAdmin]=useState(false);
    const [model,showModel]=useState(false);
    const [editModel, setEditModel] = useState(false);
    const [editingProduct, setEditingProduct] = useState<ProductType | null>(null);
    const [uploading,setUploading]=useState(false);
    const [ProductName,setProductName]=useState("");
    const [ProductDescription,setProductDescription]=useState("");
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState('');
    const [quantity,setQuantity]=useState("");
    const [categoryId,setCategoryId]=useState<Id<"Categories"> | "">("");
    const [Price,setPrice]=useState("");
    const [brandId,setBrandId]=useState<Id<"Brand"> | "">("");
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [priceRange, setPriceRange] = useState('all');
    const [deleting, setDeleting] = useState(false);
    
    const {user}=useUser();
    const getBrand=useQuery(api.Brand.GetBrand);
    const getCategory=useQuery(api.Categories.GetCategories);
    const getAllProducts = useQuery(api.Product.GetProduct);
    const url=useMutation(api.Storage.GenerateUploadUrl);
    const add=useMutation(api.Product.AddProduct);
    const updateProduct = useMutation(api.Product.UpdateProduct);
    const deleteProduct = useMutation(api.Product.DeleteProduct);
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

    // Dropdown options
    const sortOptions = [
        { value: 'name', label: 'Sort by Name' },
        { value: 'price-low', label: 'Price: Low to High' },
        { value: 'price-high', label: 'Price: High to Low' },
        { value: 'newest', label: 'Newest First' }
    ]

    const priceOptions = [
        { value: 'all', label: 'All Prices' },
        { value: 'low', label: 'Under $50' },
        { value: 'medium', label: '$50 - $200' },
        { value: 'high', label: 'Over $200' }
    ]

    // Filter and sort products
    const filteredAndSortedProducts = useMemo(() => {
        if (!getAllProducts) return [];
        
        let filtered = getAllProducts.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Price filter
        if (priceRange !== 'all') {
            filtered = filtered.filter(product => {
                const price = product.price || 0;
                switch (priceRange) {
                    case 'low': return price < 50;
                    case 'medium': return price >= 50 && price < 200;
                    case 'high': return price >= 200;
                    default: return true;
                }
            });
        }

        // Sort products
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'price-low':
                    return (a.price || 0) - (b.price || 0);
                case 'price-high':
                    return (b.price || 0) - (a.price || 0);
                case 'newest':
                    return b._creationTime - a._creationTime;
                default:
                    return a.name.localeCompare(b.name);
            }
        });

        return filtered;
    }, [getAllProducts, searchTerm, sortBy, priceRange]);
    
    //ToggleModel Function
  function ToggleModel(args:boolean){
    if(args){
      showModel(false);
    }else{
      showModel(true);
    }
  }

  // Edit Product Function
  const handleEditProduct = (product: ProductType) => {
    setEditingProduct(product);
    setProductName(product.name);
    setProductDescription(product.description);
    setQuantity(product.Quantity.toString());
    setPrice(product.price.toString());
    setCategoryId(product.CategoryId);
    setBrandId(product.BrandId || "");
    setEditModel(true);
  };

  // Reset Edit Form
  const resetEditForm = () => {
    setEditingProduct(null);
    setProductName("");
    setProductDescription("");
    setImagePreview("");
    setSelectedImage(null);
    setQuantity("");
    setCategoryId("");
    setPrice("");
    setBrandId("");
    setEditModel(false);
  };

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
    
    if(ProductName.trim() && ProductDescription.trim() && selectedImage && categoryId && brandId){
        try {
            const postUrl=await url();
            const result = await fetch(postUrl, {
            method: "POST",
            headers: { "Content-Type": selectedImage!.type },
            body: selectedImage,
          });
          const { storageId } = await result.json();
          await add({
            name:ProductName,
            ImageUrl:storageId,
            description:ProductDescription,
            Quantity:Number(quantity,)||0,
            CategoryId:categoryId as Id<"Categories">,
            price:Number(Price) || 0,
            brandId:brandId as Id<"Brand">
          });
          
          // Reset form
          showModel(false);
          setProductName("");
          setProductDescription("");
          setImagePreview("");
          setSelectedImage(null);
          setQuantity("");
          setCategoryId("");
          setPrice("");
          setBrandId("");
          
          toast("Product Successfully Added!");
        } catch (error) {
            console.error("Error adding product:", error);
            toast("Error adding product. Please try again.");
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
    if (!editingProduct) return;
    
    setUploading(true);
    
    if (ProductName.trim() && ProductDescription.trim() && categoryId && brandId) {
        try {
            let imageStorageId = editingProduct.ImageUrl;
            
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
            
            await updateProduct({
                id: editingProduct._id,
                name: ProductName,
                ImageUrl: imageStorageId,
                description: ProductDescription,
                Quantity: Number(quantity) || 0,
                CategoryId: categoryId as Id<"Categories">,
                price: Number(Price) || 0,
                BrandId: brandId as Id<"Brand">
            });
            
            resetEditForm();
            toast("Product Successfully Updated!");
        } catch (error) {
            console.error("Error updating product:", error);
            toast("Error updating product. Please try again.");
        } finally {
            setUploading(false);
        }
    } else {
        toast("Please fill in all required fields.");
        setUploading(false);
    }
  }

  // Handle Delete Product
  async function handleDeleteProduct() {
    if (!editingProduct) return;
    
    setDeleting(true);
    try {
        await deleteProduct({ id: editingProduct._id });
        resetEditForm();
        toast("Product Successfully Deleted!");
    } catch (error) {
        console.error("Error deleting product:", error);
        toast("Error deleting product. Please try again.");
    } finally {
        setDeleting(false);
    }
  }
  
  return (
    <div className="bg-gray-50 min-h-screen">
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
                    <h1 className="text-3xl md:text-6xl lg:text-8xl font-extrabold">Products</h1>
                    <p className="text-base pt-5 md:p-10 ">Discover our amazing collection of premium products with exceptional quality and outstanding features.</p>
                    {
                    Admin?(    
                      <button onClick={()=>ToggleModel(false)} className="bg-red-500 px-4 py-3 cursor-pointer rounded-md text-white text-center border border-red-500 hover:text-red-500 hover:bg-transparent transition-colors duration-300 mb-3">
                        Add Products
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

    {/* Search and Filter Section */}
    <div className='px-4 md:px-8 lg:px-14 xl:pr-15 my-10 w-full'>
        <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Search Bar */}
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                    type="text"
                    placeholder="Search products..."
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
                    width="w-[180px]"
                />

                <CustomDropdown
                    value={priceRange}
                    onValueChange={setPriceRange}
                    placeholder="Price range"
                    options={priceOptions}
                    width="w-[150px]"
                />
            </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredAndSortedProducts.length > 0 ? (
                filteredAndSortedProducts.map((product) => (
                    <ProductCard 
                        key={product._id} 
                        product={product} 
                        isAdmin={Admin}
                        onEdit={handleEditProduct}
                    />
                ))
            ) : (
                <div className="col-span-full text-center py-12">
                    <div className="text-gray-500">
                        <h3 className="text-xl font-medium mb-2">No products found</h3>
                        <p className="mb-4">Try adjusting your search terms or filters.</p>
                    </div>
                </div>
            )}
        </div>
    </div>
    
    {/* Add Products Model */}
      {model && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Add New Product</h2>
              <button
                onClick={()=>ToggleModel(true)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                title='Close Model'
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Product Name Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={ProductName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter product name"
                  required
                />
              </div>

              {/* Product Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Description *
                </label>
                <textarea
                  value={ProductDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 resize-vertical"
                  placeholder="Enter product description"
                  rows={3}
                  required
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price *
                </label>
                <input
                  type="number"
                  value={Price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter price"
                  min="1"
                  step="0.01"
                  required
                />
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity *
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter quantity"
                  min="1"
                  required
                />
              </div>

              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  title='Category'
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value as Id<"Categories">)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                >
                  <option value="">Select a category</option>
                  {getCategory?.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
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
                  Product Image *
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
                  onClick={()=>ToggleModel(true)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    'Add Product'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editModel && editingProduct && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Edit Product</h2>
              <button
                onClick={resetEditForm}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                title='Close Model'
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              {/* Product Name Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={ProductName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter product name"
                  required
                />
              </div>

              {/* Product Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Description *
                </label>
                <textarea
                  value={ProductDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 resize-vertical"
                  placeholder="Enter product description"
                  rows={3}
                  required
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price *
                </label>
                <input
                  type="number"
                  value={Price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter price"
                  min="1"
                  step="0.01"
                  required
                />
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity *
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter quantity"
                  min="1"
                  required
                />
              </div>

              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  title='Category'
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value as Id<"Categories">)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                >
                  <option value="">Select a category</option>
                  {getCategory?.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
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
                  Product Image (optional - leave blank to keep current)
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
                      Click to upload new image
                    </span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetEditForm}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteProduct}
                  disabled={deleting}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
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
                  disabled={uploading}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Product'
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