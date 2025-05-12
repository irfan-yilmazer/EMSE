// code.js

let SEED = "111";
Nof1.SET_SEED(SEED);

const SNIPPETS = [
    `
const data = [1, 2, 3];
function something(a) {
  return a[0] + a[1] + a[2];
}
console.log(something(data));`,

    `const vals = [5, 3];
function something(a) { return a[0] - a[1]; }
console.log(something(vals));`,

    `const words = ["Hello", "World"];
function something(xs) { return xs[0] + " " + xs[1]; }
console.log(something(words));`,

    `const flags = [false, true, false];
function something(f) { return f[0] || f[1] || f[2]; }
console.log(something(flags));`,

    `const nums = [1, 2, 3, 4];
function something(arr) {
  let s = 0;
  for(let i=0; i<arr.length; i++){
    s += arr[i];
  }
  return s;
}
console.log(something(nums));`,

    `// Setup-Code, bitte ignorieren
const alpha = 100;
const data = [2, 4, 6, 8];
/*
  TODO: hier könnte noch mehr stehen
*/
// Jetzt die Mess-Funktion:
function summeVon3(a) {
  const x = a[0];
  const y = a[1];
  const z = a[2];
  // Rückgabe der Summe
  return x + y + z;
}
// Ausgabe
console.log(summeVon3(data.slice(0,3)));`,

    `const foo = "abc";
function noop(x){ return x; }
const values = [10, 7];
// Hier kommt deine Aufgabe:
function calculateDifferenceOfIndex(array) {
  // Erstmal dummy
  const t = noop(array[0]);
  return t - array[1];
}
console.log(calculateDifferenceOfIndex(values));`,

    `// mehrere Hilfsfunktionen
function upper(s){ return s.toUpperCase(); }
function lower(s){ return s.toLowerCase(); }

const letters = ["JS", "Rocks"];
function combineIndexes(arr) {
  return upper(arr[0]) + " & " + lower(arr[1]);
}
console.log(combineIndexes(letters));`,

    `const arrFlags = [true, false, false];
// irrelevant:
let counter = 0;
counter++;
// Mess-Funktion:
function checkIfTrueIndex(a){
  if(a[2] === true) {
    return a[2];
  }
  return a[0] || a[1];
}
console.log(checkIfTrueIndex(arrFlags));`,

    `// Vorbereitungscode
const arrNums = [3, 5];
let debug = false;

// wirklich wichtige Funktion:
function sumWithLoop(a) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    if(debug) console.log("idx", i);
    total += a[i];
  }
  // Rückgabe
  return total;
}

console.log(sumWithLoop(arrNums));`
];

const TEST_ARRAYS = [
    [1,2,3],
    [5,3],
    ["Hello","World"],
    [false,true,false],
    [1,2,3,4],
    [2,4,6],
    [10,7],
    ["JS","Rocks"],
    [true,false,false],
    [3,5]
];

const SOLUTION_FNS = [
    arr => arr[0] + arr[1] + arr[2],
    arr => arr[0] - arr[1],
    arr => arr[0] + " " + arr[1],
    arr => arr[0] || arr[1] || arr[2],
    arr => { let s=0; for(let i=0;i<arr.length;i++) s+=arr[i]; return s; },

    arr => arr[0] + arr[1] + arr[2],
    arr => arr[0] - arr[1],
    arr => arr[0].toUpperCase() + " & " + arr[1].toLowerCase(),
    arr => arr[0] || arr[1] || arr[2],
    arr => { let s=0; for(let i=0;i<arr.length;i++) s+=arr[i]; return s; }
];

let taskIndex = -1;

// ——— Experiment-Konfiguration ———
let experiment_configuration_function = (writer) => ({
    experiment_name: "TestExperiment",
    seed: SEED,

    introduction_pages: writer.stage_string_pages_commands([
        writer.convert_string_to_html_string(
            "Please, just do this experiment only when you have enough time, concentration and motivation.\n\n" +
            "Please open the browser in fullscreen mode (F11)."
        ),
        writer.convert_string_to_html_string(
            "In this experiment you will compute the result of small code snippets by hand.\n\n" +
            "Don't worry, they are not too complex."
        )
    ]),

    pre_run_training_instructions: writer.string_page_command(
        writer.convert_string_to_html_string("You are now in the TRAINING phase.")
    ),

    pre_run_experiment_instructions: writer.string_page_command(
        writer.convert_string_to_html_string("You are now in the EXPERIMENT phase.")
    ),

    finish_pages: [
        writer.string_page_command(
            writer.convert_string_to_html_string(
                "Almost done! Your data will now be downloaded.\n" +
                "Please send the file to the experimenter and then close this window.\n\nThank you!"
            )
        )
    ],

    layout: [{ variable: "Dummy", treatments: ["X"] }],

    training_configuration: {
        fixed_treatments: [["Dummy","X"]],
        can_be_cancelled: false,
        can_be_repeated: false
    },

    repetitions: 10,

    measurement: Nof1.Time_to_finish(Nof1.text_input_experiment),

    task_configuration: (t) => {
        // nächste Aufgabe
        taskIndex = (taskIndex + 1) % SNIPPETS.length;
        const snippet  = SNIPPETS[taskIndex];
        const testArr  = TEST_ARRAYS[taskIndex];
        const expected = SOLUTION_FNS[taskIndex](testArr);

        // Erwartung
        t.expected_answer = String(expected);
        t.accepts_answer_function = (ans) => ans === String(expected);

        // Aufgabe anzeigen
        t.do_print_task = () => {
            writer.clear_stage();
            const esc = snippet
                .replace(/&/g,"&amp;")
                .replace(/</g,"&lt;")
                .replace(/>/g,"&gt;");
            writer.print_html_on_stage(`
        <pre class="sourcecode">${esc}</pre>
        <p>Aufgabe: Berechne <code>${JSON.stringify(testArr)}</code>.</p>
      `);
        };

        // Falsche Eingabe
        t.do_print_error_message = (ans) => {
            writer.clear_error();
            writer.print_html_on_error(`<h1>Invalid answer: ${ans}</h1>`);
        };

        // Richtige Eingabe
        t.do_print_after_task_information = () => {
            writer.clear_error();
            writer.print_string_on_stage(
                writer.convert_string_to_html_string(
                    "Correct! Take a short break if needed.\n\nPress [Enter] to continue."
                )
            );
        };
    }
});

Nof1.BROWSER_EXPERIMENT(experiment_configuration_function);
