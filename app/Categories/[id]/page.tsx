'use client'
import { useParams } from 'next/navigation'
import React, { useState, useMemo, useRef, useEffect } from 'react'
import { Carousel, CarouselItem, CarouselContent } from '@/components/ui/carousel'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { Search, ChevronDown, Eye, ShoppingCart, Plus, Minus } from 'lucide-react'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'

// Custom Dropdown Component
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
const CustomDropdown: React.FC<CustomDropdownProps> = ({
  value,
  onValueChange,
  placeholder,
  options,
  className = "",
  width = "w-[180px]",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

// Custom Add to Cart Modal Component
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
    await add({
      userId: GetUserByEmail!._id,
      ProductId: product._id,
      Quantity: quantity,
    });
    const maxQuantity1 = maxQuantity - quantity;
    await update({ id: product._id, quantity: maxQuantity1 });
    onClose();
    setQuantity(1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 bg-opacity-50" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-6">
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Add to Cart
          </h2>
        </div>

        <div className="space-y-4">
          {/* Product Info */}
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

          {/* Quantity Controls */}
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

          {/* Stock Status */}
          <div className="text-sm">
            {maxQuantity > 0 ? (
              <span className="text-green-600">✓ In Stock ({maxQuantity} available)</span>
            ) : (
              <span className="text-red-600">✗ Out of Stock</span>
            )}
          </div>

          {/* Action Buttons */}
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
              disabled={maxQuantity <= 0}
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

// Enhanced Product Card Component with Beautiful Design
const ProductCard: React.FC<{ product: ProductType; isAdmin: boolean }> = ({ product, isAdmin }) => {
  const ImageUrl = useQuery(api.Storage.ConvertToUrl, { 
    ImageStorageId: product.ImageUrl 
  });

  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {user}=useUser();

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
          {/* Product Name */}
          <CardTitle className="text-xl font-bold text-gray-800 line-clamp-2 leading-tight group-hover:text-red-600 transition-colors duration-300">
            {product.name}
          </CardTitle>
          
          {/* Description */}
          <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
            {product.description || 'Discover this amazing product with exceptional quality and outstanding features that will exceed your expectations.'}
          </p>
          
          {/* Features/Tags */}
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

          {/* Add to Cart Button - Only show for non-admin users */}
          {(!isAdmin &&user) && (
            <div className="pt-2">
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
      <AddToCartModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

const Page = () => {
    const { user } = useUser();
    const params = useParams();
    const id = params.id as Id<"Categories">;
    const category = useQuery(api.Categories.GetCategoriesById, { id });
    const data = useQuery(api.Product.GetProductByCategory, { id });
    const GetUserByEmail = useQuery(api.users.GetUserByEmail, user ? { email: user?.emailAddresses[0].emailAddress ?? "" } : "skip");
    
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [priceRange, setPriceRange] = useState('all');
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (!user) return;

        if (GetUserByEmail?.isAdmin == true) {
            setIsAdmin(true);
        } else {
            setIsAdmin(false);
        }
    }, [GetUserByEmail, user]);

    // Dropdown options
    const sortOptions = [
        { value: 'name', label: 'Sort by Name' },
        { value: 'price-low', label: 'Price: Low to High' },
        { value: 'price-high', label: 'Price: High to Low' }
    ]

    const priceOptions = [
        { value: 'all', label: 'All Prices' },
        { value: 'low', label: 'Under $50' },
        { value: 'medium', label: '$50 - $200' },
        { value: 'high', label: 'Over $200' }
    ]

    // Filter and sort products
    const filteredAndSortedProducts = useMemo(() => {
        if (!data) return [];
        
        let filtered = data.filter(product =>
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
                default:
                    return a.name.localeCompare(b.name);
            }
        });

        return filtered;
    }, [data, searchTerm, sortBy, priceRange]);

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="w-full h-[65vh] md:h-[55vh] lg:h-[75vh] custom-height relative overflow-hidden">
                <Carousel className="w-full h-full relative">
                    <CarouselContent className="w-full h-full ml-0 cursor-pointer hover:text-red-500">
                        <CarouselItem className="relative w-full h-[65vh] md:h-[55vh] lg:h-[75vh] custom-height pl-0">
                            <div className="h-full w-full relative z-0">
                                <Image src={'/slider.webp'} alt="Slider" fill priority className="object-cover" />
                            </div>
                            <div className="absolute inset-0 bg-black/60 z-20 w-full h-full"></div>
                            <div className="absolute inset-0 flex items-center justify-center text-center w-full h-full z-30 text-white">
                                <div className="bg-black/10 p-20 w-full h-full items-center justify-center flex flex-col">
                                    <div className="">
                                        <h1 className="text-3xl md:text-6xl lg:text-8xl font-extrabold">{category?.name}</h1>
                                        <p className="text-base pt-5 md:p-10 ">{category?.description}</p>
                                    </div>
                                </div>
                            </div>
                        </CarouselItem>
                    </CarouselContent>
                </Carousel>
            </div>

            {/* Search Bar */}
            <div className='px-4 md:px-8 lg:px-14 xl:pr-15 my-10 w-full'>
                {/* View All Products Link */}
                <div className="mb-6">
                    <Link 
                        href={'/Product'} 
                        className="inline-block text-white hover:text-red-500  bg-red-500 hover:bg-transparent px-5 py-2 rounded-md border border-red-500 transition-colors duration-300 font-medium"
                    >
                        View All Products
                    </Link>
                </div>

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
                            <ProductCard key={product._id} product={product} isAdmin={isAdmin} />
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
        </div>
    );
};

export default Page;