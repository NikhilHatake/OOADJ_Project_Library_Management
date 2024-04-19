document.addEventListener('DOMContentLoaded', () => {
    const borrowButton = document.getElementById('borrow-button');
    const returnButton = document.getElementById('return-button');
    const bookIdInput = document.getElementById('bookId');
    const message = document.getElementById('message');



    borrowButton.addEventListener('click', () => {
        const bookId = bookIdInput.value;
        borrowBook(bookId)
            .then(() => {
                message.textContent = 'Book borrowed successfully!';
            })
            .catch(error => {
                console.error('Error borrowing book:', error);
                message.textContent = 'Error borrowing book. See console for details.';
            });
    });

    returnButton.addEventListener('click', () => {
        const bookId = bookIdInput.value;
        returnBook(bookId)
            .then(() => {
                message.textContent = 'Book returned successfully!';
            })
            .catch(error => {
                console.error('Error returning book:', error);
                message.textContent = 'Error returning book. See console for details.';
            });
    });
    function borrowBook(bookId) {
        return fetch(`/books/${bookId}/borrow`, {
            method: 'POST'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(book => {
                if (book.is_borrowed) {
                    message.textContent = 'Book borrowed successfully!';

                    // Fetch latest book data
                    const searchForm = document.getElementById('searchForm'); // Get search form
                    fetch(searchForm.action, {  // Submit form using 'action' attribute
                        method: searchForm.method  // Use form's 'method' attribute
                    })
                        .then(response => response.json())
                        .then(book => {
                            if (book.is_borrowed) {
                                message.textContent = 'Book borrowed successfully!';

                                // Trigger the search functionality to update book listings
                                searchBooks(); // Assuming you have this function
                            } else {
                                message.textContent = 'Error: Book might already be borrowed.';
                            }
                        })
                        .catch(error => console.error('Error fetching search results:', error));

                } else {
                    message.textContent = 'Error: Book might already be borrowed.';
                }
            });
    }

    function returnBook(bookId) {
        return fetch(`/books/${bookId}/return`, {
            method: 'POST'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
            });
    }

    function fetchAndDisplayBorrowedBooks() {
        fetch('/books/borrowed')
            .then(response => response.json())
            .then(books => {
                const booksContainer = document.getElementById('borrowed-books-container');
                booksContainer.innerHTML = '';

                if (books.length === 0) {
                    booksContainer.innerHTML = '<p>No borrowed books found.</p>';
                } else {
                    let booksList = '<ul>';
                    books.forEach(book => {
                        booksList += `<li>
                                     <strong>${book.title}</strong> by ${book.author} 
                                  </li>`;
                    });
                    booksList += '</ul>';
                    booksContainer.innerHTML = booksList;
                }
            })
            .catch(error => console.error('Error fetching borrowed books:', error));
    }
    fetchAndDisplayBorrowedBooks();

    function fetchAndDisplayBooks() {
        fetch('/books')
            .then(response => response.json())
            .then(books => {
                const bookListContainer = document.getElementById('book-list');
                bookListContainer.innerHTML = ''; // Clear previous list

                books.forEach(book => {
                    const bookItem = document.createElement('div');
                    bookItem.textContent = `${book.title} (ID: ${book.id})`;
                    bookListContainer.appendChild(bookItem);
                });
            })
            .catch(error => console.error('Error fetching books:', error));
    }

    // Call the function to initially display the books
    fetchAndDisplayBooks();

});