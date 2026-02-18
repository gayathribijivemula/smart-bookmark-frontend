import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Use your Railway backend public URL here
const API = 'https://smart-bookmark-backend-production.up.railway.app/bookmarks';

function BookmarkApp() {
  const [bookmarks, setBookmarks] = useState([]);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      const res = await axios.get(API);
      setBookmarks(res.data);
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
    }
  };

  const handleAddOrUpdate = async () => {
    if (!title || !url) return alert("Enter title and URL");
    try {
      if (editId) {
        await axios.put(`${API}/${editId}`, { title, url });
        setEditId(null);
      } else {
        await axios.post(API, { title, url });
      }
      setTitle('');
      setUrl('');
      fetchBookmarks();
    } catch (error) {
      console.error("Error adding/updating bookmark:", error);
    }
  };

  const handleEdit = (bookmark) => {
    setTitle(bookmark.title);
    setUrl(bookmark.url);
    setEditId(bookmark.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      fetchBookmarks();
    } catch (error) {
      console.error("Error deleting bookmark:", error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Smart Bookmark Manager</h1>
      <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
      <input placeholder="URL" value={url} onChange={e => setUrl(e.target.value)} />
      <button onClick={handleAddOrUpdate}>{editId ? 'Update' : 'Add'}</button>

      <ul>
        {bookmarks.map(b => (
          <li key={b.id}>
            <a href={b.url} target="_blank" rel="noopener noreferrer">{b.title}</a>
            <button onClick={() => handleEdit(b)}>Edit</button>
            <button onClick={() => handleDelete(b.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BookmarkApp;
