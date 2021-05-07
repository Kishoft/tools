function copyToClipboard(content){
    navigator.clipboard.writeText(content)
    .then(() => console.log("Copiado"))
}

let codeElements = document.getElementsByTagName('code');

for (const codeEl of codeElements) {

    let copyToClipboardBtn = document.createElement('button');
    
    copyToClipboardBtn.textContent = "Copiar";

    copyToClipboardBtn.addEventListener('click', e => {
        e.preventDefault();
    
        let preEls = codeEl.querySelectorAll('pre')
        if(preEls.length > 0){
            preEls.forEach(preEl => {
                copyToClipboard(preEl.textContent)
            })
        }
        else{
            copyToClipboard(codeEl.textContent);
        }

    })
    
    codeEl.after(copyToClipboardBtn)
}