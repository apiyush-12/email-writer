console.log("Email Writer Extension Loaded");

function createAIButton() {
    const button = document.createElement('div');
    button.className='T-I J-J5-Ji aoO v7 T-I-atl L3';
    button.style.marginRight = '8px';
    button.innerHTML = 'Write with AI';
    button.setAttribute('role', 'button');
    button.setAttribute('data-tooltip', 'Generate AI Reply');
    return button;
}

function getEmailContent() {
    const selectors = ['.h7', '.a3s.ail','.gmail_quote', '[role="presentation"]'];
    for(const selector of selectors) {
        const content = document.querySelector(selector);
        if(content) return content.innerText.trim();
    }
}    
function findComposeToolbar() {
    const selectors = ['.aDh', '.btC', '[role="toolbar"]', '.gU.Up'];
    for(const selector of selectors) {
        const toolbar = document.querySelector(selector);
        if(toolbar) return toolbar;
    }
}

function injectButton() {
    const existingButton = document.querySelector('.email-writer-button');
    if(existingButton) existingButton.remove();
    const toolbar = findComposeToolbar();
    if(!toolbar) {
        console.log("Compose toolbar not found, retrying...");
        return;
    }

    console.log("Compose toolbar found, injecting button...");
    const button = createAIButton();
    button.classList.add('email-writer-button');

    button.addEventListener('click', async() => {
        try{
            button.innerText = 'Generating...';
            button.disabled = true;
            const emailContent = getEmailContent();
            const response = await fetch('https://email-writer-wjkc.onrender.com/api/email/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "emailContent": emailContent,
                    "tone": "friendly",
                })
            });
            if(!response.ok) {
                throw new Error('Failed to generate email');
            }

            const generatedReply = await response.text();
            const composeBox=document.querySelector('[role="textbox"][g_editable="true"]');
            if(composeBox) {
                composeBox.focus();
                document.execCommand('insertText', false, generatedReply);
            } else {
                console.error("Compose box was not found");
            }    
        }catch(error){
            console.error(error);
            alert('Error generating AI reply');
        }finally{
            button.innerHTML = 'Write with AI';
            button.disabled = false;
        }
    });

    const sendButton = toolbar.querySelector('.T-I.J-J5-Ji.aoO.v7.T-I-atl');

    if (sendButton) {
        sendButton.insertAdjacentElement('beforebegin', button);
    } else {
        toolbar.appendChild(button);
    }   
}

const observer = new MutationObserver((mutations) => {
    for(const mutation of mutations) {
        const addedNodes = Array.from(mutation.addedNodes);
        const hasComposeElements=addedNodes.some(node =>
            node.nodeType === Node.ELEMENT_NODE &&
            (node.matches('.aDh, .btC, [role="dialog"]') || node.querySelector('.aDh, .btC, [role="dialog"]'))
        );

        if(hasComposeElements) {
            console.log("Compose window detected, injecting email writer...");
            setTimeout(injectButton, 500);
        }
    }
});

observer.observe(document.body, { 
    childList: true, 
    subtree: true 
});
