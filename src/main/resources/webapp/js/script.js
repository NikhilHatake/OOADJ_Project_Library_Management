// document.getElementById("login-form").addEventListener("submit", function(event) {
//     event.preventDefault();
//     var username = document.getElementById("username").value;
//     var password = document.getElementById("password").value;
//
//     fetch("/authenticate", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ username: username, password: password })
//     })
//         .then(response => response.json())
//         .then(data => {
//             if (data.success) {
//                 document.getElementById("response").innerHTML = "Login successful!";
//                 // Redirect to dashboard or perform other actions
//             } else {
//                 document.getElementById("response").innerHTML = "Login failed. Please try again.";
//             }
//         })
//         .catch(error => console.error("Error:", error));
// });
// document.addEventListener('DOMContentLoaded', () => {
//     const searchForm = document.getElementById('searchForm');
//     const searchInput = document.getElementById('searchInput');
//     const searchBySelect = document.getElementById('searchBy');
//     const booksList = document.getElementById('booksList');
//
//     searchForm.addEventListener('submit', (event) => {
//         event.preventDefault();
//         const searchTerm = searchInput.value;
//         const searchBy = searchBySelect.value;
//
//         // Build the URL based on the search criteria
//         let url = '/books';
//         if (searchTerm) {
//             url += `?${searchBy}=${searchTerm}`;
//         }
//
//         fetch(url)
//             .then(response => response.json())
//             .then(books => {
//                 // Clear previous results
//                 booksList.innerHTML = '';
//
//                 books.forEach(book => {
//                     const bookDiv = document.createElement('div');
//                     bookDiv.className = 'book';
//                     bookDiv.innerHTML = `
//                         <h3>${book.title}</h3>
//                         <p>Author: ${book   .author}</p>
//                         <p>ISBN: ${book.isbn}</p>
//                     `;
//                     booksList.appendChild(bookDiv);
//                 });
//             })
//             .catch(error => console.error('Error:', error));
//     });
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
        console.log("Search By:", searchBy);
        console.log("Search Term:", searchTerm);
        fetch(url)
            .then(response => response.json())
            .then(books => {
                console.log("Books received from server:", books);
                booksList.innerHTML = '';

                // Filter books based on search term
                const filteredBooks = books.filter(book => {
                    const searchField = searchBySelect.value.toLowerCase();
                    const searchValue = searchInput.value.toLowerCase().trim(); // Normalize and trim

                    return book[searchField].toLowerCase().includes(searchValue);
                });
                // Display only the filtered books
                booksList.innerHTML = ''; // Clear previous results

                filteredBooks.forEach(book => {
                    const bookDiv = document.createElement('div');
                    bookDiv.className = 'book';
                    bookDiv.innerHTML = `
                        <h3>${book.title}</h3>
                        <p>Author: ${book.author}</p> 
                        <p>ISBN: ${book.isbn}</p>
                    `;
                    booksList.appendChild(bookDiv);
                });
            })
            .catch(error => console.error('Error:', error));
    });
});