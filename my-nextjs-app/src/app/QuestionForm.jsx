
"use client";

import { useState } from 'react';
import axios from 'axios';

export default function QuestionForm() {
    const [question, setQuestion] = useState('');
    const [conversation, setConversation] = useState([]); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newQuestion = {
            type: 'question',
            text: question,
        };
        // Update conversation with the new question
        setConversation([...conversation, newQuestion]);

        try {
            const response = await axios.post('http://127.0.0.1:5000/query', { question });
            console.log(response);

            const newAnswer = {
                type: 'answer',
                text: response.data.result,
            };
        
            setConversation((prevConversation) => [...prevConversation, newAnswer]);
        } catch (error) {
            console.error('Error fetching answer:', error);
            const errorResponse = {
                type: 'answer',
                text: 'Failed to fetch answer.',
            };
           
            setConversation((prevConversation) => [...prevConversation, errorResponse]);
        }
    
        setQuestion('');
    };

    return (
        <div className="chat-container">
            <form  onSubmit={handleSubmit}>
                <label htmlFor="question">Question:</label><br />
                <input
                    type="text"
                    id="question"
                    name="question"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    required
                />
                <button type="submit">Submit</button>
            </form>
            <div className="conversation">
                {conversation.map((msg, index) => (
                    <div key={index} className={msg.type}>
                        <strong>{msg.type === 'question' ? 'You: ' : 'Margaret : '}</strong>
                        {msg.text}
                    </div>
                ))}
            </div>
        </div>
    );
}
