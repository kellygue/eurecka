const itemName = 'eurecka-downloaded-posts-2811'

const downloadedCodes = (itemName) => {
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

const downloadedPosts = async () => {
	const allPosts = await fetch('/assets/data/posts.json').then(response => response.json())

	const getCode = (pub_date) => {
		let post_code
        // determinons le code du premier article
        post_code = `${new Date(pub_date).getDate()}${new Date(pub_date).getMonth().toString().length === 1 ? '0' + (new Date(pub_date).getMonth() + 1).toString() : new Date(pub_date).getMonth() + 1}${new Date(pub_date).getFullYear()}`
		return post_code
	}

	var nbrOfDownloads = 0
	// loop
	allPosts.forEach(({publish_date, titre}) => {
		const code = getCode(publish_date)
		
		if (downloadedCodes(itemName).includes(code)) {
			const tr = document.createElement('tr')
			const btn = `<button onclick="deletePost(${code}, '${titre}')" class='small primary'><i class='fas fa-trash'></i></button>`
			
			tr.innerHTML = `
			<td>
				<a href='/0${code}'>${titre}</a>
			</td>
			<td>${btn}</td>
			`
			document.querySelector('#tableBody').innerHTML = ''
			document.querySelector('#tableBody').prepend(tr)
			nbrOfDownloads++
		}
		
	})
	
	if (nbrOfDownloads === 0) {
		document.querySelector('table').innerHTML = `
		<h5>
			Vous n'avez t&eacute;l&eacute;charg&eacute; aucun article pour le moment.
		</h5>
		`
	}
}

downloadedPosts()

function deletePost (code, titre) {
	let downloadPostWorker = new Worker('/assets/js/downloadPost-worker.js')
	downloadPostWorker.postMessage(['download', code])
	downloadPostWorker.onmessage = e => {
		let response = e.data
		
		if (response === 'deleted') {

			let old = downloadedCodes(itemName),
			newD = old.splice(old.indexOf(code.toString()), 1, '')
            localStorage.setItem(itemName, old)

			memobieAlert({ 'text': `<p><b>${titre.replace('==', '\'')}</b> a bien &eacute;t&eacute; supprim&eacute;</p>`, "type": "success" })

			downloadedPosts()

		} else {
			memobieAlert({ 'text': `<p>Une erreur est survenue lors de la suppression de l'article</p>`, "type": "error" })
		}
	}
}