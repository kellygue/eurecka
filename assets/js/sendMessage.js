function sendMessage () {
    let form = document.querySelector('#message-form')

    form.addEventListener('submit', e => {
        e.preventDefault()

        let fullname = document.querySelector('input#name-input').value || false,
        mail = document.querySelector('#email-input').value || false,
        message = document.querySelector('#message-input').value || false,
        xhr = new XMLHttpRequest()

        if (fullname && mail && message) {
            xhr.open('GET', `/api/sendMessage.php?fullname=${encodeURIComponent(fullname)}&email=${encodeURIComponent(mail)}&message=${encodeURIComponent(message)}`)
            xhr.responseType = 'text'
            xhr.send()
            xhr.onload = () => {
                if(xhr.response === '200') {
                    document.querySelector('.stat-message').style.color = '#18bfef'
                    document.querySelector('.stat-message').innerHTML = `<i class='fas fa-check'></i> Message envoy&eacute;.`

                    document.querySelector('#message-input').value = ''
                    document.querySelector('#email-input').value = ''
                    document.querySelector('input#name-input').value = ''

                } else {
                    document.querySelector('.stat-message').style.color = '#e26363'
                    document.querySelector('.stat-message').style.alignSelf = 'center'
                    document.querySelector('.stat-message').innerHTML = `<i class='fas fa-exclamation-circle'></i> Message non envoy&eacute;, rechargez la page ensuite r&eacute;essayez.`
                }
            }
        } else {
            document.querySelector('.stat-message').style.color = '#e26363'
            document.querySelector('.stat-message').innerHTML = `<i class='fas fa-exclamation-circle'></i> Veuillez remplir tous les champs.`
        }

    })
}

sendMessage()