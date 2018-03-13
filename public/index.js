const handleMenuClick = (() => {
    const menuToggle = document.getElementById('menu-toggle')
    const navigation = document.getElementById('tl-Navigation')

    if (menuToggle && navigation) {
        menuToggle.addEventListener('click', function () {
            navigation.classList.toggle('nav-toggled')
        })
    }
})()

const handleToggleSignInClick = (() => {
    const toggleSignIn = document.getElementById('toggle-sign-in-button')
    const navigation = document.getElementById('tl-Navigation')

    if (toggleSignIn && navigation) {
        toggleSignIn.addEventListener('click', function () {

            window.location.hash === '#tl-Navigation' ? (
                window.location.hash = '',
                window.location.hash = 'tl-Navigation'
            ) : window.location.hash = 'tl-Navigation'

            navigation.classList.toggle('nav-toggled')
        })
    }
})()