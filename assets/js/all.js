/* UNE COMBINAISON DES FICHIERS SUIVANTS :

            1 - prepa.js
            2 - getposts.js
            3 - pagination.js
            4 - sendMessage.js
            5 - alert.js
            
*/

function init () {
    document.cookie = 'memobie-pagination-number=1' // par defaut
    window.MEMOBIE_PAGINATION_NUMBER = 1
    window.MEMOBIE_NUMBER_OF_ARTICLES = 0
    // display des paginations
    let x = setInterval(() => {
        if (MEMOBIE_NUMBER_OF_ARTICLES > 0){
            var previous_a = document.createElement('a'),
            next_a = document.createElement('a')

            previous_a.className = 'previous pagination-item'
            previous_a.href = '#previous'
            previous_a.innerHTML = 'prev'
            previous_a.addEventListener('click', e => {
                e.preventDefault()
                if (MEMOBIE_PAGINATION_NUMBER > 1) {
                    window.MEMOBIE_PAGINATION_NUMBER -= 1
                    document.querySelector('.toheaderbutton').click()
                    getLocalPosts()
                    gestion_next_previous_active(next_a, previous_a)
                }
            })

            next_a.className = 'next pagination-item'
            next_a.href = '#next'
            next_a.innerHTML = 'next'
            next_a.addEventListener('click', e => {
                e.preventDefault()
                if (MEMOBIE_PAGINATION_NUMBER < Math.ceil(MEMOBIE_NUMBER_OF_ARTICLES / 5)) {
                    window.MEMOBIE_PAGINATION_NUMBER += 1
                    document.querySelector('.toheaderbutton').click()
                    getLocalPosts()
                    gestion_next_previous_active(next_a, previous_a)
                }
            })
            

            for (let i = 1; i <= Math.ceil(MEMOBIE_NUMBER_OF_ARTICLES / 5); i++) {
                let a = document.createElement('a')
                a.href = `#${i}`
                a.className = `page pagination-item`
                a.innerHTML = i
                document.querySelector('#pagination-box').append(a)
            }
            
            document.querySelector('#pagination-box').prepend(previous_a)
            document.querySelector('#pagination-box').append(next_a)
            gestion_next_previous_active(next_a, previous_a)

            document.querySelectorAll('.pagination-item.page').forEach(item => {
                item.addEventListener('click', e => {
                    e.preventDefault()
                    if (MEMOBIE_PAGINATION_NUMBER == item.href.slice(-1)) {
                        return
                    }
                    window.MEMOBIE_PAGINATION_NUMBER = item.href.slice(-1)
                    // Effectuer un getLocalPosts et retourner en haut
                    document.querySelector('.toheaderbutton').click()
                    getLocalPosts()
                    
                    // gestion de next et previous
                    gestion_next_previous_active(next_a, previous_a)
                })
            })

            clearInterval(x)
        }
    }, 500);
}

init()

