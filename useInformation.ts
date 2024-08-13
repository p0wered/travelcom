import { useState, useEffect } from 'react';
import axios from 'axios';

const useInformation = () => {
    const [information, setInformation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInformation = async () => {
            try {
                const response = await axios.get('https://travelcom.online/api/information/get');
                setInformation(response.data);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchInformation();
    }, []);

    return { information, loading, error };
};

export default useInformation;
