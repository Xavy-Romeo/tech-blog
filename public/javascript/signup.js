const signupForm = document.querySelector('.signup-form');

// sign up form handler function
async function signupFormHandler(event) {
    // prevent refresh
    event.preventDefault();

    // grab user inputs
    const username = document.querySelector('#username-signup').value.trim();
    const email = document.querySelector('#email-signup').value.trim();
    const password = document.querySelector('#password-signup').value.trim();

    // check if all inputs were entered
    if (username && email && password) {
        // fetch and post new user data to database
        const newUser = await fetch('/api/users', {
            method: 'post',
            body: JSON.stringify({
                username,
                email,
                password
            }),
            headers: {'Content-Type': 'application/json'}
        });
            
        // check the new user status
        if (newUser.ok) {
            // after successful post, redirect to dashboard
            document.location.replace('/dashboard');
        }
        else {
            alert(newUser.statusText);
        }
    }

    // send user error if input is missing
    else {
        // create p element for error message
        const errorPEl = document.createElement('p');
        errorPEl.textContent = 'Error: Do not leave blank values.';
        
        // append error message
        signupForm.appendChild(errorPEl);
    }
};

// submit eventlistener for signup form
signupForm.addEventListener('submit', signupFormHandler);