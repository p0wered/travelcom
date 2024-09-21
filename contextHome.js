import React, { createContext, useState, useContext } from 'react';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [mainImage, setMainImage] = useState(null);
    const [directions, setDirections] = useState([]);
    const [news, setNews] = useState([]);
    const [faqData, setFaqData] = useState([]);

    return (
        <GlobalContext.Provider value={{
            mainImage, setMainImage,
            directions, setDirections,
            news, setNews,
            faqData, setFaqData
        }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => useContext(GlobalContext);
