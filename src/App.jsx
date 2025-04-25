import React from 'react';
import { useState } from 'react'

function App() {
    //make object of chat {message: message i sent, awnser: awnser from language model}
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState('');

async function createProduct() {
    try {
        

        const response = await fetch('http://localhost:8000/chat', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                q: message,
                history: chat
            })
        })

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');

        setChat(prev => [...prev, {human: message, ai: ""}]); // Add initial empty message

        let aiResponse = "";

        while (true) {
            const {value, done} = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, {stream: true});
            // console.log(chunk);

            setChat(prev => {
                const updated = [...prev];
                updated[updated.length - 1]["ai"] += chunk;
                console.log(updated[updated.length - 1]["ai"]);
                
                return updated;
            });

            aiResponse += chunk
            console.log("aiResponse so far:", aiResponse);
        }

        setChat(prev => {
            const updated = [...prev];
            updated[updated.length - 1]["ai"] = aiResponse;            
            return updated;
        });

        
      

    } catch (error) {
        console.error('Er is een fout opgetreden:', error);
    }
}

// Generieke handler voor het bijwerken van de state
const handleInputChange = (event) => {
    const {name, value} = event.target;
    setMessage(value);
};

const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Formulier verzonden:', message);
    createProduct();
};
let i = 0
const conversation = chat.map((entry, id) => <div className='mt-2 mb-2' key={id}>{entry.ai}</div>)

  return (
    <> 
    <article className='ml-5 mt-5 p-5 bg-slate-200 rounded w-[50%]'>
      {conversation}

    </article>
    <div className='w-[50%] mt-5 ml-5 p-6 rounded bg-amber-400'>
    <form onSubmit={handleSubmit}  className='flex'>
                <button type="submit" className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>Send</button>
            <div>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={message}
                    onChange={handleInputChange}
                    className='border bg-transparent w-[500px] py-2 px-4'
                />
            </div>
        </form>
    </div>
       
    </>
  )
}

export default App
