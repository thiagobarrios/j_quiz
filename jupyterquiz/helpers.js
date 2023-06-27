// Make a random ID
function makeid(length) {
    var result = [];
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
    return result.join('');
}

// Choose a random subset of an array. Can also be used to shuffle the array
function getRandomSubarray(arr, size) {
    var shuffled = arr.slice(0), i = arr.length, temp, index;
    while (i--) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(0, size);
}

function printResponses(responsesContainer) {
    var responses=JSON.parse(responsesContainer.dataset.responses);
    var stringResponses='<B>IMPORTANTE!</B>Copie a sequência de respostas preservando a ordem.';
    console.log(responses);
    responses.forEach((response, index) => {
        if (response) {
            console.log(index + ': ' + response);
            stringResponses+= index + ': ' + response +"<BR>";
        }
    });
    responsesContainer.innerHTML=stringResponses;
}
