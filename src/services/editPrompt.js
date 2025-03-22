import { apiClientUser } from '../utils/apiHelper';


export const getAllPrompt = async() => {
    try {
        const response = await apiClientUser.get('/prompt');
        
        if (response.status === 200) {
            return response.data;
        }else {
            throw new Error(`Unexpected response status: ${response.status}`);
        }
    } catch (error) {
        throw new Error("NOT FOUND....");
        
    }
}

const editQuizPrompt = async (quizId, prompt) => {
    try {
        const response = await apiClientUser.put(`/prompt/2`, { prompt });

        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error(`Unexpected response status: ${response.status}`);
        }
    } catch (error) {
        if (error.response) {
            const { status, data } = error.response;
            
            if (status === 400) {
                console.error(`Bad Request - Invalid input for quiz ${quizId}:`, data);
                toast.error(`Invalid input for quiz : ${data.message}`);
                throw new Error(`400 - Bad Request: ${data.message || 'Invalid input or malformed request.'}`);
            } else if (status === 404) {
                console.error(`Quiz ${quizId} not found:`, data);
                throw new Error(`404 - Not Found: The requested quiz ${quizId} does not exist.`);
            } else if (status === 500) {
                console.error(`Internal Server Error while editing quiz ${quizId}:`, data);
                throw new Error(`500 - Internal Server Error: Something went wrong on the server.`);
            } else {
                console.error(`Unexpected server error for quiz ${quizId}:`, error.response);
                throw new Error(`Server error: ${status} - ${data.message || error.response.statusText}`);
            }
        } else if (error.request) {
            console.error('No response received:', error.request);
            throw new Error('Network error: No response from the server.');
        } else {
            console.error('Error in request setup:', error.message);
            throw new Error(`Request setup error: ${error.message}`);
        }
    }
};

export default editQuizPrompt;
