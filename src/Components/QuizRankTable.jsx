import { useEffect, useState } from "react";
import AuthService from "../services/authService";



const QuizRankTable = ({ data }) => {

    const [quiz, setQuiz] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const token = localStorage.getItem('token')
    useEffect(() => {
        const getData = async () => {
            try {

                const quizData = await AuthService.quizRankListAPI(1, 10, token);
                setQuiz(quizData?.users);
            } catch (error) {
                console.log("error quizlist");

            }
            finally {
                setLoading(false);
            }
        }

        getData();
    }, [])

    return (
        <>
            {isLoading ? (<>Loading.......</>)
                :
                (
                    <div className="bg-[#E6E5E1] text-xs flex items-center justify-center">
                        <div className="w-full">
                            <div className="overflow-x-auto">
                                <table className="table-auto w-full bg-white border-collapse">
                                    <thead className="bg-gray-300 text-black">
                                        <tr>
                                            <th className="px-4 py-2 border">Rank</th>
                                            <th className="px-4 py-2 border">Country</th>
                                            <th className="px-4 py-2 border">Name</th>
                                            <th className="px-4 py-2 border">Total Score</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {quiz?.map((user, index) => (
                                            <tr
                                                key={user.id}
                                                className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"} hover:bg-indigo-50 transition-colors`}
                                            >
                                                <td className="px-4 py-2 border text-center">{index + 1}</td>
                                                <td className="px-4 py-2 border text-center">Ind</td>
                                                <td className="px-4 py-2 border text-center">{`${user.firstname} ${user.lastname}`}</td>
                                                <td className="px-4 py-2 border text-center">{user.totalScore}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                           
                        </div>
                    </div>
                )
            }
        </>

    );
};

export default QuizRankTable;