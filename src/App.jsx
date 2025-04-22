import React from 'react';
import { useState } from 'react'

function App() {
    //make object of chat {message: message i sent, awnser: awnser from language model}
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState('');

// async function createProduct() {
//     try {
//         const response = await fetch('http://localhost:8000/chat', {
//             method: 'POST',
//             headers: {
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 q: message
//             })
//         })
//         console.log('json: ', JSON.stringify({
//             message
//         }));

//         const data = await response.json();
//         console.log(data.message);
//         setChat([
//             ...chat,
//             data.message
//         ])
      

//     } catch (error) {
//         console.error('Er is een fout opgetreden:', error);
//     }
// }

async function createProduct() {
    try {
        const response = await fetch('http://localhost:8000/chat', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                q: message
            })
        })

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        while (true) {
            const {value, done} = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, {stream: true});
            console.log(chunk);
            setChat([
                ...chat,
                chunk
            ])
        }

        
      

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
    createProduct(message);
};
const conversation = chat.map((entry) => <div>{entry}</div>)

  return (
    <>
    <article>
      {conversation}

    </article>
       <form onSubmit={handleSubmit}>
       <div>
                <label htmlFor="name">Naam:</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={message}
                    onChange={handleInputChange}
                />
            </div>
            <button type="submit">Send</button>
        </form>
    </>
  )
}

export default App
