self.addEventListener('message', e => {
    if ((e.data[0] === 'download') && ('caches' in self)) {

        let id = e.data[1], url = `/billets/${id}.html`

        caches.open("eurecka-cache-v1").then(cache => {
            cache.match(new Request(url))
            .then(res => {
                if(res == undefined) {
                    cache.add(new Request(url))
                    .then(res => {
                        postMessage('success')
                    }).catch(err => postMessage(`error`))
                } else {
                    cache.delete(new Request(url))
                    postMessage('deleted')
                }
            })
            
        }).catch(err => console.error(`Unable to download the article with code : ${id}`, err))
    } else {
        postMessage(false)
    }
})