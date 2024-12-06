import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavigationBar from '../home/NavigationBar';

const BookingConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { bookingDetails } = location.state || {};

    if (!bookingDetails) {
        return (
            <div>
                <NavigationBar />
                <div className="container mx-auto px-4 py-8">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        No booking details found. Please try booking again.
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <NavigationBar />
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
                    {/* Success Message */}
                    <div className="text-center mb-8">
                        <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
                            <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h1>
                        <p className="text-gray-600">Your tickets have been booked successfully</p>
                    </div>

                    {/* Booking Details */}
                    <div className="border-t border-b border-gray-200 py-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-gray-600">Theater</p>
                                <p className="font-medium">{bookingDetails.theaterName}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Location</p>
                                <p className="font-medium">{bookingDetails.theaterLocation}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Show Time</p>
                                <p className="font-medium">
                                    {new Date(bookingDetails.showTime).toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-600">Screen</p>
                                <p className="font-medium">Screen {bookingDetails.screenNumber}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Seats</p>
                                <p className="font-medium">{bookingDetails.seats}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Total Amount</p>
                                <p className="font-medium">${bookingDetails.totalPrice}</p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate('/home')}
                            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
                        >
                            Back to Home
                        </button>
                        <button
                            onClick={() => window.print()}
                            className="bg-gray-100 text-gray-700 px-6 py-2 rounded hover:bg-gray-200 transition-colors"
                        >
                            Print Ticket
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingConfirmation;