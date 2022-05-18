const axios = require("axios").default;
const { parse } = require("node-html-parser");
const { notAvailable, available } = require("./list.json");

const baseURL = "https://www.jordandrivingschoolcharlotte.com";

const virtualClasses = 5;
const classes = ["/public_schools/after_school/ardrey_kell.html"];

for (let i = 1; i < virtualClasses + 1; i++) {
    classes.push(`/public_schools/summer/virtual_class${i}_summer.html`)
}

const checkIncludes = (string, args) => {
    for (const arg of args) {
        if (string.includes(arg)) return true;
    }
    return false;
}

module.exports = async function ping() {
    for (const clazz of classes) {
        const { data } = await axios.get(`${baseURL}${clazz}`);
        const document = parse(data);

        for (const para of document.querySelectorAll("p")) {
            //brute forcing im too lazy ok
            const check = checkIncludes(para.textContent, notAvailable);
            if (check) {
                return false;
            }
        }

        for (const alink of document.querySelectorAll("a")) {
            const check = checkIncludes(alink.textContent, available);
            if (check) {
                if (clazz.includes("ardrey")) {
                    console.log(data)
                    return "Ardrey Kell Registration Open!";
                }

                const number = clazz.match(/\d+/g);
                return `Virtual Class ${number} Registration Open!`;
            }
        }

        return false;
    }
}