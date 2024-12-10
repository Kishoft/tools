let result = ""

function getPrevFist(index, message){
    let fists = 1;
    for (let i = index - 1; i >= 0; i--) {
        if (message[i] === "🤜") fists--
        if (message[i] === "🤛") fists++
        if (fists === 0) return i     
    }
}

function getNextFist(index, message){
    let fists = 1;
    for (let i = index + 1; i < message.length; i++) {
        if (message[i] === "🤜") fists++
        if (message[i] === "🤛") fists--
        if (fists === 0) return i     
    }
}


function translate(message) {
    /*
    👉 : moves the memory pointer to the next cell

    👈 : moves the memory pointer to the previous cell

    👆 : increment the memory cell at the current position

    👇 : decreases the memory cell at the current position.

    🤜 : if the memory cell at the current position is 0, jump just after the corresponding 🤛

    🤛 : if the memory cell at the current position is not 0, jump just after the corresponding 🤜

    👊 : Display the current character represented by the ASCII code defined by the current position.
    */

    let encodedMessage = Array.from(message)
    let memory = [0];
    let pointer = 0;
    let index = 0;

    while(index < encodedMessage.length){
        switch (encodedMessage[index]) {
            case "👉":
                pointer++
                if(memory[pointer] === undefined) {
                    memory[pointer] = 0
                }
                break;
            case "👈":
                pointer--
                if(memory[pointer] === undefined) {
                    memory[pointer] = 0
                }
                break;
            case "👆":
                memory[pointer]++
                if(memory[pointer] > 255) {
                    memory[pointer] = 0
                }
                break;
            case "👇":
                memory[pointer]--
                if(memory[pointer] < 0) {
                    memory[pointer] = 255
                }
                break;
            case "🤜":
                if (memory[pointer] === 0) {
                   index = getNextFist(index, encodedMessage)
                }
                break;
            case "🤛":
                if (memory[pointer] !== 0) {
                    index = getPrevFist(index, encodedMessage)
                }
                break;
            case "👊":
                result += String.fromCharCode(memory[pointer])
                break;
            default:
                break;
        }

        index++
    }
    console.log(result)
}


translate("👉👆👆👆👆👆👆👆👆🤜👇👈👆👆👆👆👆👆👆👆👆👉🤛👈👊👉👉👆👉👇🤜👆🤛👆👆👉👆👆👉👆👆👆🤜👉🤜👇👉👆👆👆👈👈👆👆👆👉🤛👈👈🤛👉👇👇👇👇👇👊👉👇👉👆👆👆👊👊👆👆👆👊👉👇👊👈👈👆🤜👉🤜👆👉👆🤛👉👉🤛👈👇👇👇👇👇👇👇👇👇👇👇👇👇👇👊👉👉👊👆👆👆👊👇👇👇👇👇👇👊👇👇👇👇👇👇👇👇👊👉👆👊👉👆👊")