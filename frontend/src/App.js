import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import axios from 'axios';

// --- 0. PAGE LOGIN (Mise à jour avec la barre bleue en haut) ---
const LoginPage = ({ onLogin }) => (
  <div className="bg-light min-vh-100">
    {/* Barre bleue simplifiée pour le Login */}
    <nav className="navbar navbar-dark shadow-sm mb-5" style={{ backgroundColor: '#1a237e' }}>
      <div className="container">
        <span className="navbar-brand fw-bold d-flex align-items-center">
          <i className="fas fa-university me-2"></i> Library Management System
        </span>
      </div>
    </nav>

    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
      <div className="card shadow border-0 p-4 text-center" style={{ width: '400px' }}>
        <div className="mb-3 text-primary"><i className="fas fa-book-reader fa-4x"></i></div>
        <h3 className="fw-bold text-dark mb-1">Login to Your Account</h3>
        <p className="text-muted small mb-4">Welcome, Junior</p>
        <div className="text-start mb-3">
          <label className="form-label small fw-bold text-muted">Email</label>
          <input className="form-control bg-light" defaultValue="junior@test.com" />
        </div>
        <div className="text-start mb-4">
          <label className="form-label small fw-bold text-muted">Password</label>
          <input className="form-control bg-light" type="password" defaultValue="123456" />
        </div>
        <button className="btn btn-primary w-100 fw-bold py-2" onClick={onLogin}>Login</button>
      </div>
    </div>
  </div>
);

// --- 1. COMPOSANT NAVBAR (Pour les pages connectées) ---
const Navbar = ({ onLogout }) => (
  <nav className="navbar navbar-expand-lg navbar-dark shadow-sm" style={{ backgroundColor: '#1a237e' }}>
    <div className="container">
      <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
        <i className="fas fa-university me-2"></i> Library Management System
      </Link>
      <div className="collapse navbar-collapse justify-content-center">
        <ul className="navbar-nav gap-3">
          <li className="nav-item"><Link className="nav-link" to="/">Dashboard</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/books">Books</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/users">Users</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/account">My Account</Link></li>
        </ul>
      </div>
      <button className="btn btn-outline-light btn-sm px-3" onClick={onLogout}>Logout</button>
    </div>
  </nav>
);

