// Function that handles clicks on the menu icon in the top right of pages where this icon is present.\
// Handles progressive enhancement on the navigation menu.
const handleMenuClick = (() => {
    const menuToggle = document.getElementById('menu-toggle')
    const navigation = document.getElementById('tl-Navigation')

    if (menuToggle && navigation) {
        navigation.classList.add('js-active')
        menuToggle.addEventListener('click', function () {
            navigation.classList.toggle('nav-toggled')
        })
    }
})()

// Function that handles clicking the textbutton below the sign up form, to open the sign in window.
const handleToggleSignInClick = (() => {
    const toggleSignIn = document.getElementById('toggle-sign-in-button')
    const navigation = document.getElementById('tl-Navigation')

    if (toggleSignIn && navigation) {
        toggleSignIn.addEventListener('click', (e) => {
            e.preventDefault()

            window.location.hash === '#tl-Navigation' ? (
                window.location.hash = '',
                window.location.hash = '#tl-Navigation'
            ) : window.location.hash = '#tl-Navigation'

            navigation.classList.toggle('nav-toggled')
        })
    }
})()

/*
Function that handles progressive enhancement for the sign up form.
Password regex as seen on https://stackoverflow.com/a/19605207 from Anubhava.
*/
const waitForPasswordToComplete = (() => {
    const passwordField = document.getElementById('sign-up-password')
    const repeatPasswordField = document.getElementById('sign-up-repeat-password-field')

    if (passwordField && repeatPasswordField) {
        repeatPasswordField.classList.add('hide-field')

        passwordField.addEventListener('input', (e) => {
            if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,}$/.test(e.target.value)) {
                repeatPasswordField.classList.remove('hide-field')
            } else {
                repeatPasswordField.classList.add('hide-field')
            }
        })
    }
})()

// Function that transforms some error messages and does some stuff with it, that is relevant to the user.
const checkErrorMessages = (() => {
    const errorBanner = document.querySelector('.tl-ErrorBanner')

    if (errorBanner && errorBanner.textContent) {
        const message = errorBanner.textContent

        if (message === 'Authentication failed! Please make sure that you have filled all fields in correctly.') {
            const navigation = document.getElementById('tl-Navigation')
            const loginFieldset = navigation.querySelector('fieldset')

            if (loginFieldset) {
                navigation.classList.add('js-active')
                navigation.classList.toggle('nav-toggled')
                loginFieldset.classList.add('auth-error')
            }
        } else if (message === 'You can not sign up a new user with an existing e-mail address.') {
            const signUpForm = document.getElementById('sign-up-form')

            if (signUpForm) {
                signUpForm.classList.add('sign-up-error')
                window.location.hash = '#sign-up-form'
            }
        }
    }
})()