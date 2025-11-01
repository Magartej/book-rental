import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const mockRatings = [
  {
    id: 1,
    user: "Alice Johnson",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
    comment:
      "Absolutely loved this book! The story was captivating and the characters were so real. Highly recommend to everyone.",
    book: "MunaMadan",
  },
  {
    id: 2,
    user: "Michael Smith",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 4,
    comment:
      "A great read with lots of twists. I enjoyed every chapter and learned a lot.",
    book: "Herry Potter",
  },
  {
    id: 3,
    user: "Priya Sharma",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 5,
    comment:
      "One of the best books I have read this year. The writing style is beautiful and the plot is engaging.",
    book: "Find A Sponsor",
  },
  {
    id: 4,
    user: "John Doe",
    avatar: "https://randomuser.me/api/portraits/men/85.jpg",
    rating: 3,
    comment:
      "Good book, but a bit slow in the middle. Still worth a read for the ending.",
    book: "The Hungry Games",
  },
  {
    id: 5,
    user: "Sara Lee",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
    rating: 4,
    comment:
      "Enjoyed the book a lot! The author did a fantastic job with the world-building.",
    book: "Four Thousand Weeks",
  },
];

const StarRating = ({ rating }) => (
  <div className="flex gap-0.5 justify-center mb-2">
    {[1, 2, 3, 4, 5].map((star) => (
      <svg
        key={star}
        className={`w-4 h-4 ${
          star <= rating ? "text-yellow-400" : "text-gray-300"
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.049 9.394c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z" />
      </svg>
    ))}
  </div>
);

const UserRatings = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <h2 className="text-3xl font-semibold mb-8 text-center">
        What Our Readers Say
      </h2>
      <div className="max-w-6xl mx-auto">
        <Slider {...settings}>
          {mockRatings.map((item) => (
            <div key={item.id} className="px-4">
              <div
                className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center h-full min-h-[340px] max-w-sm mx-auto w-full transition-transform duration-300 hover:scale-105"
                style={{ height: "370px" }}
              >
                <img
                  src={item.avatar}
                  alt={item.user}
                  className="w-24 h-24 rounded-full mb-4 object-cover border-4 border-blue-200 shadow"
                />
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {item.user}
                </h3>
                <StarRating rating={item.rating} />
                <p className="text-gray-600 mt-2 mb-2 text-base max-w-[260px] mx-auto line-clamp-4">
                  "{item.comment}"
                </p>
                <span className="text-sm text-blue-600 font-semibold mt-2">
                  Book: {item.book}
                </span>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default UserRatings;
