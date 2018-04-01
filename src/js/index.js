// Function that handles clicks on the menu icon in the top right of pages where this icon is present.
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
                window.location.hash = 'tl-Navigation'
            ) : window.location.hash = 'tl-Navigation'

            navigation.classList.toggle('nav-toggled')
        })
    }
})()