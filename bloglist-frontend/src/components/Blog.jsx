import { useState } from 'react'

const Blog = ({ blog,
    increaseLikes,
    currentUser,
    handleDelete
}) => {
    const [visible, setVisible] = useState(false)

    let label = 'view'
    const handleView = (text) => {
        setVisible(!visible)
        label = text
    }
    const showWhenVisible = { display: visible ? '' : 'none' }

    let userIsTheCreatorOfBlog = false
    if(blog.user && currentUser.username === blog.user.username)
        userIsTheCreatorOfBlog = true

    return (
        <div className='blog'>
            <span>{blog.title} {blog.author}</span>
            <button onClick={() => handleView(visible ? 'view' : 'hide')}>{label}</button>
            <div style={showWhenVisible}>
                {blog.url} <br />
                likes {blog.likes} {' '}
                <button onClick={() => increaseLikes(blog)}>like</button> <br />
                {blog.user ? `${blog.user.name}` : ''}
                {userIsTheCreatorOfBlog ? (
                    <button onClick={() => handleDelete(blog)}>remove</button>
                ) : ''}
            </div>
        </div>
    )
}

export default Blog