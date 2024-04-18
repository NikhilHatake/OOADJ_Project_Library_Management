document.addEventListener('DOMContentLoaded', () => {
    // *** Deletion Functionality ***

    const bookList = document.getElementById('book-list');
    bookList.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-button')) {
            const bookId = event.target.closest('.book').dataset.bookId;
            if (confirm(`Are you sure you want to delete book with ID ${bookId}?`)) {
                deleteBookById(bookId)
                    .then(() => {
                        // Success: Remove the book from the displayed list
                        const bookElement = event.target.closest('.book');
                        bookElement.remove();
                    })
                    .catch(error => {
                        console.error('Error deleting book:', error);
                        alert('Error deleting book. See console for details.');
                    });
            }
        }
    });

    function deleteBookById(bookId) {
        return fetch(`/books/${bookId}/delete`, {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
            });
    }


    // *** Code for Handling delete.html (if still using it) ***

    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('bookId');

    // Only execute if on delete.html
    if (bookId) {
        document.getElementById('bookId').textContent = bookId;
        const confirmDeleteButton = document.getElementById('confirm-delete');

        confirmDeleteButton.addEventListener('click', () => {
            if (confirm(`Are you sure you want to delete book with ID ${bookId}?`)) {
                deleteBookById(bookId)
                    .then(() => {
                        // Success! Redirect back to the book management page
                        window.location.href = 'deleteBook.html'; // Or your management page's filename
                    })
                    .catch(error => {
                        console.error('Error deleting book:', error);
                        alert('Error deleting book. See console for details.');
                    });
            }
        });
    }
});