import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';

// Component to display a list of campaigns
const CampaignList = ({ campaigns, contract, account, onCampaignUpdate }) => {
    const [timeLeft, setTimeLeft] = useState({}); // Track time left for each campaign
    const [donorsData, setDonorsData] = useState({}); // Track donors for each campaign
    const navigate = useNavigate(); // Navigation hook

    // Calculate time left for each campaign
    useEffect(() => {
        const updateTimeLeft = () => {
            const times = {};
            campaigns.forEach(campaign => {
                const deadline = parseInt(campaign.deadline);
                const now = Math.floor(Date.now() / 1000);
                times[campaign.id] = deadline > now ? deadline - now : 0;
            });
            setTimeLeft(times);
        };

        if (campaigns.length > 0) {
            updateTimeLeft();
            const timer = setInterval(updateTimeLeft, 1000); // Update every second
            return () => clearInterval(timer);
        }
    }, [campaigns]);

    // Format time left into a readable format
    const formatTime = (seconds) => {
        if (seconds <= 0) return "Ended";
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (days > 0) return `${days}d ${hours}h`;
        if (hours > 0) return `${hours}h ${minutes}m`;
        if (minutes > 0) return `${minutes}m ${secs}s`;
        return `${secs}s`;
    };

    // Handle withdrawal of funds by the campaign creator
    const handleWithdraw = async (campaignId) => {
        try {
            const tx = await contract.withdrawFunds(campaignId);
            await tx.wait();
            alert("Funds withdrawn successfully!");
            onCampaignUpdate(); // Refresh campaign data
        } catch (error) {
            console.error("Error during withdrawal:", error);
            alert(error.message || "Withdrawal failed. Please try again.");
        }
    };

    // Fetch and toggle donors for a campaign
    const handleViewDonors = async (campaignId) => {
        if (donorsData[campaignId]) {
            // If donors are already fetched, toggle visibility
            setDonorsData(prev => ({
                ...prev,
                [campaignId]: { ...prev[campaignId], visible: !prev[campaignId].visible },
            }));
        } else {
            // Fetch donors from the contract
            try {
                const [donorAddresses, donationAmounts] = await contract.getDonors(campaignId);

                if (donorAddresses.length > 0) {
                    const donors = donorAddresses.map((address, index) => ({
                        address,
                        amount: ethers.formatEther(donationAmounts[index]),
                    }));

                    setDonorsData(prev => ({
                        ...prev,
                        [campaignId]: { donors, visible: true },
                    }));
                } else {
                    setDonorsData(prev => ({
                        ...prev,
                        [campaignId]: { donors: [], visible: true },
                    }));
                }
            } catch (error) {
                console.error("Error fetching donors:", error);
                alert("Failed to fetch donors. Please try again.");
            }
        }
    };

    // Separate active and ended campaigns
    const activeCampaigns = campaigns.filter(campaign => {
        const raised = parseFloat(ethers.formatEther(campaign.raisedAmount));
        const goal = parseFloat(ethers.formatEther(campaign.goal));
        return timeLeft[campaign.id] > 0 && raised < goal;
    });

    const endedCampaigns = campaigns.filter(campaign => {
        const raised = parseFloat(ethers.formatEther(campaign.raisedAmount));
        const goal = parseFloat(ethers.formatEther(campaign.goal));
        return timeLeft[campaign.id] <= 0 || raised >= goal;
    });

    return (
        <div className="min-h-screen bg-gray-100 text-gray-800 py-8">
            <div className="container mx-auto relative">
                {/* Button to navigate to the Create Campaign page */}
                <button
                    onClick={() => navigate('/create-campaign')}
                    className="absolute top-0 right-0 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-2 rounded-lg shadow-lg transition-all duration-300"
                >
                    Create Campaign
                </button>

                <h1 className="text-3xl font-bold text-center mb-8">Campaigns</h1>

                {/* Active Campaigns Section */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-green-600 mb-4">Active Campaigns</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {activeCampaigns.map((campaign) => {
                            const goal = ethers.formatEther(campaign.goal);
                            const raised = ethers.formatEther(campaign.raisedAmount);
                            const percentage = (parseFloat(raised) / parseFloat(goal)) * 100;

                            return (
                                <div
                                    key={campaign.id}
                                    className="p-6 rounded-lg shadow-lg border border-green-500 bg-white"
                                >
                                    <h3 className="text-xl font-bold text-green-600 mb-2">{campaign.title}</h3>
                                    <p className="text-gray-600 mb-4">{campaign.story}</p>

                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span>Progress</span>
                                                <span>{percentage.toFixed(1)}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="h-2 rounded-full bg-green-500"
                                                    style={{ width: `${Math.min(100, percentage)}%` }}
                                                ></div>
                                            </div>
                                            <div className="flex justify-between text-sm mt-1">
                                                <span>{raised} ETH raised</span>
                                                <span>{goal} ETH goal</span>
                                            </div>
                                        </div>

                                        <div className="text-sm text-gray-500">
                                            Deadline: {new Date(campaign.deadline * 1000).toLocaleString()}
                                        </div>

                                        <div className="text-sm font-bold text-green-600">
                                            {`Active - ${formatTime(timeLeft[campaign.id])} left`}
                                        </div>

                                        {/* Donate and View Donors Buttons */}
                                        <div className="flex space-x-4">
                                            <button
                                                onClick={() => {
                                                    const amount = prompt("Enter donation amount in ETH:");
                                                    if (amount) {
                                                        const parsedAmount = ethers.parseEther(amount);
                                                        contract.donate(campaign.id, { value: parsedAmount })
                                                            .then(() => {
                                                                alert("Donation successful!");
                                                                onCampaignUpdate();
                                                            })
                                                            .catch((error) => {
                                                                console.error("Error during donation:", error);
                                                                alert("Donation failed. Please try again.");
                                                            });
                                                    }
                                                }}
                                                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg transition-all duration-300"
                                            >
                                                Donate Now
                                            </button>
                                            <button
                                                onClick={() => handleViewDonors(campaign.id)}
                                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-all duration-300"
                                            >
                                                {donorsData[campaign.id]?.visible ? "Hide Donors" : "Show Donors"}
                                            </button>
                                        </div>

                                        {/* Donors List */}
                                        {donorsData[campaign.id]?.visible && (
                                            <div className="mt-4 bg-gray-100 p-4 rounded-lg shadow-inner">
                                                <h4 className="text-lg font-bold text-gray-700 mb-2">Donors</h4>
                                                {donorsData[campaign.id]?.donors.length > 0 ? (
                                                    <ul className="space-y-2">
                                                        {donorsData[campaign.id].donors.map((donor, index) => (
                                                            <li key={index} className="text-sm text-gray-600">
                                                                {`Donor ${index + 1}: ${donor.address.slice(0, 5)}...${donor.address.slice(-5)} - ${donor.amount} ETH`}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p className="text-sm text-gray-500">No donors for this campaign.</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Ended Campaigns Section */}
                <div>
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Ended Campaigns</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {endedCampaigns.map((campaign) => {
                            const goal = ethers.formatEther(campaign.goal);
                            const raised = ethers.formatEther(campaign.raisedAmount);
                            const percentage = (parseFloat(raised) / parseFloat(goal)) * 100;
                            const isCampaignOwner = account.toLowerCase() === campaign.fundraiser.toLowerCase(); // Check if the user is the campaign owner

                            return (
                                <div
                                    key={campaign.id}
                                    className="p-6 rounded-lg shadow-lg border border-red-500 bg-white"
                                >
                                    <h3 className="text-xl font-bold text-red-600 mb-2">{campaign.title}</h3>
                                    <p className="text-gray-600 mb-4">{campaign.story}</p>

                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span>Progress</span>
                                                <span>{percentage.toFixed(1)}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="h-2 rounded-full bg-red-500"
                                                    style={{ width: `${Math.min(100, percentage)}%` }}
                                                ></div>
                                            </div>
                                            <div className="flex justify-between text-sm mt-1">
                                                <span>{raised} ETH raised</span>
                                                <span>{goal} ETH goal</span>
                                            </div>
                                        </div>

                                        <div className="text-sm text-gray-500">
                                            Deadline: {new Date(campaign.deadline * 1000).toLocaleString()}
                                        </div>

                                        <div className="text-sm font-bold text-red-600">Ended</div>

                                        {/* Withdraw Funds Button */}
                                        {isCampaignOwner && (
                                            <button
                                                onClick={() => handleWithdraw(campaign.id)}
                                                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-300"
                                            >
                                                Withdraw Funds
                                            </button>
                                        )}

                                        {/* View Donors Button */}
                                        <button
                                            onClick={() => handleViewDonors(campaign.id)}
                                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-all duration-300"
                                        >
                                            {donorsData[campaign.id]?.visible ? "Hide Donors" : "Show Donors"}
                                        </button>

                                        {/* Donors List */}
                                        {donorsData[campaign.id]?.visible && (
                                            <div className="mt-4 bg-gray-100 p-4 rounded-lg shadow-inner">
                                                <h4 className="text-lg font-bold text-gray-700 mb-2">Donors</h4>
                                                {donorsData[campaign.id]?.donors.length > 0 ? (
                                                    <ul className="space-y-2">
                                                        {donorsData[campaign.id].donors.map((donor, index) => (
                                                            <li key={index} className="text-sm text-gray-600">
                                                                {`Donor ${index + 1}: ${donor.address.slice(0, 5)}...${donor.address.slice(-5)} - ${donor.amount} ETH`}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p className="text-sm text-gray-500">No donors for this campaign.</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CampaignList;