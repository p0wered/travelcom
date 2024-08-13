import React, {createContext, useContext} from 'react';
import useInformation from './useInformation';

const InformationContext = createContext();
export const InformationProvider = ({ children }) => {
    const informationData = useInformation();
    return (
        <InformationContext.Provider value={informationData}>
            {children}
        </InformationContext.Provider>
    );
};

export const useInformationContext = () => useContext(InformationContext);

