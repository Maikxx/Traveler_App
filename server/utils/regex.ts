/*
Password regex as seen on https://stackoverflow.com/a/19605207 from Anubhava.
Email regex as seen on https://www.regextester.com/19.
*/

const validationRegex = {
    // tslint:disable-next-line:ter-max-len
    email: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,}$/,
}

export default validationRegex
