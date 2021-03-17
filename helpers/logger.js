const getDate = () => new Date().toISOString().toLocaleLowerCase();

const typeColors = {
    "info": "\x1b[36m",
    "build": "\x1b[33m",
    "error": "\x1b[31m",
}

const logger = (type, message, object) => {
    console.log(`${typeColors[type]}[${type.toUpperCase()}] -- ${getDate()}, ${message} ${object || ""}`);
}

module.exports = logger