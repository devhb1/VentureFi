import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import CampaignABI from '../contracts/Campaign.json';

// Component to create a new fundraising campaign
const CreateCampaign = ({ contract: parentContract }) => {
    const [contract, setContract] = useState(parentContract || null); // Contract instance
    const [formData, setFormData] = useState({
        title: '', // Campaign title
        goal: '', // Campaign goal in ETH
        story: '', // Campaign story/description
        duration: '', // Campaign duration
    });
    const [isLoading, setIsLoading] = useState(false); // Loading state for form submission
    const [error, setError] = useState(''); // Error message
    const [durations, setDurations] = useState([]); // Available durations for campaigns
    const navigate = useNavigate(); // Hook for navigation

    // Initialize the contract if not passed as a prop
    useEffect(() => {
        const initializeContract = async () => {
            if (!parentContract && window.ethereum) {
                try {
                    const provider = new ethers.BrowserProvider(window.ethereum);
                    const signer = await provider.getSigner();
                    const address = "0xFd493482B7114ff8503160A37d6171947680a81d"; // Replace with your deployed contract address
                    const campaignContract = new ethers.Contract(address, CampaignABI.abi, signer);
                    setContract(campaignContract);
                } catch (error) {
                    console.error("Error initializing contract:", error);
                    setError("Failed to initialize contract. Please try again.");
                }
            }
        };

        initializeContract();
    }, [parentContract]);

    // Fetch available durations from the contract
    useEffect(() => {
        const fetchDurations = async () => {
            try {
                if (contract) {
                    const availableDurations = await contract.getDurations();
                    setDurations(availableDurations.map(d => d.toString())); // Convert durations to strings
                    setFormData(prev => ({
                        ...prev,
                        duration: availableDurations[0]?.toString() || '', // Set default duration
                    }));
                }
            } catch (error) {
                console.error("Error fetching durations:", error);
                setError("Failed to load duration options");
            }
        };

        if (contract) {
            fetchDurations();
        }
    }, [contract]);

    // Handle input changes in the form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        setError(''); // Clear any previous errors
    };

    // Handle form submission to create a new campaign
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.goal || !formData.story || !formData.duration) {
            setError("All fields are required");
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // Call the createCampaign function on the contract
            const tx = await contract.createCampaign(
                formData.title.trim(),
                ethers.parseEther(formData.goal), // Convert goal to wei
                formData.duration,
                formData.story.trim(),
                "" // Placeholder for imageUrl
            );

            await tx.wait(); // Wait for the transaction to be mined

            // Redirect to the "Donate Now" page after successful campaign creation
            navigate('/campaigns');

            // Reset form
            setFormData({
                title: '',
                goal: '',
                story: '',
                duration: durations[0]?.toString() || '',
            });
        } catch (error) {
            console.error("Error creating campaign:", error);
            setError(error.message || "Failed to create campaign");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-gray-800 text-gray-100 shadow-lg rounded-lg p-8">
            <h2 className="text-2xl font-bold text-blue-400 mb-6">Create a New Campaign</h2>
            {error && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Campaign Title Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                        Campaign Title
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-gray-100"
                        placeholder="Enter campaign title"
                        disabled={isLoading}
                    />
                </div>

                {/* Campaign Goal Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                        Goal Amount (ETH)
                    </label>
                    <input
                        type="number"
                        name="goal"
                        value={formData.goal}
                        onChange={handleInputChange}
                        step="0.0001"
                        min="0"
                        className="w-full px-4 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-gray-100"
                        placeholder="Enter goal amount in ETH"
                        disabled={isLoading}
                    />
                </div>

                {/* Campaign Duration Dropdown */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                        Campaign Duration
                    </label>
                    <select
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-gray-100"
                        disabled={isLoading}
                    >
                        {durations.map((duration, index) => (
                            <option key={index} value={duration}>
                                {duration} seconds
                            </option>
                        ))}
                    </select>
                </div>

                {/* Campaign Story Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                        Campaign Story
                    </label>
                    <textarea
                        name="story"
                        value={formData.story}
                        onChange={handleInputChange}
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-gray-100"
                        placeholder="Tell your campaign story..."
                        disabled={isLoading}
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full px-4 py-2 text-white font-medium rounded-md transition-colors duration-300 
                        ${isLoading 
                            ? 'bg-gray-600 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'}`}
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Creating Campaign...
                        </span>
                    ) : (
                        'Create Campaign'
                    )}
                </button>
            </form>
        </div>
    );
};

export default CreateCampaign;