// --- 2. PAGE DASHBOARD ---
const Dashboard = ({ bookCount }) => {
  const reservations = [
    { id: 1, title: 'The Catcher in the Rye', date: '2024-05-10' },
    { id: 2, title: 'The Hobbit', date: '2024-05-15' },
    { id: 3, title: 'Pride and Prejudice', date: '2024-05-20' }
  ];

  return (
    <div className="container mt-4">
      <div className="mb-4 text-start">
        <h2 className="fw-bold mb-1 text-dark">Welcome, Junior!</h2>
        <p className="text-muted">Manage your library with ease.</p>
      </div>
      <div className="input-group mb-5 shadow-sm" style={{ maxWidth: '800px' }}>
        <input type="text" className="form-control p-2" placeholder="Search for books..." />
        <button className="btn btn-primary px-4 fw-bold">Search</button>
      </div>
      <div className="row">
        <div className="col-lg-8">
            <div className="row mb-4">
                <div className="col-md-6 mb-3">
                    <div className="card border-0 shadow-sm p-4 d-flex flex-row align-items-center bg-white">
                        <div className="p-3 rounded me-4" style={{ backgroundColor: '#eef2ff' }}>
                            <i className="fas fa-book-open fa-3x text-primary"></i>
                        </div>
                        <div>
                            <h6 className="text-muted mb-1 small">Total Books</h6>
                            <h2 className="fw-bold mb-0">{bookCount || 120}</h2>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 mb-3">
                    <div className="card border-0 shadow-sm p-4 d-flex flex-row align-items-center bg-white">
                        <div className="p-3 rounded me-4" style={{ backgroundColor: '#f0f9ff' }}>
                            <i className="fas fa-user-friends fa-3x text-info"></i>
                        </div>
                        <div>
                            <h6 className="text-muted mb-1 small">Active Users</h6>
                            <h2 className="fw-bold mb-0">58</h2>
                        </div>
                    </div>
                </div>
            </div>
            <BookListSection />
        </div>
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm p-3 bg-white h-100">
            <h6 className="fw-bold border-bottom pb-2 mb-3">User Reservations</h6>
            {reservations.map(res => (
              <div key={res.id} className="d-flex align-items-center mb-3 p-2 border rounded bg-light">
                <div className="bg-primary text-white rounded p-2 me-3"><i className="fas fa-bookmark small"></i></div>
                <div className="small overflow-hidden">
                  <div className="fw-bold text-truncate">{res.title}</div>
                  <div className="text-muted" style={{ fontSize: '10px' }}>Due: {res.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 3. PAGE BOOKS ---
const BookListSection = () => {
  const books = [
    { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', img: 'https://covers.openlibrary.org/b/id/8432047-M.jpg', status: 'manage' },
    { id: 2, title: '1984', author: 'George Orwell', img: 'https://covers.openlibrary.org/b/id/12643534-M.jpg', status: 'manage' },
    { id: 3, title: 'To Kill a Mockingbird', author: 'Harper Lee', img: 'https://covers.openlibrary.org/b/id/8225266-M.jpg', status: 'available' },
    { id: 4, title: 'Harry Potter', author: 'J.K. Rowling', img: 'https://covers.openlibrary.org/b/id/10521270-M.jpg', status: 'unavailable' }
  ];

  return (
    <div className="mt-4">
      <h4 className="fw-bold mb-3">Book List</h4>
      <button className="btn btn-primary fw-bold mb-4 shadow-sm">Add New Book</button>
      <div className="row g-4">
        {books.map((book) => (
          <div key={book.id} className="col-md-3">
            <div className="card h-100 border-0 shadow-sm p-2 text-center">
              <img src={book.img} className="mx-auto rounded" style={{ height: '180px', width: '120px', objectFit: 'cover' }} alt="cover" />
              <div className="card-body p-2 mt-2">
                <h6 className="fw-bold small text-truncate mb-1">{book.title}</h6>
                <p className="text-muted mb-2" style={{fontSize: '10px'}}>By {book.author}</p>
                {book.status === 'manage' ? (
                  <div className="d-flex gap-1">
                    <button className="btn btn-primary btn-sm flex-grow-1 p-1" style={{fontSize: '10px'}}>Edit</button>
                    <button className="btn btn-danger btn-sm flex-grow-1 p-1" style={{fontSize: '10px'}}>Delete</button>
                  </div>
                ) : (
                  <button className={`btn btn-sm w-100 ${book.status === 'available' ? 'btn-success' : 'btn-secondary opacity-50'}`} style={{fontSize: '10px'}}>{book.status.toUpperCase()}</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- 4. PAGE USERS ---
const UsersPage = () => {
  const users = [
    { id: 1, username: 'junior', email: 'user@test.com', role: 'user', avatar: 'https://i.pravatar.cc/30?u=junior' },
    { id: 2, username: 'admin', email: 'admin@test.com', role: 'admin', avatar: 'https://i.pravatar.cc/30?u=admin' }
  ];
  return (
    <div className="container mt-4">
      <h2 className="fw-bold mb-4">Manage Users</h2>
      <div className="card shadow-sm border-0 overflow-hidden">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr><th className="ps-4">ID</th><th>Username</th><th>Email</th><th>Role</th><th className="text-center">Actions</th></tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td className="ps-4 fw-bold text-muted">{u.id}</td>
                <td><img src={u.avatar} className="rounded-circle me-2" width="30" alt="" />{u.username}</td>
                <td className="text-muted small">{u.email}</td>
                <td><span className={`badge ${u.role === 'admin' ? 'bg-warning text-dark' : 'bg-primary'}`}>{u.role}</span></td>
                <td className="text-center">
                  <button className="btn btn-primary btn-sm me-2">Edit</button>
                  <button className="btn btn-danger btn-sm">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- 5. PAGE ACCOUNT ---
const AccountPage = () => (
  <div className="container mt-5">
    <div className="card border-0 shadow-sm p-5 mx-auto" style={{ maxWidth: '800px' }}>
      <div className="row align-items-center">
        <div className="col-md-4 text-center border-end">
          <img src="https://i.pravatar.cc/150?u=junior" className="rounded-circle shadow mb-3" width="150" alt="profile" />
          <h4 className="fw-bold">Junior</h4>
        </div>
        <div className="col-md-8 ps-md-5">
          <h4 className="fw-bold">Junior</h4>
          <p className="text-muted">junior@test.com</p>
          <hr />
          <div className="d-grid gap-2 text-start">
            <button className="btn btn-link text-dark text-decoration-none p-0"><i className="fas fa-key me-2"></i> Change Password</button>
            <button className="btn btn-link text-primary text-decoration-none p-0"><i className="fas fa-edit me-2"></i> Edit Profile</button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// --- FONCTION PRINCIPALE ---
export default function App() {
  const [books, setBooks] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/books')
      .then(res => setBooks(res.data))
      .catch(err => console.error("Erreur Backend:", err));
  }, []);

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  return (
    <Router>
      <div className="bg-light min-vh-100 pb-5">
        {!isLoggedIn ? (
          <Routes>
            <Route path="*" element={<LoginPage onLogin={handleLogin} />} />
          </Routes>
        ) : (
          <>
            <Navbar onLogout={handleLogout} />
            <Routes>
              <Route path="/" element={<Dashboard bookCount={books.length} />} />
              <Route path="/books" element={<BookListSection />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/login" element={<Navigate to="/" />} />
            </Routes>
          </>
        )}
      </div>
    </Router>
  );
}