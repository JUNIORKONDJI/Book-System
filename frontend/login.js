import React, { useState } from 'react';
import axios from 'axios';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // On envoie les infos au port 5000 !
            const response = await axios.post('http://localhost:5000/login', { email, password });
            localStorage.setItem('token', response.data.token); // On garde le token précieusement
            alert("Connexion réussie ! Ton site a maintenant la clé.");
        } catch (error) {
            alert("Erreur de connexion : " + (error.response?.data?.error || "Serveur éteint"));
        }
    };

    return (
        <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '15px' }}>
            <h3>Formulaire de Connexion</h3>
            <form onSubmit={handleLogin}>
                <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} /><br/><br/>
                <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} /><br/><br/>
                <button type="submit">Se connecter au Backend</button>
            </form>
        </div>
    );
}

export default Login;