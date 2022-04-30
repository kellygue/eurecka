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