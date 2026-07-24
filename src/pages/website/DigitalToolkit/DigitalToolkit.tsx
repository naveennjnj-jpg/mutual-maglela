// DigitalToolkit.tsx - Updated with payment processing
import React, { useState, useEffect } from 'react';
import {
    Download, Zap, CheckCircle, ShoppingCart, Star,
    ArrowLeft, Minus, Plus, Trash2, ArrowRight, Lock,
    Loader2
} from 'lucide-react';

// Types
interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    rating: number;
    reviews: number;
    image: string;
    category: string;
}

interface CartItem {
    product: Product;
    quantity: number;
}

interface BillingInfo {
    firstName: string;
    lastName: string;
    email: string;
    organisation: string;
    streetAddress: string;
    city: string;
    postalCode: string;
    country: string;
}

// API Base URL

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Main Digital Toolkit Component
const DigitalToolkit: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState<string>('All');
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [showCart, setShowCart] = useState<boolean>(false);
    const [showCheckout, setShowCheckout] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const categories = ['All', 'Strategy', 'Templates', 'Branding', 'Content'];

    const products: Product[] = [
        {
            id: 1,
            title: 'Media Strategy Playbook',
            description: 'A step-by-step framework for building institutional media strategies that drive coverage.',
            price: 29,
            rating: 5,
            reviews: 42,
            image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80',
            category: 'Strategy'
        },
        {
            id: 2,
            title: 'Crisis Communication Pack',
            description: 'Ready-to-use templates and protocols for managing communications during institutional crises.',
            price: 49,
            rating: 5,
            reviews: 38,
            image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80',
            category: 'Strategy'
        },
        {
            id: 3,
            title: 'Brand Voice Guide Template',
            description: "Define your institution's tone, language, and messaging principles with this editable guide.",
            price: 35,
            rating: 4,
            reviews: 29,
            image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80',
            category: 'Branding'
        },
        {
            id: 4,
            title: 'PR Pitch Deck Template',
            description: 'A professional pitch deck framework for presenting your research or institution to media.',
            price: 45,
            rating: 5,
            reviews: 31,
            image: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80',
            category: 'Templates'
        },
        {
            id: 5,
            title: 'Institutional Content Calendar',
            description: 'Plan 12 months of strategic communications content across all your institutional channels.',
            price: 25,
            rating: 4,
            reviews: 55,
            image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80',
            category: 'Content'
        },
        {
            id: 6,
            title: 'Stakeholder Mapping Toolkit',
            description: 'Identify, prioritise, and develop messaging for every key stakeholder group.',
            price: 55,
            rating: 5,
            reviews: 22,
            image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80',
            category: 'Strategy'
        },
        {
            id: 7,
            title: 'Executive Messaging Framework',
            description: 'Craft consistent, authoritative messaging for C-suite and executive communications.',
            price: 65,
            rating: 5,
            reviews: 19,
            image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80',
            category: 'Branding'
        },
        {
            id: 8,
            title: 'Digital PR Starter Kit',
            description: 'Everything you need to launch a digital PR campaign from press release to social strategy.',
            price: 39,
            rating: 4,
            reviews: 47,
            image: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80',
            category: 'Content'
        }
    ];

    const addToCart = (product: Product) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.product.id === product.id);
            if (existingItem) {
                return prevItems.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prevItems, { product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId: number) => {
        setCartItems(prevItems => prevItems.filter(item => item.product.id !== productId));
    };

    const updateQuantity = (productId: number, newQuantity: number) => {
        if (newQuantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.product.id === productId
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    };

    const getTotalItems = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    };

    const filteredProducts = activeCategory === 'All'
        ? products
        : products.filter(product => product.category === activeCategory);

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, index) => (
            <Star
                key={index}
                className={`w-3 h-3 ${index < rating
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-gray-300'
                    }`}
            />
        ));
    };

    // Show Cart View
    if (showCart) {
        return (
            <CartView
                cartItems={cartItems}
                updateQuantity={updateQuantity}
                removeFromCart={removeFromCart}
                getTotalPrice={getTotalPrice}
                onBack={() => setShowCart(false)}
                onCheckout={() => {
                    setShowCart(false);
                    setShowCheckout(true);
                }}
            />
        );
    }

    // Show Checkout View
    if (showCheckout) {
        return (
            <CheckoutView
                cartItems={cartItems}
                getTotalPrice={getTotalPrice}
                onBack={() => setShowCheckout(false)}
                loading={loading}
                error={error}
            />
        );
    }

    // Main Product Grid View
    return (
        <main className="flex-1 pt-0">
            <div className="bg-white">
                {/* Hero Section */}
                <section className="relative h-[500px] overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1400&q=80"
                        alt="Digital Toolkit"
                        className="absolute inset-0 w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#1C1C1C]/92 via-[#1C1C1C]/75 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1C]/50 via-transparent to-transparent"></div>
                    <div
                        className="absolute inset-0 opacity-20"
                        style={{ backgroundImage: 'radial-gradient(at 20% 65%, rgb(200, 90, 50) 0%, transparent 55%)' }}
                    ></div>

                    <div className="relative h-full max-w-[1200px] mx-auto px-6 lg:px-8 flex flex-col justify-end pb-14 pt-20">
                        <div className="max-w-2xl">
                            <h1 className="text-3xl md:text-[44px] font-['Roboto'] text-white mb-4 leading-[1.15]">
                                Digital Toolkit
                            </h1>
                            <p className="text-white/70 text-sm md:text-base leading-relaxed mb-7 max-w-xl">
                                Professional communication frameworks, templates, and playbooks built by the Magalela Media team — download instantly and start today.
                            </p>

                            <div className="flex flex-wrap gap-3">
                                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-xs px-4 py-2 rounded-full font-medium">
                                    <Download className="w-3.5 h-3.5" />
                                    Instant Download
                                </div>
                                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-xs px-4 py-2 rounded-full font-medium">
                                    <Zap className="w-3.5 h-3.5" />
                                    Expert Crafted
                                </div>
                                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-xs px-4 py-2 rounded-full font-medium">
                                    <CheckCircle className="w-3.5 h-3.5" />
                                    Ready to Use
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Products Section */}
                <section className="py-14 bg-[#F5F0EA]">
                    <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
                        <div className="flex items-center justify-between flex-wrap gap-4 mb-10">
                            <div className="flex gap-2 flex-wrap">
                                {categories.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => setActiveCategory(category)}
                                        className={`px-4 py-2 rounded-full text-xs font-semibold transition-all border ${activeCategory === category
                                                ? 'bg-[#C85A32] border-[#C85A32] text-white'
                                                : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                                            }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => setShowCart(true)}
                                className="flex items-center gap-2 bg-[#0F2D63] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#0a1f47] transition-colors"
                            >
                                <ShoppingCart className="w-4 h-4" />
                                View Cart ({getTotalItems()})
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {filteredProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
                                >
                                    <div className="aspect-[4/3] overflow-hidden">
                                        <img
                                            src={product.image}
                                            alt={product.title}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>

                                    <div className="p-4 flex flex-col flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="flex gap-0.5">
                                                {renderStars(product.rating)}
                                            </div>
                                            <span className="text-gray-400 text-xs">({product.reviews})</span>
                                        </div>

                                        <h3 className="font-['Roboto'] font-bold text-[#1C1C1C] text-sm mb-1 leading-snug">
                                            {product.title}
                                        </h3>

                                        <p className="text-gray-400 text-xs leading-relaxed flex-1 mb-3">
                                            {product.description}
                                        </p>

                                        <div className="flex items-center justify-between mt-auto">
                                            <span className="text-[#0F2D63] font-bold text-lg">
                                                R{product.price}
                                            </span>
                                            <button
                                                onClick={() => addToCart(product)}
                                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all bg-[#C85A32] hover:bg-[#a8472a] text-white"
                                            >
                                                <ShoppingCart className="w-3.5 h-3.5" />
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
};

// Checkout View Component with Payment Processing
interface CheckoutViewProps {
    cartItems: CartItem[];
    getTotalPrice: () => number;
    onBack: () => void;
    loading?: boolean;
    error?: string | null;
}

const CheckoutView: React.FC<CheckoutViewProps> = ({
    cartItems,
    getTotalPrice,
    onBack,
    loading = false,
    error = null
}) => {
    const [step, setStep] = useState<number>(1);
    const [formData, setFormData] = useState<BillingInfo>({
        firstName: '',
        lastName: '',
        email: '',
        organisation: '',
        streetAddress: '',
        city: '',
        postalCode: '',
        country: 'South Africa'
    });
    const [paymentProcessing, setPaymentProcessing] = useState<boolean>(false);
    const [paymentError, setPaymentError] = useState<string | null>(null);
    const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
    const [orderId, setOrderId] = useState<string | null>(null);

    // Constants
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Process payment and create order
    const processPaymentAndSave = async () => {
        setPaymentProcessing(true);
        setPaymentError(null);

        try {
            // Prepare order data
            const orderData = {
                userEmail: formData.email,
                billingInfo: formData,
                items: cartItems.map(item => ({
                    productId: item.product.id.toString(),
                    title: item.product.title,
                    price: item.product.price,
                    quantity: item.quantity,
                    subtotal: item.product.price * item.quantity
                }))
            };

            // Create order and initiate PayFast payment
            const response = await fetch(`${API_BASE_URL}/api/toolkit/create-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Order creation failed');
            }

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error || 'Payment initiation failed');
            }


            // ✅ Store orderId in localStorage BEFORE redirect (like your example)
            if (result.success && result.orderId) {
                localStorage.setItem('pendingOrderId', result.orderId);
                localStorage.setItem('pendingPayment', 'true');
                console.log('✅ Order ID stored in localStorage:', result.orderId);
            }


            // Save order ID for reference
            setOrderId(result.orderId || result.order?.id);

            // ✅ Fix: Use paymentUrl (not payfastUrl)
            if (result.paymentUrl && result.paymentData) {
                const form = document.createElement('form');
                form.method = 'POST';
                form.action = result.paymentUrl; // ✅ Changed from result.payfastUrl

                Object.keys(result.paymentData).forEach(key => {
                    const input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = key;
                    input.value = result.paymentData[key];
                    form.appendChild(input);
                });

                document.body.appendChild(form);
                form.submit();
                return;
            }

            throw new Error('Payment initiation did not return a redirect URL');

        } catch (err) {
            console.error('❌ Payment error:', err);
            setPaymentError(err instanceof Error ? err.message : 'Payment processing failed');
            setStep(1); // Go back to form if error
        } finally {
            setPaymentProcessing(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Validate form
        if (!formData.firstName || !formData.lastName || !formData.email ||
            !formData.streetAddress || !formData.city || !formData.postalCode) {
            setPaymentError('Please fill in all required fields');
            return;
        }
        // Process payment
        processPaymentAndSave();
    };

    // Check order status on mount (if returning from PayFast)
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const orderIdParam = urlParams.get('orderId');
        const status = urlParams.get('status');

        if (orderIdParam && status === 'paid') {
            setOrderId(orderIdParam);
            setPaymentSuccess(true);
            setStep(2);
        }
    }, []);

    return (
        <main className="flex-1 pt-0">
            <div className="bg-[#F5F0EA] min-h-screen pt-28 pb-14">
                <div className="max-w-[1000px] mx-auto px-6 lg:px-8">
                    <div className="flex items-center gap-3 mb-8">
                        <button
                            onClick={onBack}
                            className="text-gray-400 hover:text-[#C85A32] transition-colors"
                            disabled={paymentProcessing}
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h1 className="text-2xl font-['Roboto'] font-bold text-[#1C1C1C]">Checkout</h1>
                    </div>

                    {/* Progress Steps */}
                    <div className="flex items-center gap-0 mb-10">
                        <div className="flex items-center flex-1">
                            <div className="flex items-center gap-2 shrink-0">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= 1 ? 'bg-[#0F2D63] text-white' : 'bg-gray-200 text-gray-400'}`}>
                                    1
                                </div>
                                <span className={`text-xs font-semibold capitalize hidden sm:block ${step >= 1 ? 'text-[#0F2D63]' : 'text-gray-400'}`}>
                                    Billing Info
                                </span>
                            </div>
                            <div className="flex-1 h-px bg-gray-200 mx-3"></div>
                        </div>
                        <div className="flex items-center flex-1">
                            <div className="flex items-center gap-2 shrink-0">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= 2 ? 'bg-[#0F2D63] text-white' : 'bg-gray-200 text-gray-400'}`}>
                                    2
                                </div>
                                <span className={`text-xs font-semibold capitalize hidden sm:block ${step >= 2 ? 'text-[#0F2D63]' : 'text-gray-400'}`}>
                                    Payment
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Error Display */}
                    {paymentError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
                            <p className="text-sm font-medium">{paymentError}</p>
                        </div>
                    )}

                    {/* Success State */}
                    {paymentSuccess && step === 2 ? (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-10 h-10 text-green-500" />
                            </div>
                            <h2 className="text-2xl font-bold text-[#1C1C1C] mb-2">Payment Successful!</h2>
                            <p className="text-gray-500 mb-4">
                                Your order #{orderId} has been confirmed. You will receive a confirmation email shortly.
                            </p>
                            <p className="text-sm text-gray-400 mb-6">
                                Download links will be available in your order confirmation email.
                            </p>
                            <button
                                onClick={() => {
                                    // Clear cart and redirect
                                    localStorage.removeItem('cart');
                                    window.location.href = '/digital-toolkit';
                                }}
                                className="bg-[#C85A32] hover:bg-[#a8472a] text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors"
                            >
                                Return to Shop
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col lg:flex-row gap-6 items-start">
                            <div className="flex-1">
                                <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                                    <h2 className="font-['Roboto'] font-bold text-[#1C1C1C] text-lg mb-6">Billing Information</h2>

                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 mb-1.5">First Name *</label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                placeholder="Jane"
                                                required
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                disabled={paymentProcessing}
                                                className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0F2D63] focus:ring-2 focus:ring-[#0F2D63]/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Last Name *</label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                placeholder="Doe"
                                                required
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                disabled={paymentProcessing}
                                                className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0F2D63] focus:ring-2 focus:ring-[#0F2D63]/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-xs font-semibold text-gray-500 mb-1.5">Email Address *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="you@organisation.org"
                                            required
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            disabled={paymentProcessing}
                                            className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0F2D63] focus:ring-2 focus:ring-[#0F2D63]/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-xs font-semibold text-gray-500 mb-1.5">Organisation (optional)</label>
                                        <input
                                            type="text"
                                            name="organisation"
                                            placeholder="Your institution"
                                            value={formData.organisation}
                                            onChange={handleInputChange}
                                            disabled={paymentProcessing}
                                            className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0F2D63] focus:ring-2 focus:ring-[#0F2D63]/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-xs font-semibold text-gray-500 mb-1.5">Street Address *</label>
                                        <input
                                            type="text"
                                            name="streetAddress"
                                            placeholder="123 Main Street"
                                            required
                                            value={formData.streetAddress}
                                            onChange={handleInputChange}
                                            disabled={paymentProcessing}
                                            className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0F2D63] focus:ring-2 focus:ring-[#0F2D63]/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 mb-1.5">City *</label>
                                            <input
                                                type="text"
                                                name="city"
                                                placeholder="Johannesburg"
                                                required
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                disabled={paymentProcessing}
                                                className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0F2D63] focus:ring-2 focus:ring-[#0F2D63]/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Postal Code *</label>
                                            <input
                                                type="text"
                                                name="postalCode"
                                                placeholder="2196"
                                                required
                                                value={formData.postalCode}
                                                onChange={handleInputChange}
                                                disabled={paymentProcessing}
                                                className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0F2D63] focus:ring-2 focus:ring-[#0F2D63]/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <label className="block text-xs font-semibold text-gray-500 mb-1.5">Country *</label>
                                        <select
                                            name="country"
                                            value={formData.country}
                                            onChange={handleInputChange}
                                            disabled={paymentProcessing}
                                            className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0F2D63] focus:ring-2 focus:ring-[#0F2D63]/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <option>South Africa</option>
                                            <option>Nigeria</option>
                                            <option>Kenya</option>
                                            <option>Ghana</option>
                                            <option>Egypt</option>
                                            <option>Ethiopia</option>
                                            <option>United Kingdom</option>
                                            <option>United States</option>
                                            <option>Other</option>
                                        </select>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={paymentProcessing}
                                        className="w-full bg-[#C85A32] hover:bg-[#a8472a] disabled:bg-[#C85A32]/70 text-white py-3.5 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                                    >
                                        {paymentProcessing ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Processing Payment...
                                            </>
                                        ) : (
                                            <>
                                                Continue to Payment <ArrowRight className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>

                            {/* Order Summary */}
                            <div className="lg:w-72 shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                <h3 className="font-['Roboto'] font-bold text-[#1C1C1C] mb-5">Order Summary</h3>
                                <div className="space-y-3 mb-5">
                                    {cartItems.map(({ product, quantity }) => (
                                        <div key={product.id} className="flex items-center gap-3">
                                            <div className="w-10 h-8 rounded-lg overflow-hidden shrink-0">
                                                <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-medium text-[#1C1C1C] truncate">{product.title}</p>
                                                <p className="text-[10px] text-gray-400">×{quantity}</p>
                                            </div>
                                            <span className="text-xs font-semibold text-[#1C1C1C] shrink-0">R{product.price * quantity}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t border-gray-100 pt-4">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm text-gray-500">Subtotal</span>
                                        <span className="text-sm font-semibold">R{getTotalPrice()}</span>
                                    </div>
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm text-gray-500">VAT (15%)</span>
                                        <span className="text-sm font-semibold">Included</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-[#1C1C1C]">Total</span>
                                        <span className="font-bold text-xl text-[#0F2D63]">R{getTotalPrice()}</span>
                                    </div>
                                </div>
                                <div className="mt-5 flex items-center gap-2 text-xs text-gray-400">
                                    <Lock className="w-3.5 h-3.5 shrink-0" />
                                    Secure checkout — your data is protected
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};

// Cart View Component (Keep as is)
interface CartViewProps {
    cartItems: CartItem[];
    updateQuantity: (productId: number, newQuantity: number) => void;
    removeFromCart: (productId: number) => void;
    getTotalPrice: () => number;
    onBack: () => void;
    onCheckout: () => void;
}

const CartView: React.FC<CartViewProps> = ({
    cartItems,
    updateQuantity,
    removeFromCart,
    getTotalPrice,
    onBack,
    onCheckout
}) => {
    return (
        <main className="flex-1 pt-0">
            <div className="bg-[#F5F0EA] min-h-[80vh] pt-28 pb-14">
                <div className="max-w-[1000px] mx-auto px-6 lg:px-8">
                    <div className="flex items-center gap-3 mb-8">
                        <button onClick={onBack} className="text-gray-400 hover:text-[#C85A32] transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h1 className="text-2xl font-['Roboto'] font-bold text-[#1C1C1C]">Your Cart</h1>
                        <span className="text-gray-400 text-sm">({cartItems.length} item{cartItems.length !== 1 ? 's' : ''})</span>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-6 items-start">
                        <div className="flex-1 flex flex-col gap-4">
                            {cartItems.length === 0 ? (
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
                                    <p className="text-gray-500">Your cart is empty</p>
                                    <button onClick={onBack} className="mt-4 text-[#C85A32] hover:underline">
                                        Continue Shopping
                                    </button>
                                </div>
                            ) : (
                                cartItems.map(({ product, quantity }) => (
                                    <div key={product.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex gap-5 items-start">
                                        <div className="w-20 h-16 rounded-xl overflow-hidden shrink-0">
                                            <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-[#1C1C1C] text-sm mb-0.5 truncate">{product.title}</h3>
                                            <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">{product.description}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-3 shrink-0">
                                            <span className="font-bold text-[#0F2D63]">R{product.price}</span>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => updateQuantity(product.id, quantity - 1)}
                                                    className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                                                >
                                                    <Minus className="w-3 h-3 text-gray-500" />
                                                </button>
                                                <span className="text-sm font-semibold w-5 text-center">{quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(product.id, quantity + 1)}
                                                    className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                                                >
                                                    <Plus className="w-3 h-3 text-gray-500" />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(product.id)}
                                                className="text-gray-300 hover:text-red-400 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {cartItems.length > 0 && (
                            <div className="lg:w-72 shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                <h3 className="font-['Roboto'] font-bold text-[#1C1C1C] mb-5">Order Summary</h3>
                                <div className="space-y-3 mb-5">
                                    {cartItems.map(({ product, quantity }) => (
                                        <div key={product.id} className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500 truncate max-w-[160px]">
                                                {product.title} ×{quantity}
                                            </span>
                                            <span className="font-semibold text-[#1C1C1C] shrink-0">
                                                R{product.price * quantity}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t border-gray-100 pt-4 mb-6">
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-[#1C1C1C]">Total</span>
                                        <span className="font-bold text-xl text-[#0F2D63]">R{getTotalPrice()}</span>
                                    </div>
                                    <p className="text-gray-400 text-xs mt-1">Includes VAT where applicable</p>
                                </div>
                                <button
                                    onClick={onCheckout}
                                    className="w-full bg-[#C85A32] hover:bg-[#a8472a] text-white py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
                                >
                                    Checkout <ArrowRight className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={onBack}
                                    className="w-full mt-3 border border-gray-200 hover:bg-gray-50 text-gray-600 py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4" /> Continue Shopping
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default DigitalToolkit;