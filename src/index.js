document.addEventListener('DOMContentLoaded', () => { 
    const quoteList = document.querySelector('#quote-list');
    const newQuoteForm = document.querySelector('#new-quote-form');

    function fetchQuotes(){ 
        fetch('http://localhost:3000/quotes?_embed=likes')
            .then(response => response.json())
            .then(quotes => {
                quoteList.innerHTML = '' 
                quotes.forEach(quote => renderQuote(quote)); 
            } );
    }

    function renderQuote(quote){
        const li = document.createElement('li');
        li.classList.add('quote-card');

        li.innerHTML = `
            <blockquote class="blockquote">
                <p class="mb-0">${quote.quote}</p>
                <footer class="blockquote-footer">${quote.author}</footer>
                <br>
                <button class='btn-success' data-id="${quote.id}">Likes: <span>${quote.likes}</span></button>
                <button class='btn-danger' data-id="${quote.id}">Delete</button>
            </blockquote>
        `;

        quoteList.appendChild(li);

        
        const likeButton = li.querySelector('.btn-success');
        const deleteButton = li.querySelector('.btn-danger');

        likeButton.addEventListener('click', () => handleLikeClick(quote.id, likeButton));
        deleteButton.addEventListener('click', () => handleDeleteCLick(quote.id, li));

        function handleDeleteCLick(quoteId, element){
            fetch(`http://localhost:3000/quotes/${quoteId}`,{
                method: 'DELETE'
            })
                .then(response => response.json())
                .then(() => element.remove())
        }

        function handleLikeClick(quoteId, button) {
            fetch('http://localhost:3000/likes', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({quoteId})
            })
                .then(res => res.json())
                .then(() => {
                    const likesSpan = button.querySelector('span');
                    likesSpan.textContent = parseInt(likesSpan.textContent) + 1;

                });

        }
    }

    newQuoteForm.addEventListener('submit', event => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const quote = formData.get('quote');
        const author = formData.get('author');

        fetch('http://localhost:3000/quotes',{ 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            } ,
            body: JSON.stringify({quote, author}),

        })
            .then(response => response.json())
            .then(newQuote => {
                renderQuote({...newQuote, likes:[]});
                event.target.reset()
            })
    })
    

    fetchQuotes();
})