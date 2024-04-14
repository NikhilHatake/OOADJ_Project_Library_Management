// document.addEventListener('DOMContentLoaded', () => {
//     // Load existing books when the page loads
//     fetchAndDisplayBooks();
// });
//
// function fetchAndDisplayBooks() {
//     fetch('/books')
//         .then(response => response.json())
//         .then(books => {
//             const bookList = document.getElementById('book-list');
//             bookList.innerHTML = ''; // Clear previous content
//
//             books.forEach(book => {
//                 const bookItem = document.createElement('div');
//                 bookItem.classList.add('book'); // Add a class for styling
//                 bookItem.innerHTML = `
//                     <h3>${book.title}</h3>
//                     <p>Author: ${book.author}</p>
//                     <p>ISBN: ${book.isbn}</p>
//                     <button data-book-id="${book.id}" onclick="editBook(this)">Edit</button>
//                     <button data-book-id="${book.id}" onclick="deleteBook(this)">Delete</button>
//                 `;
//                 bookList.appendChild(bookItem);
//             });
//         })
//         .catch(error => console.error('Error fetching books:', error));
// }
// const addBookForm = document.getElementById('add-book');
// addBookForm.addEventListener('submit', (event) => {
//     event.preventDefault();
//
//     const bookData = {
//         title: document.getElementById('title').value,
//         author: document.getElementById('author').value,
//         isbn: document.getElementById('isbn').value
//     };
//     addBook(bookData);
//
// });
// // Placeholders (We'll implement these soon)
// function addBook(bookData) { /* ... */ }
// function updateBook(bookId, updatedData) { /* ... */ }
// function deleteBook(bookId) { /* ... */ }
// ________________
document.addEventListener('DOMContentLoaded', () => {
    // Load existing books when the page loads
    fetchAndDisplayBooks();

    // Search Functionality
    const searchForm = document.getElementById('search-form');
    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const searchBy = document.getElementById('searchBy').value;
        const searchTerm = document.getElementById('searchTerm').value;

        fetch(`/books?searchBy=${encodeURIComponent(searchBy)}&searchTerm=${encodeURIComponent(searchTerm)}`)
            .then(response => response.json())
            .then(books => {
                const bookList = document.getElementById('book-list');
                bookList.innerHTML = '';

                books.forEach(book => {
                    // ... (code to render each book item)
                });
            })
            .catch(error => console.error('Error fetching books:', error));
    });

    // Add Book Functionality
    const addBookForm = document.getElementById('add-book');
    addBookForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const bookData = {
            title: document.getElementById('title').value,
            author: document.getElementById('author').value,
            isbn: document.getElementById('isbn').value
        };

        addBook(bookData);
    });

    // Functions
    function fetchAndDisplayBooks() {
        fetch('/books')
            .then(response => response.json())
            .then(books => {
                const bookList = document.getElementById('book-list');
                bookList.innerHTML = ''; // Clear previous content

                books.forEach(book => {
                    const bookItem = document.createElement('div');
                    bookItem.classList.add('book'); // Add a class for styling
                    bookItem.innerHTML = `
                    <h3>${book.title}</h3>
                    <p>Author: ${book.author}</p>
                    <p>ISBN: ${book.isbn}</p> 
                    <button data-book-id="${book.id}" onclick="editBook(this)">Edit</button>
                    <button data-book-id="${book.id}" onclick="deleteBook(this)">Delete</button>
                `;
                    bookList.appendChild(bookItem);
                });
            })
            .catch(error => console.error('Error fetching books:', error));
    }

    function addBook(bookData) {
        fetch('/books', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                // Assuming your backend returns the new book on success
                return response.json();
            })
            .then(newBook => {
                // Update your UI or call fetchAndDisplayBooks to refresh
                console.log('Book added successfully:', newBook);
            })
            .catch(error => {
                console.error('Error adding book:', error);
                // Display an error message to the user
            });
    }

    // Placeholders for updateBook and deleteBook
    function updateBook(bookId, updatedData) { /* ... */ }
    function deleteBook(bookId) { /* ... */ }
});



