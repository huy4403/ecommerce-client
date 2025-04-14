import { useEffect, useState } from "react";
import { getReview, createReview } from "~/services/review/review-service";
import { FaStar } from "react-icons/fa";
import { Toast } from "~/components/ui/Toast";
import { useForm } from "react-hook-form";

function Review({ id, bought }) {
    const [reviews, setReviews] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const limit = 9;
    const [reviewImages, setReviewImages] = useState(Array(5).fill(null));
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, watch, setValue, reset } = useForm({
        defaultValues: {
            rating: 0,
            comment: ""
        }
    });

    const rating = watch("rating");

    useEffect(() => {
        (async () => {
            try {
                const response = await getReview(id, page, limit);
                if (response.data.data.length === 0) {
                    setHasMore(false);
                } else {
                    setReviews(prev => page === 1 ? response.data.data : [...prev, ...response.data.data]);
                }
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        })();
    }, [id, page]);

    const handleLoadMore = () => {
        setPage(prev => prev + 1);
    };

    const onSubmit = async (data) => {
        if (!data.rating) {
            Toast.error("Vui lòng chọn số sao đánh giá");
            return;
        }

        if (!data.comment.trim()) {
            Toast.error("Vui lòng nhập nội dung đánh giá");
            return;
        }

        try {
            setIsSubmitting(true);

            // Filter out null images and convert base64 to files
            const filteredImages = reviewImages.filter(img => img !== null);
            const imageFiles = await Promise.all(filteredImages.map(async (base64String) => {
                const response = await fetch(base64String);
                const blob = await response.blob();
                return new File([blob], 'review-image.jpg', { type: 'image/jpeg' });
            }));

            const formData = new FormData();
            formData.append('productId', parseInt(id));
            formData.append('rating', data.rating);
            formData.append('comment', data.comment);

            imageFiles.forEach((file) => {
                formData.append('reviewImages', file);
            });

            await createReview(formData);

            Toast.success("Đánh giá của bạn đã được gửi thành công");
            reset();
            setReviewImages(Array(5).fill(null));

            // Refresh reviews
            const refreshResponse = await getReview(id, 1, limit);
            setReviews(refreshResponse.data.data);
            setPage(1);
        } catch (error) {
            console.error("Error submitting review:", error);
            Toast.error("Có lỗi xảy ra khi gửi đánh giá");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <div className="mt-10 lg:mt-20">
                <h2 className="text-xl font-bold mb-4">Đánh giá</h2>

                <div className="space-y-4">
                    {reviews.length > 0 ? (
                        reviews.map(review => (
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
                                {review.images && review.images.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {review.images.map((img, index) => (
                                            <img
                                                key={index}
                                                src={img}
                                                alt={`Review image ${index + 1}`}
                                                className="w-20 h-20 object-cover rounded-md"
                                            />
                                        ))}
                                    </div>
                                )}
                                {review.reply
                                    ? (
                                        <div className="mt-3 pl-4 border-l-2 border-gray-300">
                                            <div className="flex items-center">
                                                <span className="font-medium text-blue-600">Đoàn Huy Ecommerce</span>
                                                <span className="ml-2 text-gray-500 text-sm">{review.reply.replyDate}</span>
                                            </div>
                                            <p className="text-gray-700 mt-1">{review.reply.content}</p>
                                        </div>
                                    ) : (
                                        <div className="mt-3 pl-4 text-gray-500 italic">Chưa có phản hồi từ quản trị viên</div>
                                    )
                                }
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-6">
                            <p className="text-gray-500">Không có đánh giá nào.</p>
                        </div>
                    )}
                </div>

                {reviews.length > 0 && hasMore && (
                    <div className="flex justify-center mt-6">
                        <button
                            onClick={handleLoadMore}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                        >
                            Xem thêm đánh giá
                        </button>
                    </div>
                )}

                {bought ? (
                    <form onSubmit={handleSubmit(onSubmit)} className="mb-6 mt-10">
                        <div className="flex items-center mb-3">
                            <span className="mr-3 font-medium">Rating:</span>
                            <div className="flex">
                                {[...Array(5)].map((_, index) => (
                                    <FaStar
                                        key={index}
                                        className={`text-2xl cursor-pointer ${index < (rating || 0) ? "text-yellow-400" : "text-gray-300"}`}
                                        onClick={() => setValue("rating", index + 1)}
                                    />
                                ))}
                            </div>
                        </div>
                        <textarea
                            className="w-full p-3 border rounded-md"
                            placeholder="Viết đánh giá của bạn..."
                            rows="3"
                            {...register("comment")}
                        ></textarea>
                        <div className="mt-3">
                            <p className="mb-2 font-medium">Thêm hình ảnh (tối đa 5 ảnh):</p>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {reviewImages.map((image, index) => {
                                    const handleImageChange = (e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                const newImages = [...reviewImages];
                                                newImages[index] = reader.result;
                                                setReviewImages(newImages);
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    };

                                    return (
                                        <div key={index} className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:border-blue-500 overflow-hidden">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                id={`review-image-${index}`}
                                                onChange={handleImageChange}
                                            />
                                            <label htmlFor={`review-image-${index}`} className="cursor-pointer w-full h-full flex items-center justify-center">
                                                {image ? (
                                                    <img src={image} alt="Preview" className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-gray-400 text-2xl">+</span>
                                                )}
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                            <p className="text-sm text-gray-500">Nhấp vào ô để thêm ảnh</p>
                        </div>
                        <button
                            type="submit"
                            className={`mt-4 px-4 py-2 rounded-md text-white ${isSubmitting ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'}
                            w-full lg:w-25 h-13 lg:h-10`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Đang gửi...' : 'Đánh giá'}
                        </button>
                    </form>
                ) : (
                    <p className="text-gray-600 mb-4 text-center">Mua sản phẩm này để đánh giá</p>
                )}
            </div>
        </div>
    );
}

export default Review;