function gestion_next_previous_active (next_a, previous_a) {
    if ((MEMOBIE_PAGINATION_NUMBER > 1) && (MEMOBIE_PAGINATION_NUMBER < Math.ceil(MEMOBIE_NUMBER_OF_ARTICLES / 5))) {
        if (!document.querySelector('#pagination-box .next')) {
            document.querySelector('#pagination-box').append(next_a)
        }
        if(!document.querySelector('#pagination-box .previous')) {
            document.querySelector('#pagination-box').prepend(previous_a)
        }
    } else if (MEMOBIE_PAGINATION_NUMBER <= 1) {
        if (document.querySelector('#pagination-box .previous')) {
            document.querySelector('#pagination-box').removeChild(previous_a)
        }
        if ((MEMOBIE_PAGINATION_NUMBER < Math.ceil(MEMOBIE_NUMBER_OF_ARTICLES / 5)) || (!document.querySelector('#pagination-box .next'))) {
            document.querySelector('#pagination-box').append(next_a)
        } else {
            document.querySelector('#pagination-box').removeChild(next_a)
        }
    } else if (MEMOBIE_PAGINATION_NUMBER >= Math.ceil(MEMOBIE_NUMBER_OF_ARTICLES / 5)) {
        if (document.querySelector('#pagination-box .next')) {
            document.querySelector('#pagination-box').removeChild(next_a)
        }
        if(MEMOBIE_PAGINATION_NUMBER > 1 && !document.querySelector('#pagination-box .previous')) {
            document.querySelector('#pagination-box').prepend(previous_a)
        }
    }

    // Gestion de la classe .active
    document.querySelectorAll('.pagination-item').forEach(elm => {
        if (elm.textContent == MEMOBIE_PAGINATION_NUMBER) {
            elm.className += ' active'
        } else {
            elm.className = elm.className.replace('active', '')
        }
    })
}
// Edition de la nav -- Ne pas toucher
function ajustNav () {
    let donnees = document.cookie.split('; '),
    lastPostId = () => {
        let id
        donnees.forEach(data => {
            if(data.split('=')[0].includes('memobie-last-post-id')) {
                id = data.split('=')[1]
            }
        })
        return id
    },
    lastPostPublishDate = () => {
        let publishDate
        donnees.forEach(elm  => {
            if(elm.split('=')[0].includes('memobie-last-post-publish-date')) {
                publishDate = elm.split('=')[1]
            }
        })
        return decodeURIComponent(publishDate)
    },
    months = ['Janvier', 'F&eacute;vrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Ao&ucirc;t', 'Septembre', 'Octobre', 'Novembre', 'D&eacute;cembre']

    // document.querySelector('#nav-last-article').innerHTML = lastPostPublishDate() | Inutile car j'ai mis dernier article au lieu de la date de publication du dernier article
    document.querySelector('#nav-last-article').innerHTML = 'Dernier article'

    document.cookie.split('; ').forEach(c => {
        if (c.includes('memobie-last-post-publish-date')) {
            let x = decodeURIComponent(c.split('=')[1]).split(' '), y = '0' + (months.indexOf(x[1]) + 1).toString()
            let e = x.splice(1, 1, y)
            document.querySelector('#nav-last-article').href = `/0${x.join('')}`
        }
    })

    // document.querySelector('#nav-last-article').href = `/billets/art-${lastPostId()}.html`

    // si on est dans le dernier article

    if(document.querySelector('#global-art-id') && document.querySelector('#global-art-id').value === lastPostId()) {
        document.querySelector("#nav-last-article").parentElement.className = 'active'
    }

}

ajustNav()
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
window.onload = () => {
    // registration of the service worker
    if ( "serviceWorker" in navigator) {
        navigator.serviceWorker.register('/sw-eurecka.js')
        .then(registration => {
            // do something with the registration 
        })
        .catch(err => console.error(`Unable the install the service worker`, err))
    } else {
        console.error(`Your browser does not support PWA`);
    }
}
function getLocalPosts() {

    let xhr = new XMLHttpRequest, article, publish_date_formated, months, _date, _preformated, counter, post_code, first_post

    xhr.open('GET', '/assets/data/posts.json')
    xhr.responseType = 'json'
    xhr.onload = () => {

        first_post = xhr.response[((MEMOBIE_PAGINATION_NUMBER * 5) - 5)]

        // definition de variables utiles
        months = ['Janvier', 'F&eacute;vrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Ao&ucirc;t', 'Septembre', 'Octobre', 'Novembre', 'D&eacute;cembre']
        
        _preformated = `${new Date(first_post.publish_date).getDate()} ${months[new Date(first_post.publish_date).getMonth()]} ${new Date(first_post.publish_date).getFullYear()}`

        // determinons le code du premier article
        first_post_code = `${new Date(first_post.publish_date).getDate()}${new Date(first_post.publish_date).getMonth().toString().length === 1 ? '0' + (new Date(first_post.publish_date).getMonth() + 1).toString() : new Date(first_post.publish_date).getMonth() + 1}${new Date(first_post.publish_date).getFullYear()}`

        counter = -1 // compteur || important pour l'affichage de l'article tout en haut
        window.MEMOBIE_NUMBER_OF_ARTICLES = xhr.response.length // Important pour enregistrer le nombre d'article sous forme de cookie - utile pour pagination

        // enregistre quelques infos sur la derniere publication | pour affichage dans la nav - fait pour la page about
        document.cookie = `memobie-last-post-publish-date=${encodeURIComponent(_preformated)}`
        document.cookie = `memobie-last-post-id=${xhr.response[0].id}`

        // edition de l'article featured - premier article d'une slice
        document.querySelector('#main article#featured').innerHTML = `
            <header class="major">
                <span class="date">${_preformated}</span>
                <h2><a href="/0${first_post_code}">${first_post.titre}</a></h2>
                <p>${first_post.descr}</p>
            </header>
            <a href="/0${first_post_code}" class="image main"><img loading='lazy' src="https://eurecka.imgix.net/rep${first_post.id}.jpg" alt="${first_post.titre}" /></a>
            <ul class="actions special">
                <li><a href="/0${first_post_code}" class="button large">Lire l'article</a></li>
            </ul>
            `
        // display des resultat - max 5
        document.querySelector('#posts-section').innerHTML = ' ' // effacer le contenu de la box
        xhr.response.slice((MEMOBIE_PAGINATION_NUMBER * 5) - 5, MEMOBIE_PAGINATION_NUMBER * 5).forEach(postData => {
            // important pour sauter le premier article du slice
            counter += 1
            if (counter <= 0) {
                return
            }
            // formatage de la date a afficher
            _date = new Date(postData.publish_date)
            publish_date_formated = `${_date.getDate()} ${months[_date.getMonth()]} ${_date.getFullYear()}`
            // Determiner le code du post pour generer le lien vers le fichier du post | Si le mois contient un seul chiffre on ajoute un 0 devant le chiffre sinon on laisse
            post_code = `${_date.getDate()}${_date.getMonth().toString().length === 1 ? '0' + (_date.getMonth() + 1).toString(): _date.getMonth() + 1}${_date.getFullYear()}`

            article = document.createElement('article')
            article.innerHTML = `
                <header>
                    <span class="date">${publish_date_formated}</span>
                    <h2><a href="/0${post_code}">${postData.titre}</a></h2>
                </header>
                <a href="/0${post_code}" class="image fit"><img loading='lazy' src="https://eurecka.imgix.net/rep${postData.id}.jpg" alt="${postData.titre}"/></a>
                <p>${postData.descr}</p>
                <ul class="actions special">
                    <li><a href="/0${post_code}" class="button full">Lire l'article</a></li>
                    <li class='coin'>
                        <button type='button' onclick='downloadPost(${post_code}, "${encodeURIComponent(postData.titre).replace('\'', '==')}", this)' class='icon full btn-${post_code}'>
                            <i class='fas fa-download icon-${post_code}'></i>
                        </button>
                    </li>
                </ul>
            `
            document.querySelector('#posts-section').appendChild(article)

            // lance la fonction de verification de telechargement
            storageAndElmModifier(post_code, `btn-${post_code}`, true)
        })
    }
    xhr.send()
}
// Call the function to get data locally
getLocalPosts()

