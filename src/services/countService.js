import axios from 'axios';
import { apiClientUser } from '../utils/apiHelper'


const fetchCount = async (endpoint) => {
    try {
        const response = await apiClientUser.get(`${endpoint}`);
        return response.data.count;
    } catch (error) {
        console.error(`Error fetching count from ${endpoint}:`, error);
        throw error;
    }
};

const CountService = {
    getUserCount: () => fetchCount('/users/count'),
    getQuizCount: () => fetchCount('/quiz/count'),
    getSubscriptionCount: () => fetchCount('/subscriptions/count'),
    getNewsCount: () => fetchCount('/news/count'),
};

export default CountService;