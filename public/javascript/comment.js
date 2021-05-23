async function commentFormHandler(event) {
    // prevent refresh
    event.preventDefault();

    // grab comment text
    const content = document.querySelector('textarea[name="comment-body"]').value.trim();
    // grab id
    const post_id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];
    
    // if comment was entered, post comment
    if (content) {
        const response = await fetch('/api/comments', {
            method: 'POST',
            body: JSON.stringify({
                content,
                post_id,
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        // if post was successful
        if (response.ok) {
            // reload page
            document.location.reload();
        } else {
            // alert error if unsuccessful
            alert(response.statusText);
        }
    }
};

// add submit eventlistener to comment form
document.querySelector('.comment-form').addEventListener('submit', commentFormHandler);