const getOnlinePostsWorker = new Worker('/assets/js/getOnlinePosts-worker.js')
getOnlinePostsWorker.postMessage('get')

// fonction de telechargement des articles - aappel a un worker
async function downloadPost (code, title, elm) {
    let downloadPostWorker = new Worker('/assets/js/downloadPost-worker.js'), response
    downloadPostWorker.postMessage(['download', code])
    downloadPostWorker.onmessage = e => {
        response = e.data
        
        if (response === 'success') {
            memobieAlert({ 'text': `<p><b>${decodeURIComponent(title).replace('==', '\'')}</b> e &eacute;t&eacute; t&eacute;l&eacute;charg&eacute;</p>`, "type": "success" })

            // Ajouter le nouveau downloaded post au local storage s'il n'y etait pas deja et cchanger apparence
            storageAndElmModifier(code, elm, true, true)

            const notif = new Notification(`Téléchargement réussi`, {
                body: `L'article a bien été téléchargé`,
                icon: '/images/icons/logo144.png'
            })

            notif.addEventListener('click', () => {
                document.location.href = `/0${code}`
            })

        } else if (response === 'error') {

            memobieAlert({ 'text': `<p><b>${decodeURIComponent(title).replace('==', '\'')}</b> n'a pas pu &ecirc;tre t&eacute;l&eacute;charg&eacute;</p>`, "type": "error" })

        } else if (response === 'deleted') {

            memobieAlert({ 'text': `<p><b>${decodeURIComponent(title).replace('==', '\'')}</b> a bien &eacute;t&eacute; supprim&eacute;</p>`, "type": "info" })
        
            storageAndElmModifier(code, `btn-${code}`, false, false, true)

        } else {
            memobieAlert({ 'text': `<p><b>${decodeURIComponent(title).replace('==', '\'')}</b> n'a pas pu &ecirc;tre t&eacute;l&eacute;charg&eacute;</p>`, "type": "error" })
        }
    }
}


