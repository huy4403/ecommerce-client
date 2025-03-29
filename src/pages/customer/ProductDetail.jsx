import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight, FaStar } from "react-icons/fa";
import { getProductById } from "~/services/product/product-service";
import FormatCurrency from "~/components/utils/FormatCurrency";
import { useParams } from "react-router-dom";

const ProductDetail = () => {
    const { id } = useParams();
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedAttributes, setSelectedAttributes] = useState({});
    const [isZoomed, setIsZoomed] = useState(false);
    const [product, setProduct] = useState({
        images: [],
        attributes: [],
        variants: [],
        title: '',
        brand: '',
        rating: 0,
        reviewCount: 0,
        price: 0,
        description: ''
    });
    const [reviews, setReviews] = useState([
        { id: 1, user: "John Doe", rating: 5, comment: "Great product!", date: "2024-01-15" },
        { id: 2, user: "Jane Smith", rating: 4, comment: "Good quality but a bit pricey", date: "2024-01-14" }
    ]);

    useEffect(() => {
        (async () => {
            const response = await getProductById(id);
            setProduct(response.data.data);
        })();
    }, [id]);

    const getAvailableAttributes = (attributeKey) => {
        const attribute = product.attributes.find(attr => attr.key === attributeKey);
        if (!attribute || !attribute.values.length) return [];

        const otherAttributes = Object.entries(selectedAttributes).filter(([key]) => key !== attributeKey);
        const filteredVariants = product.variants.filter(variant => {
            return otherAttributes.every(([key, value]) => {
                const attrId = product.attributes
                    .find(attr => attr.key === key)
                    ?.values.find(v => v.value === value)?.id;
                return variant.attributes.some(attr => attr.id === attrId);
            });
        });

        const availableIds = new Set();
        filteredVariants.forEach(variant => {
            variant.attributes.forEach(attr => {
                availableIds.add(attr.id);
            });
        });

        return attribute.values
            .filter(val => availableIds.has(val.id))
            .map(val => val.value);
    };

    const handleAttributeSelect = (attributeKey, value) => {
        const newAttributes = { ...selectedAttributes };

        if (newAttributes[attributeKey] === value) {
            delete newAttributes[attributeKey];
        } else {
            newAttributes[attributeKey] = value;
        }

        product.attributes.forEach(attr => {
            if (attr.key !== attributeKey && attr.values.length > 0) {
                const availableValues = getAvailableAttributes(attr.key);
                if (!availableValues.includes(newAttributes[attr.key])) {
                    delete newAttributes[attr.key];
                }
            }
        });

        setSelectedAttributes(newAttributes);
    };

    const isVariantAvailable = () => {
        const requiredAttributes = product.attributes.filter(attr => attr.values.length > 0);
        if (requiredAttributes.length !== Object.keys(selectedAttributes).length) return false;

        return product.variants.some(variant => {
            return Object.entries(selectedAttributes).every(([key, value]) => {
                const attrId = product.attributes
                    .find(attr => attr.key === key)
                    ?.values.find(v => v.value === value)?.id;
                return variant.attributes.some(attr => attr.id === attrId);
            });
        });
    };

    const getCurrentVariant = () => {
        return product.variants.find(variant => {
            return Object.entries(selectedAttributes).every(([key, value]) => {
                const attrId = product.attributes
                    .find(attr => attr.key === key)
                    ?.values.find(v => v.value === value)?.id;
                return variant.attributes.some(attr => attr.id === attrId);
            });
        });
    };

    const handleAddToCart = () => {
        const currentVariant = getCurrentVariant();
        if (currentVariant) {
            console.log("Adding variant ID to cart:", currentVariant.id);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative">
                    <div
                        className="relative overflow-hidden rounded-lg"
                        onMouseEnter={() => setIsZoomed(true)}
                        onMouseLeave={() => setIsZoomed(false)}
                    >
                        <img
                            src={product.images[selectedImage]}
                            alt={product.title}
                            className={`w-full h-[500px] object-cover transition-transform duration-300 ${isZoomed ? "scale-110" : ""}`}
                            onError={(e) => {
                                e.target.src = "https://images.unsplash.com/photo-1595341888016-a392ef81b7de";
                            }}
                        />
                    </div>

                    <div className="flex mt-4 gap-2">
                        {product.images.map((img, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedImage(index)}
                                className={`w-20 h-20 rounded-md overflow-hidden ${selectedImage === index ? "ring-2 ring-blue-500" : ""}`}
                            >
                                <img
                                    src={img}
                                    alt={`${product.title} thumbnail ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setSelectedImage(prev => (prev > 0 ? prev - 1 : product.images.length - 1))}
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg"
                        aria-label="Previous image"
                    >
                        <FaChevronLeft className="text-gray-800" />
                    </button>
                    <button
                        onClick={() => setSelectedImage(prev => (prev < product.images.length - 1 ? prev + 1 : 0))}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg"
                        aria-label="Next image"
                    >
                        <FaChevronRight className="text-gray-800" />
                    </button>
                </div>

                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
                    <p className="text-lg text-gray-600 mt-2">{product.brand}</p>

                    <div className="flex items-center mt-4">
                        <div className="flex items-center">
                            {[...Array(5)].map((_, index) => (
                                <FaStar
                                    key={index}
                                    className={index < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}
                                />
                            ))}
                        </div>
                        <span className="ml-2 text-gray-600">{product.reviews} reviews</span>
                    </div>

                    <p className="text-2xl font-bold text-gray-900 mt-4">
                        {FormatCurrency(product.price)}
                    </p>

                    <p className="mt-4 text-gray-700">{product.description}</p>

                    <div className="mt-6 space-y-6">
                        {product.attributes.filter(attr => attr.values.length > 0).map(attr => {
                            const availableValues = getAvailableAttributes(attr.key);
                            return (
                                <div key={attr.key}>
                                    <h3 className="text-sm font-medium text-gray-900">{attr.key}</h3>
                                    <div className="grid grid-cols-3 gap-3 mt-2">
                                        {attr.values.map((val) => {
                                            const isAvailable = availableValues.includes(val.value);
                                            const isSelected = selectedAttributes[attr.key] === val.value;
                                            return (
                                                <button
                                                    key={val.id}
                                                    onClick={() => isAvailable && handleAttributeSelect(attr.key, val.value)}
                                                    className={`
                            px-4 py-2 text-sm rounded-md border
                            ${!isAvailable ? "opacity-50 cursor-not-allowed bg-gray-100" : ""}
                            ${isSelected
                                                            ? "border-blue-500 bg-blue-50 text-blue-700"
                                                            : "border-gray-300 text-gray-700 hover:border-gray-400"}
                          `}
                                                    disabled={!isAvailable}
                                                    aria-label={`Select ${attr.key}: ${val.value}`}
                                                >
                                                    {val.value}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {getCurrentVariant() && (
                        <p className="mt-4 text-sm text-gray-600">
                            Stock: {getCurrentVariant().quantity} units available
                        </p>
                    )}

                    <button
                        onClick={handleAddToCart}
                        disabled={!isVariantAvailable()}
                        className={`
              mt-8 w-full py-3 px-8 rounded-md text-white font-medium
              ${isVariantAvailable()
                                ? "bg-blue-600 hover:bg-blue-700"
                                : "bg-gray-400 cursor-not-allowed"}
            `}
                        aria-label="Add to cart"
                    >
                        {isVariantAvailable() ? "Add to Cart" : "Select all attributes"}
                    </button>

                    <div className="mt-12">
                        <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>

                        <div className="space-y-4">
                            {reviews.map(review => (
                                <div key={review.id} className="border-b pb-4">
                                    <div className="flex items-center mb-2">
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, index) => (
                                                <FaStar
                                                    key={index}
                                                    className={index < review.rating ? "text-yellow-400" : "text-gray-300"}
                                                />
                                            ))}
                                        </div>
                                        <span className="ml-2 font-medium">{review.user}</span>
                                        <span className="ml-2 text-gray-500 text-sm">{review.date}</span>
                                    </div>
                                    <p className="text-gray-700">{review.comment}</p>
                                </div>
                            ))}
                        </div>

                        {product.bought ? (
                            <div className="mb-6">
                                <textarea
                                    className="w-full p-3 border rounded-md"
                                    placeholder="Write your review..."
                                    rows="3"
                                ></textarea>
                                <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                                    Submit Review
                                </button>
                            </div>
                        ) : (
                            <p className="text-gray-600 mb-4">Purchase this product to leave a review</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;