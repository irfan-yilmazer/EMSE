// code.js

let SEED = "1";
Nof1.SET_SEED(SEED);


// 1) Deine Aufgaben, Testdaten und Lösungssfunktionen jetzt außerhalb von `task_configuration`
const aufgabenOhneKuerzel = [
    `const numbersList1 = [1, 2];
function sum(a) {
  return a[0] + a[1];
}
console.log(sum(numbersList1)); // expected 3`,
    `const numbersList2 = [4, 5];
function sum(a) {
  return a[0] + a[1];
}
console.log(sum(numbersList2)); // expected 9`,
    `const numbersList3 = [2, 2];
function product(a) {
  return a[0] * a[1];
}
console.log(product(numbersList3)); // expected 4`,
    `const numbersList4 = [1, 3];
function product(a) {
  return a[0] * a[1];
}
console.log(product(numbersList4)); // expected 3`,
    `const letters = ["H", "A", "I"];
function pickFirst(a) {
  return a[0];
}
console.log(pickFirst(letters)); // expected H`
];

const testArrays = [
    [1, 2],
    [4, 5],
    [2, 2],
    [1, 3],
    ["H", "A", "I"]
];

const solutionFns = [
    arr => arr[0] + arr[1],
    arr => arr[0] + arr[1],
    arr => arr[0] * arr[1],
    arr => arr[0] * arr[1],
    arr => arr[0]
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
    measurement: Nof1.Reaction_time(Nof1.keys(["0","1","2","3","4","5","6","7","8","9"])),

    task_configuration: (t) => {
        // Debug-Ausgabe
        console.log("task obj methods:", Object.keys(t));

        // Zufälligen Task auswählen
        const idx = Nof1.new_random_integer(0, aufgabenOhneKuerzel.length - 1);
        const snippet = aufgabenOhneKuerzel[idx];
        const testArr = testArrays[idx];
        const expected = solutionFns[idx](testArr);

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
