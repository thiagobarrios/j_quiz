function check_numeric(ths, event) {

    if (event.keyCode === 13) {
        ths.blur();

        var id = ths.id.split('-')[0];

        var submission = ths.value;
        if (submission.indexOf('/') != -1) {
            var sub_parts = submission.split('/');
            //console.log(sub_parts);
            submission = sub_parts[0] / sub_parts[1];
        }
        //console.log("Reader entered", submission);

        if ("precision" in ths.dataset) {
            var precision = ths.dataset.precision;
            // console.log("1:", submission)
            submission = Math.round((1 * submission + Number.EPSILON) * 10 ** precision) / 10 ** precision;
            // console.log("Rounded to ", submission, " precision=", precision  );
        }


        //console.log("In check_numeric(), id="+id);
        //console.log(event.srcElement.id)           
        //console.log(event.srcElement.dataset.feedback)

        var fb = document.getElementById("fb" + id);
        fb.style.display = "none";
        fb.textContent = "Incorrect -- try again.";

        var answers = JSON.parse(ths.dataset.answers);
        //console.log(answers);

        var defaultFB = "";
        var correct;
        var done = false;
        answers.every(answer => {
            //console.log(answer.type);

            correct = false;
            // if (answer.type=="value"){
            if ('value' in answer) {
                if (submission == answer.value) {
                    if ("feedback" in answer) {
                        fb.textContent = jaxify(answer.feedback);
                    } else {
                        fb.textContent = jaxify("Correct");
                    }
                    correct = answer.correct;
                    //console.log(answer.correct);
                    done = true;
                }
                // } else if (answer.type=="range") {
            } else if ('range' in answer) {
                //console.log(answer.range);
                if ((submission >= answer.range[0]) && (submission < answer.range[1])) {
                    fb.textContent = jaxify(answer.feedback);
                    correct = answer.correct;
                    //console.log(answer.correct);
                    done = true;
                }
            } else if (answer.type == "default") {
                defaultFB = answer.feedback;
            }
            if (done) {
                return false; // Break out of loop if this has been marked correct
            } else {
                return true; // Keep looking for case that includes this as a correct answer
            }
        });

        if ((!done) && (defaultFB != "")) {
            fb.innerHTML = jaxify(defaultFB);
            //console.log("Default feedback", defaultFB);
        }

        fb.style.display = "block";
        if (correct) {
            ths.className = "Input-text";
            ths.classList.add("correctButton");
            fb.className = "Feedback";
            fb.classList.add("correct");
        } else {
            ths.className = "Input-text";
            ths.classList.add("incorrectButton");
            fb.className = "Feedback";
            fb.classList.add("incorrect");
        }

        // What follows is for the saved responses stuff
        var outerContainer = fb.parentElement.parentElement;
        var responsesContainer = document.getElementById("responses" + outerContainer.id);
        if (responsesContainer) {
            console.log(submission);
            var qnum = document.getElementById("quizWrap"+id).dataset.qnum;
            //console.log("Question " + qnum);
            //console.log(id, ", got numcorrect=",fb.dataset.numcorrect);
            var responses=JSON.parse(responsesContainer.dataset.responses);
            console.log(responses);
            if (submission == ths.value){
                responses[qnum]= submission;
            } else {
                responses[qnum]= ths.value + "(" + submission +")";
            }
            responsesContainer.setAttribute('data-responses', JSON.stringify(responses));
            printResponses(responsesContainer);
        }
        // End code to preserve responses

        if (typeof MathJax != 'undefined') {
            var version = MathJax.version;
            console.log('MathJax version', version);
            if (version[0] == "2") {
                MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
            } else if (version[0] == "3") {
                MathJax.typeset([fb]);
            }
        } else {
            console.log('MathJax not detected');
        }
        return false;
    }

}

function isValid(el, charC) {
    //console.log("Input char: ", charC);
    if (charC == 46) {
        if (el.value.indexOf('.') === -1) {
            return true;
        } else if (el.value.indexOf('/') != -1) {
            var parts = el.value.split('/');
            if (parts[1].indexOf('.') === -1) {
                return true;
            }
        }
        else {
            return false;
        }
    } else if (charC == 47) {
        if (el.value.indexOf('/') === -1) {
            if ((el.value != "") && (el.value != ".")) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    } else if (charC == 45) {
        var edex = el.value.indexOf('e');
        if (edex == -1) {
            edex = el.value.indexOf('E');
        }

        if (el.value == "") {
            return true;
        } else if (edex == (el.value.length - 1)) { // If just after e or E
            return true;
        } else {
            return false;
        }
    } else if (charC == 101) { // "e"
        if ((el.value.indexOf('e') === -1) && (el.value.indexOf('E') === -1) && (el.value.indexOf('/') == -1)) {
            // Prev symbol must be digit or decimal point:
            if (el.value.slice(-1).search(/\d/) >= 0) {
                return true;
            } else if (el.value.slice(-1).search(/\./) >= 0) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    } else {
        if (charC > 31 && (charC < 48 || charC > 57))
            return false;
    }
    return true;
}

function numeric_keypress(evnt) {
    var charC = (evnt.which) ? evnt.which : evnt.keyCode;

    if (charC == 13) {
        check_numeric(this, evnt);
    } else {
        return isValid(this, charC);
    }
}





function make_numeric(qa, outerqDiv, qDiv, aDiv, id) {



    //console.log(answer);


    outerqDiv.className = "NumericQn";
    aDiv.style.display = 'block';

    var lab = document.createElement("label");
    lab.className = "InpLabel";
    lab.textContent = "Digite a resposta:";
    aDiv.append(lab);

    var inp = document.createElement("input");
    inp.type = "text";
    //inp.id="input-"+id;
    inp.id = id + "-0";
    inp.className = "Input-text";
    inp.setAttribute('data-answers', JSON.stringify(qa.answers));
    if ("precision" in qa) {
        inp.setAttribute('data-precision', qa.precision);
    }
    aDiv.append(inp);
    //console.log(inp);

    //inp.addEventListener("keypress", check_numeric);
    //inp.addEventListener("keypress", numeric_keypress);
    /*
    inp.addEventListener("keypress", function(event) {
        return numeric_keypress(this, event);
    }
                        );
                        */
    //inp.onkeypress="return numeric_keypress(this, event)";
    inp.onkeypress = numeric_keypress;
    inp.onpaste = event => false;

    inp.addEventListener("focus", function (event) {
        this.value = "";
        return false;
    }
    );


}
