// let borrowedBookIds = [];
//
// document.addEventListener('DOMContentLoaded', () => {
//     const searchForm = document.getElementById('searchForm');
//     const searchInput = document.getElementById('searchInput');
//     const searchBySelect = document.getElementById('searchBy');
//     const booksList = document.getElementById('booksList');
//
//     // Function to refetch and re-render the book list
//     function refreshBookList() {
//         const searchTerm = searchInput.value;
//         const searchBy = searchBySelect.value;
//         let url = '/books';
//         if (searchTerm) {
//             url += `?${searchBy}=${searchTerm}`;
//         }
//
//         fetch(url)
//             .then(response => response.json())
//             .then(books => {
//                 console.log("Books received from server:", books);
//                 booksList.innerHTML = ''; // Clear previous results
//
//                 const filteredBooks = books.filter(book => {
//                     const searchField = searchBySelect.value.toLowerCase();
//                     const searchValue = searchInput.value.toLowerCase().trim();
//                     return book[searchField].toLowerCase().includes(searchValue);
//                 });
//
//                 filteredBooks.forEach(book => {
//                     const bookDiv = document.createElement('div');
//                     bookDiv.className = 'book';
//                     bookDiv.innerHTML = `
//                         ${book.title}
//                         Author: ${book.author}
//                         ISBN: ${book.isbn}
//
//                             ${book.is_borrowed !== undefined ? (book.is_borrowed ? 'Not Available' : 'Available') : 'Unknown Availability'}
//
//                     `;
//
//                     // Only create delete button if book is not borrowed
//                     if (!borrowedBookIds.includes(book.id)) {
//                         const deleteButton = document.createElement('button');
//                         deleteButton.textContent = 'Delete';
//                         deleteButton.className = 'delete-button';
//                         deleteButton.dataset.bookId = book.id;
//                         bookDiv.appendChild(deleteButton);
//                     }
//
//                     booksList.appendChild(bookDiv);
//                 });
//             })
//             .catch(error => console.error('Error:', error));
//     }
//
//     searchForm.addEventListener('submit', (event) => {
//         event.preventDefault();
//         refreshBookList(); // Call refreshBookList on search
//     });
//
//     document.addEventListener('click', (event) => {
//         if (event.target.classList.contains('delete-button')) {
//             const bookId = event.target.dataset.bookId;
//             console.log('Delete button clicked:', bookId);
//             if (confirm(`Are you sure you want to delete book #${bookId}?`)) {
//                 deleteBook(bookId)
//                     .then(() => {
//                         event.target.parentNode.remove();
//                         // Remove from borrowedBookIds if it exists (in case of errors)
//                         borrowedBookIds = borrowedBookIds.filter(id => id !== bookId);
//                     })
//                     .catch(error => console.error('Error deleting book:', error));
//             }
//         }
//     });
//
//     function deleteBook(bookId) {
//         console.log("Entering deleteBook function, ID:", bookId);
//         return fetch(`/books/${bookId}`, {
//             method: 'DELETE'
//         })
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error('Network response was not ok');
//                 }
//             });
//     }
//
//     // Initial fetch and display of books
//     refreshBookList();
// });
document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const searchBySelect = document.getElementById('searchBy');
    const booksList = document.getElementById('booksList');

    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const searchTerm = searchInput.value;
        const searchBy = searchBySelect.value;
        let url = '/books';
        if (searchTerm) {
            url += `?${searchBy}=${searchTerm}`;
        }

        fetch(url)
            .then(response => response.json())
            .then(books => {
                console.log("Books received from server:", books);
                booksList.innerHTML = ''; // Clear previous results

                const filteredBooks = books.filter(book => {
                    const searchField = searchBySelect.value.toLowerCase();
                    const searchValue = searchInput.value.toLowerCase().trim();
                    return book[searchField].toLowerCase().includes(searchValue);
                });

                filteredBooks.forEach(book => {
                    const bookDiv = document.createElement('div');
                    bookDiv.className = 'book';
                    bookDiv.innerHTML = `
                        <h3>${book.title}</h3>
                        <p>Author: ${book.author}</p>
                        <p>ISBN: ${book.isbn}</p>
                        <p class="availability">
                            ${book.is_borrowed !== undefined ? (book.is_borrowed ? 'Not Available' : 'Available') : 'Unknown Availability'}
                        </p>
                    `;

                    // Create and append delete button after book data is available
                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';
                    deleteButton.className = 'delete-button';
                    deleteButton.dataset.bookId = book.id; // Now book.id should be defined
                    bookDiv.appendChild(deleteButton);

                    booksList.appendChild(bookDiv);
                });
            })
            .catch(error => console.error('Error:', error));
    });

    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-button')) {
            const bookId = event.target.dataset.bookId; // This line retrieves the bookId

            // Log to verify click detection and bookId
            console.log('Delete button clicked:', bookId);

            if (confirm(`Are you sure you want to delete book #${bookId}?`)) {
                deleteBook(bookId)
                    .then(() => {
                        event.target.parentNode.remove();
                    })
                    .catch(error => console.error('Error deleting book:', error));
            }
        }
    });
    function deleteBook(bookId) {
        // Log to verify this function is reached
        console.log("Entering deleteBook function, ID:", bookId);

        return fetch(`/books/${bookId}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
            });
    }

});