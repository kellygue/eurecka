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