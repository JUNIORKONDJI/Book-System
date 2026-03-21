import React, { useState, useEffect } from 'react';
import axios from 'axios';

function BookList() {
    const [books, setBooks] = useState([]);

    // Charger les livres au démarrage
    useEffect(() => {
        axios.get('http://localhost:5000/books')
            .then(res => setBooks(res.data))
            .catch(err => console.error("Erreur chargement livres", err));
    }, []);

    const handleBorrow = async (bookId) => {
        const token = localStorage.getItem('token');
        if (!token) return alert("Connecte-toi d'abord !");

        try {
            await axios.post('http://localhost:5000/borrow', 
                { user_id: 1, book_id: bookId }, // On simule user_id 1 pour le test
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Livre emprunté !");
        } catch (error) {
            alert(error.response?.data?.error || "Erreur d'emprunt");
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h3>Livres disponibles</h3>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {books.map(book => (
                    <div key={book.id} style={{ border: '1px solid black', padding: '10px', width: '200px' }}>
                        <h4>{book.title}</h4>
                        <p>{book.author}</p>
                        <button onClick={() => handleBorrow(book.id)}>Emprunter</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default BookList;