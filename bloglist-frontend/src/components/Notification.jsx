const Notification = ({ text, type }) => {
    if (text === null) {
        return null
    }

    let className
    if (type === 'error') {
        className = 'error'
    } else if (type === 'notification') {
        className = 'notification'
    }

    return (
        <div className={className}>
            {text}
        </div>
    )
}

export default Notification