const SEND_URL = import.meta.env.VITE_URL

export let races = [
    { value: "Asian / South Asian", name: "Asian / South Asian" },
    { value: "Black", name: "Black" },
    { value: "Hispanic", name: "Hispanic" },
    { value: "White", name: "White" },
    { value: "Arab", name: "Arab" },
]

export let religions = [
    { value: "Muslim", name: "Muslim" },
    { value: "Jewish", name: "Jewish" },
    { value: "Hindu", name: "Hindu" },
    { value: "Buddhist", name: "Buddhist" },
    { value: "Atheist", name: "Atheist" },
    // { value: "Christian", name: "Christian" },
]

export let genders = [
    { value: "Male", name: "Male" },
    { value: "Female", name: "Female" },
    { value: "Non-binary", name: "Non-binary" }
]

export let languages = [
    { value: "Amharic", name: "Amharic" },
    { value: "Bangla", name: "Bangla" },
    { value: "Spanish", name: "Spanish" },
    { value: "Hindi", name: "Hindi" },
    { value: "Portuguese", name: "Portuguese" },
    { value: "Chinese", name: "Chinese" },
    { value: "Korean", name: "Korean "},
    { value: "Japanese", name: "Japanese" }
]

export let academics = [
    { value: "English", name: "English" },
    { value: "History", name: "History" },
    { value: "Chemistry", name: "Chemistry" },
    { value: "Physics", name: "Physics" },
    // { value: "Biology", name: "Biology" },
    { value: "Computer Science", name: "Computer Science" }
]


export async function createMentor(firstName, lastName, email, races, religions, gender, languages, academics) {

    const toSend = {
        firstname: firstName,
        lastname: lastName,
        email: email,
        races: races,
        religions: religions,
        gender: gender,
        languages: languages,
        academics: academics
    }; // Make sure the values here match the ORDER and NAME that is expected in the Python class!

    console.log(toSend)

    try {
        const url = SEND_URL + "creatementor/"; 
        const res = await fetch(url, {
            method: "POST",
            headers: {"Content-type": "application/json"},
            body: JSON.stringify(toSend)
        });
        const resData = await res.json();
        const status = resData["status"];
        console.log("Successfully retrieved message: " + status);
        // location.reload(); // Change later, etc.
        return status;
    } catch (error) {
        console.log("Error: " + error);
        return -1;
    }
}

export async function editMentor(firstName, lastName, email, races, religions, gender, languages, academics) {

    // races = races.split(",");
    // religions = religions.split(",");
    // gender = gender.split(",");
    // languages = languages.split(",");
    // academics = academics.split(",");

    const toSend = {
        firstname: firstName,
        lastname: lastName,
        email: email,
        races: races,
        religions: religions,
        gender: gender,
        languages: languages,
        academics: academics
    }; // Make sure the values here match the ORDER and NAME that is expected in the Python class!

    console.log(toSend)

    try {
        const url = SEND_URL + "updatementor/"; 
        const res = await fetch(url, {
            method: "POST",
            headers: {"Content-type": "application/json"},
            body: JSON.stringify(toSend)
        });
        const resData = await res.json();
        const status = resData["status"];
        console.log("Successfully retrieved message: " + status);
        // location.reload(); // Change later, etc.
        return status;
    } catch (error) {
        console.log("Error: " + error);
        return -1;
    }
}

export async function deleteMentor(email) {
    const url = SEND_URL + "deletementor/" + email;
    try {
        const res = await fetch(url);
        if (!res.ok) { console.log("Failed to fetch url"); }
        const resData = await res.json();
        console.log(resData);
        return resData;
    } catch (error) {
        console.log("Failed to delete mentor: " + error);
    }
}