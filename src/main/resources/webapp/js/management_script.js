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

    const addBookForm = document.getElementById('add-book');
    addBookForm.addEventListener('submit', (event) => {
        event.preventDefault();

        console.log("Form submitted!"); // Log form submission

        // Get input values
        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;
        const isbn = document.getElementById('isbn').value;

        console.log("Title:", title);
        console.log("Author:", author);
        console.log("ISBN:", isbn);

        // Your existing add book logic
        const bookData = {
            title: title,
            author: author,
            isbn: isbn
        };

        addBook(bookData)
            .then(newBook => {
                console.log('Book added successfully:', newBook);
            })
            .catch(error => {
                console.error('Error adding book:', error);
            });
    });
    const bookList = document.getElementById('book-list');
    bookList.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-button')) {
            const bookId = event.target.dataset.bookId;
            deleteBook(bookId)
                .then(() => {
                    // Update UI to remove the deleted book or call fetchAndDisplayBooks
                    console.log('Book deleted successfully');
                })
                .catch(error => {
                    console.error('Error deleting book:', error);
                });
        }
    });
    function fetchAndDisplayBooks() {
        fetch('/books') // Fetch books from your backend
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(books => {
                const bookList = document.getElementById('book-list');
                bookList.innerHTML = ''; // Clear previous content

                // Assuming you have a <script> tag with id="book-template" (see below)
                const bookTemplate = document.getElementById('book-template').innerHTML;

                books.forEach(book => {
                    // Create the book element
                    const bookElement = document.createElement('div');
                    bookElement.classList.add('book');
                    bookElement.dataset.bookId = book.id; // Set the data-book-id attribute

                    // Use innerHTML for the content
                    bookElement.innerHTML = bookTemplate.replace(/{{bookId}}/g, book.id)
                        .replace(/{{title}}/g, book.title)
                        .replace(/{{author}}/g, book.author)
                        .replace(/{{isbn}}/g, book.isbn);

                    bookList.appendChild(bookElement); // Append the element
                });

                // Event listener for delete buttons (placed within fetchAndDisplayBooks)
                bookList.addEventListener('click', (event) => {
                    // ... your existing code for delete button handling
                });
            })
            .catch(error => {
                console.error('Error fetching books:', error);
                // Consider displaying an error message to the user here
            });
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
        document.getElementById('title').value
    }

    // Placeholders for updateBook and deleteBook
    function updateBook(bookId, updatedData) { /* ... */ }
    function deleteBook(bookId) {
        return fetch(`/books/${bookId}`, {
            method: 'DELETE'
        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return Promise.resolve(); // Return an empty resolved promise
        });

    }
    fetchAndDisplayBooks();
});

