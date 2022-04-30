var nbr = 0
const styles = (elm, rule) => {
    rule.forEach(r => {
        let key = r.split(': ')[0],
        val = r.split(': ')[1]

        elm.style[key] = val
    })
}

function init () {
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

init()

const memobieAlert = (props) => {
    nbr += 1
    let box = document.createElement('div')
    box.innerHTML = props.text
    box.id = `alert${nbr}`
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
    
    document.querySelector(`#alert${nbr} p`).style.margin = '0'
    document.querySelector(`#alert${nbr} p`).style.fontSize = '1rem'

    setTimeout(() => {
        box.style.opacity = 1
    }, 150)

    setTimeout(() => {
        box.style.opacity = 0
        setTimeout(() => {
            document.querySelector('#memobie-master-alert').removeChild(box)
            nbr -= 1
        }, 1000)
    }, 10000)
}