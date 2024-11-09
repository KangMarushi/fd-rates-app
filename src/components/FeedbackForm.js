import React, { useState } from 'react';
import { supabase } from '../supabaseclient.js';

function FeedbackForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('Submitting...');

        const { error } = await supabase
            .from('feedback')
            .insert([{ name, email, message }]);

        if (error) {
            console.error('Error submitting feedback:', error);
            setStatus('Failed to submit. Please try again.');
        } else {
            setStatus('Thank you for your feedback!');
            setName('');
            setEmail('');
            setMessage('');
        }
    };

    return (
        <div className="feedback-form">
            <h3>Submit Your Feedback / Request</h3>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder=" Your Name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                />
                <input 
                    type="email" 
                    placeholder=" Your Email, will inform once your feedback implemented" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                />
                <textarea 
                    placeholder=" Your Feedback or Request" 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)} 
                    maxLength={1000} 
                    required
                ></textarea>
                <div>{message.length}/1000 characters</div>
                <button type="submit">Submit</button>
            </form>
            {status && <p>{status}</p>}
        </div>
    );
}

export default FeedbackForm;
