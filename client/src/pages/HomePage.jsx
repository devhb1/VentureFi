import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { WalletContext } from '../context/WalletContext';

const HomePage = () => {
    const navigate = useNavigate();
    const { account, connectWallet, disconnectWallet } = useContext(WalletContext);

    return (
        <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col">
            {/* Navigation Bar */}
            <nav className="bg-gray-200 shadow-lg">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-blue-600">
                        VentureFi
                    </h1>
                    <div>
                        {account ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-600">
                                    Connected: {account.slice(0, 6)}...{account.slice(-4)}
                                </span>
                                <button
                                    onClick={disconnectWallet}
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
                                >
                                    Disconnect
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={connectWallet}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
                            >
                                Connect Wallet
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="flex flex-col items-center justify-center flex-grow px-6">
                {/* Company Logo */}
                <img
                    src="/VentureFiLogo.png"
                    alt="VentureFi Logo"
                    className="w-60 h-auto mb-8 shadow-lg rounded-lg"
                />

                {/* Introduction */}
                <h1 className="text-5xl font-extrabold text-blue-600 mb-6 text-center">
                    VentureFi: Decentralised Fundraising
                </h1>
                <p className="text-lg text-gray-700 text-center max-w-3xl mb-10 leading-relaxed">
                    Empowering creators, entrepreneurs, and innovators by enabling borderless, transparent, and censorship-resistant fundraising. 
                    Built on Ethereum’s Layer 2 Base network, VentureFi ensures low fees, fast transactions, and enhanced security while eliminating intermediaries.
                </p>

                {/* Buttons */}
                <div className="flex space-x-6">
                    {/* Donate Now Button */}
                    <button
                        onClick={() => navigate('/campaigns')}
                        className="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white px-8 py-3 rounded-lg text-lg font-medium shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                        Donate Now
                    </button>

                    {/* Create Campaign Button */}
                    <button
                        onClick={() => navigate('/create-campaign')}
                        className="bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                        Create Campaign
                    </button>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-200 py-4">
                <div className="container mx-auto text-center text-gray-600 text-sm">
                    © {new Date().getFullYear()} VentureFi. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default HomePage;