import React, { useState, useEffect } from "react";
import { FaStar, FaCheck } from "react-icons/fa";
import { getAllReview, changeReviewStatus, addReply } from "~/services/admin/review-service"
import { Toast } from "~/components/ui/Toast";
import ConfirmationDialog from "~/components/ui/ConfirmationDialog";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

function ReviewManagement() {

    localStorage.setItem("activeSection", "reviews");

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [sort, setSort] = useState("date_desc");

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                let page = currentPage;
                const response = await getAllReview(page);
                setReviews(response.data.data || []);
                setTotalPages(response.data.totalPages || 1);
            } catch (err) {
                console.log(err);
                Toast.error("Lỗi khi tải đánh giá");
            } finally {
                setLoading(false);
            }
        })();
    }, [currentPage]);

    const handleStatusChange = async (id, newStatus) => {
        ConfirmationDialog(`Bạn có thật sự muốn ${newStatus === 'VALID' ? 'mở khóa' : 'xóa'} bình luận này`)
            .then(async (result) => {
                if (result) {
                    try {
                        const res = await changeReviewStatus(id, newStatus);
                        Toast.success(`${newStatus === 'VALID' ? 'Mở khóa' : 'Xóa'} thành công bình luận`);
                        setReviews(reviews.map(review =>
                            review.id === id ? { ...review, status: newStatus } : review
                        ));
                    } catch (err) {
                        console.log(err);
                        Toast.error("Đã xảy ra lỗi khi thay đổi trạng thái bình luận này")
                    }
                }
            });
    };

    const handleResponse = async (id, content) => {
        if (!content.trim()) {
            Toast.error("Vui lòng nhập nội dung phản hồi");
            return;
        }

        try {
            const request = { content };
            const response = await addReply(id, request);

            Toast.success("Phản hồi đã được gửi thành công");

            setReviews(reviews.map(review =>
                review.id === id ? {
                    ...review,
                    reply: {
                        content: content,
                        replyDate: new Date().toLocaleString()
                    }
                } : review
            ));
        } catch (err) {
            console.log(err);
            Toast.error("Đã xảy ra lỗi khi gửi phản hồi");
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSortChange = (sortOption) => {
        setSort(sortOption);

        const sortedReviews = [...reviews];

        switch (sortOption) {
            case "date_asc":
                sortedReviews.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case "date_desc":
                sortedReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case "rating_asc":
                sortedReviews.sort((a, b) => a.rating - b.rating);
                break;
            case "rating_desc":
                sortedReviews.sort((a, b) => b.rating - a.rating);
                break;
            default:
                break;
        }

        setReviews(sortedReviews);
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, index) => (
            <FaStar
                key={index}
                className={`${index < rating ? "text-yellow-400" : "text-gray-300"} inline-block`}
            />
        ));
    };

    const CommentCard = ({ comment }) => {
        const { register, handleSubmit, reset, formState: { errors } } = useForm();

        const onSubmit = async (data) => {
            await handleResponse(comment.id, data.replyContent);
            reset();
        };

        return (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
                <div>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <div className="mt-1 inline-block mr-2">{renderStars(comment.rating)}</div>
                            <h3 className="text-xl font-bold text-gray-800 inline-block">{comment.user}</h3>
                        </div>
                        <div className="flex space-x-2">
                            <select
                                value={comment.status || "VALID"}
                                onChange={(e) => handleStatusChange(comment.id, e.target.value)}
                                className="rounded border border-gray-300 px-2 py-1"
                            >
                                <option value="VALID">Hợp lệ</option>
                                <option value="VIOLATE">Vi phạm</option>
                            </select>
                        </div>
                    </div>

                    <Link className="text-xl font-semibold text-gray-800 inline-block mb-4"
                        to={`product/${comment.productId}`}
                    >
                        Sản phẩm: {comment.product}
                    </Link>
                </div>

                <p className="text-gray-600 mb-4">{comment.comment}</p>

                {comment.images && comment.images.length > 0 && (
                    <div className="grid grid-cols-5 gap-2 mb-4">
                        {comment.images.map((image, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={image}
                                    alt={`Review image ${index + 1}`}
                                    className="w-full h-24 object-cover rounded cursor-pointer"
                                    onClick={() => window.open(image, '_blank')}
                                />
                            </div>
                        ))}
                    </div>
                )}

                <div className="text-sm text-gray-500 mb-4">
                    Đánh giá lúc {comment.date}
                </div>

                <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Phản hồi:</h4>
                    {comment.reply ? (
                        <div className="pl-4 border-l-2 border-gray-300">
                            <div className="flex items-center">
                                <span className="ml-2 text-gray-500 text-sm">{comment.reply.replyDate}</span>
                            </div>
                            <p className="text-gray-600 mt-1">{comment.reply.content}</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="flex">
                            <input
                                type="text"
                                placeholder="Viết phản hồi..."
                                className="flex-1 border rounded-l px-3 py-2"
                                {...register("replyContent", { required: true })}
                            />
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 rounded-r hover:bg-blue-600"
                            >
                                <FaCheck />
                            </button>
                        </form>
                    )}
                </div>
            </div>
        );
    };

    const Pagination = () => (
        <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded ${currentPage === 1
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                >
                    Trước
                </button>

                {[...Array(totalPages)].map((_, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        className={`px-4 py-2 rounded ${currentPage === index + 1
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 hover:bg-gray-300'}`}
                    >
                        {index + 1}
                    </button>
                ))}

                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded ${currentPage === totalPages
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                >
                    Tiếp
                </button>
            </div>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Quản lý đánh giá</h1>

                <select
                    className="border rounded-lg px-4 py-2"
                    value={sort}
                    onChange={(e) => handleSortChange(e.target.value)}
                >
                    <option value="date_desc">Mới nhất</option>
                    <option value="date_asc">Cũ nhất</option>
                    <option value="rating_desc">Rating cao nhất</option>
                    <option value="rating_asc">Rating thấp nhất</option>
                </select>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : reviews.length > 0 ? (
                <div className="space-y-4">
                    {reviews.map(comment => (
                        <CommentCard key={comment.id} comment={comment} />
                    ))}
                    <Pagination />
                </div>
            ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                    <p className="text-xl text-gray-600">Không có đánh giá nào</p>
                </div>
            )}
        </div>
    );
};
export default ReviewManagement;