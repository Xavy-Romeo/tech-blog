const loginForm = document.querySelector('.login-form');

// login form handler function
async function loginFormHandler(event) {
    // prevent refresh
    event.preventDefault();
  
    // grab user inputs
    const email = document.querySelector('#email-login').value.trim();
    const password = document.querySelector('#password-login').value.trim();
  
    // check if all inputs were entered
    if (email && password) {
        const user = await fetch('/api/users/login', {
            method: 'post',
            body: JSON.stringify({
                email,
                password
            }),
            headers: { 'Content-Type': 'application/json' }
        });
    
        if (user.ok) {
            // redirect to dashboard
            document.location.replace('/dashboard');
        } else {
            alert(user.statusText);
        }
    }
};



// submit eventlistener for login form
document.querySelector('.login-form').addEventListener('submit', loginFormHandler);
