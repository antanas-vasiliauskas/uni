$(document).ready(function() {
    async function main(){
        dynamic_modification();
        form_validation();
        var students = await get();
        display(students);
    }

    function display(ids){
        // display students in a table
        var table = $("#students-table");
        table.empty();
        var header = $("<tr>");
        header.append($("<th>", {text: "Vardas"}));
        header.append($("<th>", {text: "Pavardė"}));
        header.append($("<th>", {text: "El. paštas"}));
        header.append($("<th>", {text: "Studento ID"}));
        table.append(header);
        for (var i = 0; i < ids.length; i++) {
            var row = $("<tr>");
            row.append($("<td>", {text: ids[i].name}));
            row.append($("<td>", {text: ids[i].surname}));
            row.append($("<td>", {text: ids[i].email}));
            row.append($("<td>", {text: ids[i].student_id}));
            table.append(row);
        }
    }

    async function get(){
        var ids = JSON.parse(localStorage.getItem("ids")) || [];
        var students = [];
        for (var i = 0; i < ids.length; i++) {
            await fetch("https://jsonblob.com/api/jsonBlob/" + ids[i])
            .then(response => {
                if (!response.ok) {
                    throw new Error("not ok response");
                }
                return response.json();
            })
            .then(data => {
                students.push(data);
            })
            .catch(error => {
                alert("error during get request " + error);
            });
        }
        return students;
    }

    async function post(obj){
        await fetch("https://jsonblob.com/api/jsonBlob", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(obj)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("not ok response");
            }
            var location = response.headers.get("Location");
            var id = location.split("/").pop();
            // store id in local storage as a list
            var ids = JSON.parse(localStorage.getItem("ids")) || [];
            ids.push(id);
            localStorage.setItem("ids", JSON.stringify(ids));
        })
        .catch(error => {
            alert("error during post request " + error);
        });
    }

    function form_validation(){
        $("#student-form").on("submit", async function(event) {
            event.preventDefault();

            var name = $("#name").val().trim();
            var surname = $("#surname").val().trim();
            var email = $("#email").val().trim();
            var student_id = $("#id").val().trim();

            if (name === "") {
                alert("Vardo laukas negali būti tuščias.");
                return;
            }else if(surname === ""){
                alert("Pavardės laukas negali būti tuščias.");
                return;
            }else if(email === ""){
                alert("El. pašto laukas negali būti tuščias.");
                return;
            }else if (student_id === "") {
                alert("Studento ID laukas negali būti tuščias.");
                return;
            }

            if (!/^\d{7}$/.test(student_id)) {
                alert("Studento ID turi būti 7 skaitmenų.");
                return;
            }

            
            await post({name: name, surname: surname, email: email, student_id: student_id});
            var students = await get();
            display(students);
        });
    }

    function dynamic_modification(){
        function fill_select(){
            var paragraphs = $("#paragraphs").find("p");
            var select = $("#paragraph-select");
            for (var i = 1; i <= paragraphs.length; i++) {
                select.append($("<option>", {
                    value: i,
                    text: i
                }));
            }
        }

        //show-hide element
        $("#show-btn").on("click", function(){
            $("#show-btn").parent().find("div").attr("style", "display: block;");
        });
        $("#hide-btn").on("click", function(){
            $("#hide-btn").parent().find("div").attr("style", "display: none;");
        });

        //change element text
        $("#change-text-btn").on("click", function(){
            text = $("#change-text-btn").parent().find("textarea").val();
            $("#change-text-btn").parent().find("p").text(text);
        });

        //change element style
        $("#change-style-btn").on("click", function(){
            style = "background: red; color: yellow; font-size: 2rem;";
            $("#change-style-btn").parent().find("div").attr("style", style);
        });

        //delete paragraphs
        fill_select();
        $("#delete-paragraph-btn").on("click", function(){
            var select = $("#paragraph-select");
            var selected = select.val();
            $("#paragraphs").find("p").eq(selected-1).remove();
            select.empty();
            fill_select();
        });

        //add paragraphs
        $("#add-paragraph-btn").on("click", function(){
            var text = $("#add-paragraph-btn").parent().find("textarea").val();
            $("#paragraphs2").append($("<p>", {
                text: text
            }));
        });
    }

    

    main();
});