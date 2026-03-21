import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

function App() {
  // --- 1. LES STATES (À l'intérieur de la fonction !) ---
  const [books, setBooks] = useState([]);
  const [myBooks, setMyBooks] = useState([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [token] = useState(localStorage.getItem('token') || '');

  // --- 2. LES FONCTIONS ---
  const fetchBooks = () => {
    axios.get('http://localhost:5000/books')
      .then(res => setBooks(res.data))
      .catch(err => console.error("Erreur:", err));
  };

  const fetchMyBorrows = useCallback(() => {
    if (!token) return;
    axios.get('http://localhost:5000/my-borrows/1', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setMyBooks(res.data));
  }, [token]);

  useEffect(() => {
    fetchBooks();
    if (token) fetchMyBorrows();
  }, [token, fetchMyBorrows]);

  const addBook = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/books', { title, author }).then(() => {
      setTitle(''); setAuthor(''); fetchBooks();
    });
  };

  // --- 3. LE RENDU (DESIGN DASHBOARD) ---
  return (
    <div className="bg-light min-vh-100 pb-5">
      {/* Navbar comme sur l'image */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 shadow mb-4">
        <div className="container-fluid">
          <span className="navbar-brand fw-bold">Library Management System</span>
          <div className="navbar-nav ms-auto small">
            <span className="nav-link">Dashboard</span>
            <span className="nav-link active border-bottom">Books</span>
            <span className="nav-link">Users</span>
            <button className="btn btn-outline-light btn-sm ms-3">Logout</button>
          </div>
        </div>
      </nav>

      <div className="container">
        <div className="mb-4">
          <h2 className="fw-bold">Welcome, Junior!</h2>
          <p className="text-muted">Manage your library with ease.</p>
        </div>

        {/* Barre de recherche */}
        <div className="input-group mb-5 shadow-sm">
          <input type="text" className="form-control p-2" placeholder="Search for books..." />
          <button className="btn btn-primary px-4 text-white">Search</button>
        </div>

        <div className="row">
          {/* Liste des Livres (Gauche) */}
          <div className="col-md-8">
            <div className="d-flex justify-content-between mb-3">
              <h5 className="fw-bold">Book List</h5>
              <button className="btn btn-primary btn-sm" onClick={() => alert('Utilise le formulaire en bas !')}>+ Add New Book</button>
            </div>
            <div className="row">
              {books.map(book => (
                <div key={book.id} className="col-md-4 mb-4">
                  <div className="card h-100 shadow-sm border-0">
                    <img src={`https://covers.openlibrary.org/b/id/${book.id + 12345}-M.jpg`} className="card-img-top" alt="cover" style={{height:'200px', objectFit:'cover'}} />
                    <div className="card-body">
                      <h6 className="fw-bold mb-1 text-truncate">{book.title}</h6>
                      <p className="small text-muted mb-3">By {book.author}</p>
                      <div className="d-flex gap-1">
                        <button className="btn btn-primary btn-sm flex-grow-1 small">Edit</button>
                        <button className="btn btn-danger btn-sm flex-grow-1 small">Delete</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Réservations (Droite) */}
          <div className="col-md-4">
            <div className="card shadow-sm border-0 p-3 mb-4">
              <h6 className="fw-bold mb-3 border-bottom pb-2">User Reservations</h6>
              {myBooks.map(b => (
                <div key={b.borrow_id} className="d-flex align-items-center mb-3">
                  <div className="bg-primary text-white rounded p-2 me-2 small"><i className="fas fa-bookmark"></i></div>
                  <div className="small">
                    <div className="fw-bold">{b.title}</div>
                    <div className="text-muted" style={{fontSize:'10px'}}>Due: 2026-03-20</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats du bas */}
        <div className="row mt-4">
          <div className="col-md-6 mb-3">
            <div className="card border-0 shadow-sm p-4 d-flex flex-row align-items-center">
              <i className="fas fa-book fa-3x text-primary me-3"></i>
              <div><h6 className="text-muted mb-0">Total Books</h6><h3 className="fw-bold mb-0">{books.length}</h3></div>
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="card border-0 shadow-sm p-4 d-flex flex-row align-items-center">
              <i className="fas fa-users fa-3x text-info me-3"></i>
              <div><h6 className="text-muted mb-0">Active Users</h6><h3 className="fw-bold mb-0">58</h3></div>
            </div>
          </div>
        </div>

        {/* Petit formulaire discret pour ajouter */}
        <div className="mt-5 p-4 bg-white rounded shadow-sm">
           <h6>Ajouter manuellement :</h6>
           <form onSubmit={addBook} className="d-flex gap-2">
              <input className="form-control" placeholder="Titre" value={title} onChange={e => setTitle(e.target.value)} required />
              <input className="form-control" placeholder="Auteur" value={author} onChange={e => setAuthor(e.target.value)} required />
              <button type="submit" className="btn btn-success">Save</button>
           </form>
        </div>
      </div>
    </div>
  );
}

export default App;