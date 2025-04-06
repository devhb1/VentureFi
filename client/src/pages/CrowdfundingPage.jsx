import React, { useEffect, useState, useContext } from 'react';
import CampaignList from '../components/CampaignList'; 
import CreateCampaign from '../components/CreateCampaign'; 
import { WalletContext } from '../context/WalletContext';
import { ethers } from 'ethers';
import CampaignABI from '../contracts/Campaign.json'; 

const CrowdfundingPage = () => {
    const { account } = useContext(WalletContext);
    const [campaigns, setCampaigns] = useState([]);
    const [contract, setContract] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadBlockchainData = async () => {
            if (window.ethereum && account) {
                try {
                    const provider = new ethers.BrowserProvider(window.ethereum);
                    const signer = await provider.getSigner();
                    const address = "0xFd493482B7114ff8503160A37d6171947680a81d";
                    const campaignContract = new ethers.Contract(address, CampaignABI.abi, signer);
                    setContract(campaignContract);
                    await fetchCampaigns(campaignContract);
                } catch (error) {
                    console.error("Error loading blockchain data:", error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        loadBlockchainData();
    }, [account]);

    const fetchCampaigns = async (campaignContract) => {
        try {
            const totalCampaigns = await campaignContract.campaignCount();
            const loadedCampaigns = [];
            for (let i = 1; i <= totalCampaigns; i++) {
                const campaignData = await campaignContract.campaigns(i);
                loadedCampaigns.push({
                    id: i,
                    title: campaignData.title,
                    fundraiser: campaignData.fundraiser,
                    goal: campaignData.goal.toString(),
                    raisedAmount: campaignData.raisedAmount.toString(),
                    deadline: parseInt(campaignData.deadline),
                    story: campaignData.story,
                    isActive: campaignData.isActive,
                });
            }
            setCampaigns(loadedCampaigns);
        } catch (error) {
            console.error("Error fetching campaigns:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Active and Ended Campaigns */}
            <CampaignList campaigns={campaigns} contract={contract} account={account} />
        </div>
    );
};

export default CrowdfundingPage;