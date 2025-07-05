'use client';
export const dynamic = "force-dynamic";
import React, { useState, useMemo } from 'react'
import { Carousel, CarouselItem, CarouselContent } from '@/components/ui/carousel'
import Image from 'next/image'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { Trash2, Plus, Minus, ShoppingCart, Edit, X, Search, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';

interface CartItemType {
  _id: Id<"Cart">
  userId: Id<"users">
  ProductId: Id<"Product">
  Quantity: number
  _creationTime: number
}

interface ProductType {
  _id: Id<"Product">
  name: string
  ImageUrl: Id<"_storage">
  description: string
  Quantity: number
  CategoryId: Id<"Categories">
  price: number
  BrandId?: Id<"Brand">
  _creationTime: number
}

type CartWithProduct = {
  cartItem: CartItemType;
  product: ProductType;
};

// Custom Card Component for Order Summary
const CustomCard: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md border border-gray-200 ${className}`}>
      {children}
    </div>
  );
};

const CustomCardHeader: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div className={`p-6 pb-4 ${className}`}>
      {children}
    </div>
  );
};

const CustomCardTitle: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <h3 className={`text-2xl font-bold text-gray-900 ${className}`}>
      {children}
    </h3>
  );
};

const CustomCardContent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div className={`p-6 pt-0 ${className}`}>
      {children}
    </div>
  );
};

// Custom Dropdown Component
const CustomDropdown: React.FC<{
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  options: { value: string; label: string }[];
  width?: string;
}> = ({ value, onValueChange, placeholder, options, width = "w-[180px]" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
        className={`${width} min-h-12 px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-red-500 hover:text-white hover:border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none transition-colors duration-300 cursor-pointer flex items-center justify-between`}
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

// Edit Cart Modal Component
const EditCartModal: React.FC<{
  cartItem: CartItemType;
  product: ProductType | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (cartId: Id<"Cart">, newQuantity: number) => Promise<void>;
  onDelete: (cartId: Id<"Cart">) => Promise<void>;
}> = ({ cartItem, product, isOpen, onClose, onUpdate, onDelete }) => {
  const [quantity, setQuantity] = useState(cartItem.Quantity);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const url = useQuery(api.Storage.ConvertToUrl, 
    product ? { ImageStorageId: product.ImageUrl } : "skip"
  );

  // Get the maximum available quantity (original product quantity)
  const maxQuantity = product?.Quantity || 0;

  const handleQuantityChange = (value: number) => {
    if (value >= 1 && value <= maxQuantity) {
      setQuantity(value);
    }
  };

  const handleUpdate = async () => {
    if (quantity > maxQuantity) {
      toast(`Cannot exceed available quantity (${maxQuantity})`);
      return;
    }

    setIsUpdating(true);
    try {
      await onUpdate(cartItem._id, quantity);
      onClose();
      toast("Cart item updated successfully!");
    } catch (error) {
      console.error("Error updating cart item:", error);
      toast("Error updating cart item. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(cartItem._id);
      onClose();
      toast("Cart item deleted successfully!");
    } catch (error) {
      console.error("Error deleting cart item:", error);
      toast("Error deleting cart item. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Edit Cart Item</h2>
          <button
            title='Close'
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={url || '/placeholder.png'}
                alt={product?.name || 'Product'}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{product?.name || 'Unknown Product'}</h3>
              <p className="text-red-600 font-bold">${product?.price || 0}</p>
              <p className="text-sm text-gray-500">Available: {maxQuantity}</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Quantity (Max: {maxQuantity})
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
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 1;
                  if (value > maxQuantity) {
                    toast(`Cannot exceed available quantity (${maxQuantity})`);
                    return;
                  }
                  handleQuantityChange(value);
                }}
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
            {quantity >= maxQuantity && (
              <p className="text-sm text-amber-600">
                Maximum available quantity reached
              </p>
            )}
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isDeleting ? (
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
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={isUpdating || quantity > maxQuantity}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Cart Item Card Component
const CartItemCard: React.FC<{
  cartItem: CartItemType;
  product: ProductType | null;
  onEdit: (cartItem: CartItemType) => void;
  onQuickUpdate: (cartId: Id<"Cart">, newQuantity: number) => Promise<void>;
  onQuickDelete: (cartId: Id<"Cart">) => Promise<void>;
  isUpdating: boolean;
}> = ({ cartItem, product, onEdit }) => {
  const url = useQuery(api.Storage.ConvertToUrl, 
    product ? { ImageStorageId: product.ImageUrl } : "skip"
  );

  const [isHovered, setIsHovered] = useState(false);

  const itemTotal = (product?.price || 0) * cartItem.Quantity;

  return (
    <Card 
      className="group relative overflow-hidden bg-white border-0 shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 rounded-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Container */}
      <div className="relative h-48 w-full overflow-hidden rounded-t-2xl bg-gradient-to-br from-gray-100 to-gray-200">
        {url ? (
          <Image
            src={url}
            alt={product?.name || 'Product'}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <div className="animate-pulse">
              <ShoppingCart className="w-16 h-16 text-gray-400" />
            </div>
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      {/* Product Info */}
      <CardContent className="p-6 space-y-4">
        <CardTitle className="text-2xl font-bold text-gray-800 line-clamp-2 leading-tight group-hover:text-red-600 transition-colors duration-300">
          {product?.name || 'Unknown Product'}
        </CardTitle>
        
        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
          {product?.description || 'Product description not available'}
        </p>
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            <p>Unit Price: <span className="font-semibold text-gray-700">${product?.price || 0}</span></p>
            <p>Quantity: <span className="font-semibold text-gray-700">{cartItem.Quantity}</span></p>
            <p>Available: <span className="font-semibold text-gray-700">{product?.Quantity || 0}</span></p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-xl font-bold text-green-600">${itemTotal.toFixed(2)}</p>
          </div>
        </div>

        
        <div className="flex gap-2 pt-2 absolute bottom-4 ">
          <Button
            onClick={() => onEdit(cartItem)}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit
          </Button>
        </div>
      </CardContent>

      {/* Hover Effect Border */}
      <div className={`absolute inset-0 rounded-2xl transition-all duration-300 pointer-events-none ${
        isHovered ? 'ring-2 ring-red-500 ring-offset-2' : ''
      }`} />
    </Card>
  );
};

const CartPage = () => {
  const [isUpdating, setIsUpdating] = useState<string | null>(null)
  const [editingCartItem, setEditingCartItem] = useState<CartItemType | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const {user}=useUser();
  const GetUserByEmail = useQuery(api.users.GetUserByEmail, user ? { email: user?.emailAddresses[0].emailAddress ?? "" } : "skip");
  const id=GetUserByEmail!._id;
  // Fetch cart items for the user - Fixed query call
  const cartItems = useQuery(api.Cart.GetCartByUser, { userId:id });
  
  // Fetch all products to get product details - Fixed query call
  const allProducts = useQuery(api.Product.GetProduct)
  
  // Mutations - Fixed mutation calls
  const deleteCart = useMutation(api.Cart.DeleteCart)
  const updateCart = useMutation(api.Cart.UpdateCart)
  
  // Handle quantity update
  const handleQuantityUpdate = async (cartId: Id<"Cart">, newQuantity: number) => {
    if (newQuantity < 1) return
    
    // Find the product to check quantity limits
    const cartItem = cartItems?.find(item => item._id === cartId);
    const product = allProducts?.find(p => p._id === cartItem?.ProductId);
    
    if (product && newQuantity > product.Quantity) {
      toast(`Cannot exceed available quantity (${product.Quantity})`);
      return;
    }
    
    setIsUpdating(cartId)
    try {
      await updateCart({ id: cartId, Quantity: newQuantity })
      toast("Cart updated successfully!")
    } catch (error) {
      console.error('Error updating cart:', error)
      toast("Error updating cart item. Please try again.")
    } finally {
      setIsUpdating(null)
    }
  }
  
  // Handle item deletion
  const handleDeleteItem = async (cartId: Id<"Cart">) => {
    try {
      await deleteCart({ id: cartId })
      toast("Item removed from cart!")
    } catch (error) {
      console.error('Error deleting cart item:', error)
      toast("Error deleting cart item. Please try again.")
    }
  }

  // Get product details for cart items
  const cartItemsWithProducts = useMemo(() => {
    if (!cartItems || !allProducts) return []
    
    return cartItems.map(cartItem => {
      const product = allProducts.find(p => p._id === cartItem.ProductId)
      return { cartItem, product }
    })
  }, [cartItems, allProducts])

  // Filter and sort cart items
  const filteredAndSortedCartItems:CartWithProduct[] = useMemo(() => {
    const filtered = cartItemsWithProducts
    .filter((item): item is CartWithProduct => !!item.product && (
      item.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.product.description?.toLowerCase().includes(searchTerm.toLowerCase())
   ));

    // Sort cart items
    filtered.sort(({ product: a, cartItem: cartA }, { product: b, cartItem: cartB }) => {
      switch (sortBy) {
        case 'price-low':
          return (a?.price || 0) - (b?.price || 0)
        case 'price-high':
          return (b?.price || 0) - (a?.price || 0)
        case 'quantity-low':
          return cartA.Quantity - cartB.Quantity
        case 'quantity-high':
          return cartB.Quantity - cartA.Quantity
        default:
          return (a?.name || '').localeCompare(b?.name || '')
      }
    })

    return filtered
  }, [cartItemsWithProducts, searchTerm, sortBy])
  
  // Calculate totals
  const totalItems = cartItems?.reduce((sum, item) => sum + item.Quantity, 0) || 0
  const totalPrice = cartItemsWithProducts.reduce((sum, { cartItem, product }) => {
    return sum + (cartItem.Quantity * (product?.price || 0))
  }, 0)

  // Sort options
  const sortOptions = [
    { value: 'name', label: 'Sort by Name' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'quantity-low', label: 'Quantity: Low to High' },
    { value: 'quantity-high', label: 'Quantity: High to Low' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
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
                    <h1 className="text-3xl md:text-6xl lg:text-8xl font-extrabold">Your Cart</h1>
                    <p className="text-base pt-5 md:p-10">
                      Review your selected items and proceed to checkout when you&apos;re ready.
                    </p>
                  </div>
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </div>

      {/* Cart Content */}
      <div className='px-4 md:px-8 lg:px-14 xl:pr-15 my-10 w-full'>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-gray-700" />
            <h2 className="text-2xl font-bold text-gray-900">
              Your Cart ({totalItems} items)
            </h2>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total Amount</p>
            <p className="text-2xl font-bold text-gray-900">${totalPrice.toFixed(2)}</p>
          </div>
        </div>

        {cartItems === undefined ? (
          // Loading state
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : cartItems.length === 0 ? (
          // Empty cart
          <Card className="text-center py-16">
            <CardContent>
              <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-600 mb-6">Start shopping to add items to your cart</p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Continue Shopping
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Search and Filter Section */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search cart items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 border-gray-300 focus:border-red-500 focus:ring-red-500 bg-white"
                />
              </div>
              {/* Sort Dropdown */}
              <div className="flex gap-2">
                <CustomDropdown
                  value={sortBy}
                  onValueChange={setSortBy}
                  placeholder="Sort by"
                  options={sortOptions}
                  width="w-[200px]"
                />
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-4">
              {/* Cart Items Grid */}
              <div className="lg:col-span-3">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredAndSortedCartItems.map(({ cartItem, product }) => (
                    <CartItemCard
                      key={cartItem._id}
                      cartItem={cartItem}
                      product={product}
                      onEdit={setEditingCartItem}
                      onQuickUpdate={handleQuantityUpdate}
                      onQuickDelete={handleDeleteItem}
                      isUpdating={isUpdating === cartItem._id}
                    />
                  ))}
                </div>
              </div>

              {/* Order Summary with Custom Card */}
              <div className="lg:col-span-1">
                <CustomCard className="sticky top-6">
                  <CustomCardHeader>
                    <CustomCardTitle className='text-2xl'>Order Summary</CustomCardTitle>
                  </CustomCardHeader>
                  <CustomCardContent className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                      <span className="font-medium">${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">Free</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium">${(totalPrice * 0.08).toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>${(totalPrice * 1.08).toFixed(2)}</span>
                      </div>
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer transition-colors duration-300">
                      Proceed to Checkout
                    </Button>
                       <Link href={'/Product'}>
                      <Button variant="outline" className="w-full cursor-pointer bg-red-500 text-white transition-colors duration-300 hover:bg-red-600">
                       Continue Shopping
                      </Button>
                    </Link>
                  </CustomCardContent>
                </CustomCard>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Edit Cart Modal */}
      {editingCartItem && (
        <EditCartModal
          cartItem={editingCartItem}
          product={allProducts?.find(p => p._id === editingCartItem.ProductId) || null}
          isOpen={!!editingCartItem}
          onClose={() => setEditingCartItem(null)}
          onUpdate={handleQuantityUpdate}
          onDelete={handleDeleteItem}
        />
      )}
    </div>
  )
}

export default CartPage