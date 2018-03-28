const validationRegex = {
    email: /^\w+@\w+\..{2,3}(.{2,3})?$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,}$/,
}

export default validationRegex
