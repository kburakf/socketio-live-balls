const colors = ["blue", "green", "red","orange","purple"]

const randomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)]
}

module.exports = randomColor