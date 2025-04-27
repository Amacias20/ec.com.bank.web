import axios from "axios"

export const AssistantService = async (question: string) => {
    const response = await axios.post('http://localhost:5000/ask', {
        question: question
    })
    return response.data
}