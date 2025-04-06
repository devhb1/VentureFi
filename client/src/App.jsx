import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CrowdfundingPage from './pages/CrowdfundingPage';
import CreateCampaign from './components/CreateCampaign';
import { WalletProvider } from './context/WalletContext';

const App = () => {
    return (
         // Provide wallet context to the entire app
        <WalletProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/campaigns" element={<CrowdfundingPage />} />
                    <Route path="/create-campaign" element={<CreateCampaign />} />
                </Routes>
            </Router>
        </WalletProvider>
    );
};

export default App;