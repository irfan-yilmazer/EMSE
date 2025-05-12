// code.js

let SEED = "1";
Nof1.SET_SEED(SEED);

const aufgabenOhneKuerzel = [
    // 1) Summe von 3 Zahlen
    `
const data = [1, 2, 3];
function something(a) {
  return a[0] + a[1] + a[2];
}
console.log(something(data));`,

    // 2) Differenz zweite von erste
    `const vals = [5, 3];
function something(a) { return a[0] - a[1]; }
console.log(something(vals));`,

    // 3) String-Konkatenation
    `const words = ["Hello", "World"];
function something(xs) { return xs[0] + " " + xs[1]; }
console.log(something(words));`,

    // 4) Logisches OR
    `const flags = [false, true, false];
function something(f) { return f[0] || f[1] || f[2]; }
console.log(something(flags));`,

    // 5) Schleifen-Summe
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
console.log(computeSum3(data.slice(0,3)));`,

    // 7) Subtraktion mit Ablenkung
    `const foo = "abc";
function noop(x){ return x; }
const values = [10, 7];
// Hier kommt deine Aufgabe:
function calculateDifferenceOfIndex(array) {
  // Erstmal dummy
  const t = noop(arr[0]);
  return t - arr[1];
}
console.log(calculateDiff(values));`,

    // 8) String join mit Kommentarblock
    `// mehrere Hilfsfunktionen
function upper(s){ return s.toUpperCase(); }
function lower(s){ return s.toLowerCase(); }

const letters = ["JS", "Rocks"];
function combineIndexes(arr) {
  return upper(arr[0]) + " & " + lower(arr[1]);
}
console.log(combine(letters));`,

    // 9) Logik mit Distraktoren und weiteren Bedingungen
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
console.log(checkOr(arrFlags));`,

    // 10) Loop-Summe mit zusätzlichen Variablen
    `// Vorbereitungscode
const arrNums = [5, 5, 5];
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

let number = -1;

const testArrays = [
    [1,2,3],    // für SHORT 1
    [5,3],      // für SHORT 2
    ["Hello","World"], // SHORT 3
    [false,true,false],// SHORT 4
    [1,2,3,4], // SHORT 5
    [2,4,6],   // LONG 6 (slice 0,1,2)
    [10,7],    // LONG 7
    ["JS","Rocks"],// LONG 8
    [true,false,false],// LONG 9
    [5,5,5]    // LONG 10
];

const solutionFns = [
    arr => arr[0] + arr[1] + arr[2],
    arr => arr[0] - arr[1],
    arr => arr[0] + " " + arr[1],
    arr => arr[0] || arr[1] || arr[2],
    arr => { let s=0; for(let i=0;i<arr.length;i++) s+=arr[i]; return s; },

    // long
    arr => arr[0] + arr[1] + arr[2],
    arr => arr[0] - arr[1],
    arr => arr[0].toUpperCase() + " & " + arr[1].toLowerCase(),
    arr => arr[0] || arr[1] || arr[2],
    arr => { let s=0; for(let i=0;i<arr.length;i++) s+=arr[i]; return s; }
];


let experiment_configuration_function = (writer) => ({
    experiment_name: "TestExperiment",
    seed: SEED,

    introduction_pages: writer.stage_string_pages_commands([
        writer.string_page_command(
            writer.convert_string_to_html_string(
                "Bitte nur starten, wenn du genug Zeit und Konzentration hast."
            )
        ),
        writer.string_page_command(
            writer.convert_string_to_html_string(
                "Du rechnest hier per Hand einfache Mathematik- oder Buchstabenaufgaben."
            )
        )
    ]),

    pre_run_training_instructions: writer.string_page_command(
        writer.convert_string_to_html_string("Training startet jetzt.")
    ),

    pre_run_experiment_instructions: writer.string_page_command(
        writer.convert_string_to_html_string("Experiment startet jetzt.")
    ),

    finish_pages: [
        writer.string_page_command(
            writer.convert_string_to_html_string("Fertig! Bitte Datei speichern.")
        )
    ],

    layout: [{ variable: "Dummy", treatments: ["X"] }],
    training_configuration: {
        fixed_treatments: [["Dummy", "X"]],
        can_be_cancelled: false,
        can_be_repeated: false
    },
    repetitions: 10,

    // 2) Nof1 misst automatisch die Reaktionszeit auf "Enter"
    measurement: Nof1.Reaction_time(
        Nof1.keys([
            "0","1","2","3","4","5","6","7","8","9",
            "H","Z","h","z"
        ])
    ),

    task_configuration: (t) => {

        // Zufälligen Task auswählen
        number = (number + 1) % aufgabenOhneKuerzel.length;
        const snippet = aufgabenOhneKuerzel[number];
        const testArr = testArrays[number];
        const expected = solutionFns[number](testArr);


        console.log(snippet.toString());
        console.log(testArr);
        console.log(expected.toString());

        // Nof1 erwartet diese Felder
        t.expected_answer = String(expected);
        t.accepts_answer_function = (ans) =>
            ans === String(expected);

        // Aufgabe rendern
        t.do_print_task = () => {
            const esc = snippet
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");

            writer.clear_stage();
            writer.print_html_on_stage(`
        <pre class="sourcecode">${esc}</pre>
        <p>Aufgabe: Berechne <code>${Array.isArray(testArr) ? "[" + testArr.join(", ") + "]" : testArr}</code>.</p>
        <input class="stage input" maxlength="1" placeholder="Dein Ergebnis" autofocus />
        <p>Enter drücken, wenn fertig.</p>
      `);
        };

        t.do_print_error_message = (ans) => {
            writer.clear_error();
            writer.print_html_on_error(`<h1>Falsch: „${ans}“</h1>`);
        };

        t.do_print_after_task_information = () => {
            writer.clear_error();
            writer.print_html_on_stage(
                writer.convert_string_to_html_string(
                    "Richtig! Drücke Enter für den nächsten Durchgang."
                )
            );
        };
    }
});

Nof1.BROWSER_EXPERIMENT(experiment_configuration_function);