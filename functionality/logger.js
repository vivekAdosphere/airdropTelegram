const { createLogger, transports, format } = require("winston");
const package = require("../package.json");

let timeZone = () => {
    return new Date().toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata'
    });
}

//Logger Object
const logger = createLogger({
    transports: [
        new transports.File({
            filename: `${package.name}.log`,
            level: 'info',
            format: format.combine(format.timestamp({ format: timeZone }), format.json())
        }),
        new transports.Console({
            level: 'info',
            format: format.combine(format.timestamp({ format: timeZone }), format.json())
        })
    ]
})

module.exports = logger