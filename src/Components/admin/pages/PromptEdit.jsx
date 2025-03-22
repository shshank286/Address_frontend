import React, { useEffect, useState } from "react";
import editQuizPrompt, { getAllPrompt } from "../../../services/editPrompt"; 

const PromptEdit = ({ quizId }) => {
    const [quizPrompt, setQuizPrompt] = useState("");
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState(null); 
    const [success, setSuccess] = useState(false); 




    const getPrompt = async () => {
        try {
            const prompt = await getAllPrompt();
            const promptData = prompt[1].prompt;
            setQuizPrompt(promptData);
        }  catch (err) {
            setError("Failed to get quiz prompt. Please try again later.");
        } finally {
            setLoading(false); 
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); 
        setError(null); 
        setSuccess(false); 

        try {
            // Make the API call
            await editQuizPrompt(quizId, quizPrompt);
            setSuccess(true); 
            setQuizPrompt(""); 
        } catch (err) {
            setError("Failed to update quiz prompt. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getPrompt();
    }, []);



    return (
        <div className="flex justify-center h-[85vh] items-center bg-gray-100">
            <div className="w-full max-w-2xl h-96 p-8 bg-white rounded-lg shadow-lg overflow-hidden">
                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
                    Edit Quiz Prompt
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <textarea
                            className="w-full p-4 rounded-lg border-2 border-gray-300 outline-none"
                            placeholder="Type your quizPrompt..."
                            value={quizPrompt}
                            onChange={(e) => setQuizPrompt(e.target.value)}
                            required
                            rows="6"
                        />
                    </div>

                    <div className="mb-4 text-center">
                        {loading && <p className="text-sm text-blue-500">Submitting...</p>}
                        {error && <p className="text-sm text-red-500">{error}</p>}
                        {success && <p className="text-sm text-green-500">Quiz prompt updated successfully!</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-auto p-2 text-sm text-center shadow-md flex float-end bg-[#D6043C] text-white font-semibold rounded-lg focus:outline-none"
                        disabled={loading} // Disable button while loading
                    >
                        {loading ? "Submitting..." : "Send quizPrompt"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PromptEdit;