function storageAndElmModifier (code, elm, changeApparence = false, addToStorage = false, removeIt = false) {
    const itemName = 'eurecka-downloaded-posts-2811'	// Important
    const getActualData = () => {	// fonction qui prend les valeurs de le localstorage pur l'item : itemName et qui les renvoi sous forme de tableau, meme vide.
        /* Doit imperativement retourner un tableau */
        // si le localstorage contion kelkeu chose
        if (localStorage.getItem(itemName) !== null) {
            // si ce kelkeu chose est plusieurs, c'est-a-dire le localstorage coomprend plus d'un item
            // on return un tableau du genre [item1, item2]
            if (localStorage.getItem(itemName).includes(',')) {
                return localStorage.getItem(itemName).split(',') 
            }
            // si ce klekeu chose est un seul kelkeu chose
            // on return un tableau du genre [the-only-item]
            return [`${localStorage.getItem(itemName)}`]
        }
        // si localStorage est null on return un tableau vide : []
        return []
    }

    // si l'argument elm est de type string, i.e c'est une verification pour l'affichage des post
    // on get l'element grace a la classe elm passee en param | ddu genre : btn-12022022 | ces nbrs constitue le code du post
    if (typeof(elm) === 'string') {
        elm = document.querySelector(`.${elm}`)
    }

    let newData, data2
    // si actual data est dif de null et que le post en kestion est present dans actualdata i.e dans le localstorage
    if (getActualData() !== null && getActualData().toString().includes(code)) {
        // Changer l'apparence du bouton
        if (!elm.className.includes('downloaded')) {    // if class isn't already present
            elm.className += ' primary'
            document.querySelector(`.icon-${code}`).className = `fas fa-check icon-${code}`
        }
        
        if (removeIt) {
            elm.className = `icon full btn-${code}`
            document.querySelector(`.icon-${code}`).className = `fas fa-download icon-${code}`

            data2 = getActualData()
            newData = data2.splice(getActualData().indexOf(code.toString()), 1, '')
            localStorage.setItem(itemName, data2)

        }
        
    } else {
        // si on doit l'ajoiter au localstorage
        if (addToStorage) {
            newData = [...getActualData(), `${code}`]
            localStorage.setItem(itemName, newData)
            // si on doit changer l'apparence
            // ceci est inside le if addToStorage parskeu s'il est dehors cela signifierait qu'il faut changer l'apparence d'un eleent qui n'est pas dans le localstorage i.e qui n;est pas downloaded.. s'il etait downloaded i.e dans le localstorage le plus proche parent de ce if ne serait pas appele et dnc ce if aussi
            if (changeApparence) {
                // Changer l'apparence du bouton
                if (!elm.className.includes('downloaded')) {
                    elm.className += ' primary'
                    document.querySelector(`.icon-${code}`).className = `fas fa-check icon-${code}`
                }
            }

        }
    }
}
var nbrAlert = 0
const styles = (elm, rule) => {
    rule.forEach(r => {
        let key = r.split(': ')[0],
        val = r.split(': ')[1]

        elm.style[key] = val
    })
}

function initAlert () {
    let master = document.createElement('div')
    master.id = 'memobie-master-alert'
    styles(master, [
        `position: fixed`,
        `bottom: 3vh`,
        `right: 3vw`,
        `max-width: 90%`,
        `z-index: 10`,
        `transition: all 150ms linear`,
    ])
    document.querySelector('#wrapper').appendChild(master)
}

initAlert()

const memobieAlert = (props) => {
    nbrAlert += 1
    let box = document.createElement('div')
    box.innerHTML = props.text
    box.id = `alert${nbrAlert}`
    box.className = props.type
    styles(box, [
        `padding: 12px 22px`,
        `border-radius: 2px`,
        `position: relative`,
        `z-index: 11`,
        `transition: all 200ms ease`,
        'opacity: 0',
        `margin: 2px 0`,
        `line-height: 130%`,
        `word-wrap: break-word`,
        `word-spacing: 0.10em`
    ])

    if (props.type === 'success') {
        styles(box, [
            `backgroundColor: rgb(170, 250, 170)`
        ])
    } else if (props.type === 'error') {
        styles(box, [
            `backgroundColor: rgb(250, 170, 170)`
        ])
    } else if (props.type === 'info') {
        styles(box, [
            `backgroundColor: rgb(250, 230, 100)`
        ])
    }

    document.querySelector('#memobie-master-alert').appendChild(box)
    
    document.querySelector(`#alert${nbrAlert} p`).style.margin = '0'
    document.querySelector(`#alert${nbrAlert} p`).style.fontSize = '1rem'

    setTimeout(() => {
        box.style.opacity = 1
    }, 150)

    setTimeout(() => {
        box.style.opacity = 0
        setTimeout(() => {
            document.querySelector('#memobie-master-alert').removeChild(box)
            nbrAlert -= 1
        }, 1000)
    }, 10000)
}