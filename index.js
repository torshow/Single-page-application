

const form = document.getElementById('search-form')

form.addEventListener('submit', function(event){
    event.preventDefault()

    const word = document.getElementById('word-input').value.trim();
    if(word){
        lookUpWord(word)
    }
})



async function lookUpWord(word){

    const loading = document.getElementById('loading');
    const placeholder = document.getElementById('placeholder-text');
    const resultContent = document.getElementById('result-content');

    loading.style.display = 'block'
    placeholder.style.display = 'none'
    resultContent.innerHTML = ''



    const resultBox = document.getElementById('result-box')
    resultBox.classList.remove('has-result', 'has-error')



    try{
        const response = await fetch(
            `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
        )

        if (!response.ok) {
            throw new Error('Word not found')
        }

        const data = await response.json()


        displayResults(data, word)

    } catch (error) {
        displayError(error.message, word)
    } finally {
    

        document.getElementById('loading').style.display = 'none'
    } 

}

function displayResults(data, word) {
    const resultBox = document.getElementById('result-box');
    const resultContent = document.getElementById('result-content');
 
    const entry = data[0];
    const phonetic = entry.phonetic || '';
 
    let html = `
        <div class="word-title">${entry.word}</div>
        <div class="phonetic mb-3">${phonetic}</div>
    `;
 

    entry.meanings.forEach(function(meaning) {
        html += `<span class="part-of-speech">${meaning.partOfSpeech}</span>`;
 
        meaning.definitions.slice(0, 3).forEach(function(def, index) {
            html += `<p class="definition-text"><strong>${index + 1}.</strong> ${def.definition}</p>`;
 
            if (def.example) {
                html += `<p class="example-text">"${def.example}"</p>`;
            }
        });
 
        if (meaning.synonyms && meaning.synonyms.length > 0) {
            html += `<div class="mb-3"><strong>Synonyms: </strong>`;
            meaning.synonyms.slice(0, 5).forEach(function(syn) {
                html += `<span class="synonym-badge">${syn}</span>`;
            });
            html += `</div>`;
        }
 
        html += '<hr>';
    });
 
    resultContent.innerHTML = html;
 

    resultBox.classList.add('has-result');
}



function displayError(message, word) {
    const resultBox = document.getElementById('result-box');
    const resultContent = document.getElementById('result-content');
 
    resultContent.innerHTML = `
        <div class="text-center">
            <p style="font-size: 2rem;">🤔</p>
            <p class="text-danger fw-bold">Could not find "<em>${word}</em>"</p>
            <p class="text-muted">Check the spelling and try again.</p>
        </div>
    `;
 

    resultBox.classList.add('has-error');
}
