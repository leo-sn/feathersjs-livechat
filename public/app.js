const socket = io();

const client = feathers();

client.configure(feathers.socketio(socket));

client.configure(feathers.authentication({
    storage: window.localStorage
}));

const login = async (credentials) => {
    try {
        if(!credentials) {
            await client.reAuthenticate();
        } else {
            await client.authenticate({
                strategy: 'local',
                ...credentials,
            })
        }

        console.log('/signup / login success! go to chat window...')
        showChat();
    } catch (error) {
        showLogin(error);
    }
};

const main = async () => {
    const auth = await login();
    console.log('User is authenticated', auth);
};

// main();


const loginHTML = `
<main class='login container'>
    <div class='row'>
        <div class='col-12 col-6-tablet push-3-tablet text-center heading'>
            <h1 class='font-100'>Log in or signup</h1>
        </div>
    </div>
    <div class='row'>
        <div class='col-12 col-6-tablet push-3-tablet col-4-desktop push-4-desktop'>
            <form class='form'>
                <fieldset>
                    <input class='block' type='email' name='email' placeholder='Email'>
                </fieldset>
                <fieldset>
                    <input class='block' type='password' name='password' placeholder='Password'>
                </fieldset>
                <button type='button' id='login' class='button button-primary block signup'>
                    Log In
                </button>
                <button type='button' id='signup' class='button button-primary block signup'>
                    Sign up & Log in
                </button>
                <a class='button button-primary block' href='/oath/github'>
                    Login with Github
                </a>
            </form>
        </div>
    </div>
</main>
`;

const chatHTML = `
<main class='flex flex-column'>
    <header class'title-bar flex flex-row flex-center'>
        <div class='title-wrapper block center-element'>
            <img class='logo' src='http://feathersjs.com/img/feathers-logo-wide.pgn' alt='Feathers Logo'>
            <span class='title'>Chat</span>
        </div>
    </header>
</main>
`;

const showLogin = (error) => {
    if(document.querySelectorAll('.login').length && error) {
        document.querySelector('.heading').insertAdjacentHTML('beforeend', `<p>There was an error: ${error.message}</p>`);
    } else {
        document.getElementById('app').innerHTML = loginHTML
    }
}

const showChat = () => {
    document.getElementById('app').innerHTML = chatHTML;
}


const getCredentials = () => {
    const user = {
        email: document.querySelector('[name="email"]').value,
        password: document.querySelector('[name="password"]').value,
    };

    return user;
}

const addEventListener = (selector, event, handler) => {
    document.addEventListener(event, async ev => {
        if(ev.target.closest(selector)){
            handler(ev);
        }
    });
};

addEventListener('#signup', 'click', async () => {
    const credentials = getCredentials();
    await client.service('users').create(credentials);

    await login(credentials);
})