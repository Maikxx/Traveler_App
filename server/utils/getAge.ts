// Function for getting the age, based on someones birthday.
// As found (in non TS and ES6+) on StackOverflow by
// Naveen at https://stackoverflow.com/questions/4060004/calculate-age-given-the-birth-date-in-the-format-yyyymmdd

function getAge (birthdate: string) {
    if (birthdate && birthdate.length) {
        const today = new Date()
        const birthDate = new Date(birthdate)
        let age = today.getFullYear() - birthDate.getFullYear()
        const month = today.getMonth() - birthDate.getMonth()

        if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
            age--
        }

        return age
    }
}

export default getAge
