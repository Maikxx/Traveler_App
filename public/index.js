const handleMenuClick = (() => {
    const menuToggle = document.getElementById('menu-toggle')
    const navigation = document.getElementById('tl-Navigation')

    if (menuToggle && navigation) {
        menuToggle.addEventListener('click', function () {
            navigation.classList.toggle('nav-toggled')
        })
    }
})()